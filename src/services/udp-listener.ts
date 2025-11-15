import * as dgram from "dgram";
import { F1TelemetryParser } from "../parsers/f1-2024-parser";
import { LapRecorder } from "./lap-recorder";
import { NormalizedTelemetryPoint, PacketType } from "../types/f1-2024-packets";
import { getTrackName, getTeamName } from "../constants/f1-2024-constants";

export class UDPListener {
  private socket: dgram.Socket;
  private parser: F1TelemetryParser;
  private recorder: LapRecorder;
  private port: number;

  private latestTelemetry: any = null;
  private latestLapData: any = null;
  private latestMotion: any = null;
  private lastX: number = 0;
  private lastY: number = 0;
  private totalDistance: number = 0;
  private currentLapNum: number = 0;
  private trackName: string = "Unknown";
  private carName: string = "Unknown";

  constructor(port: number = 20777) {
    this.port = port;
    this.socket = dgram.createSocket("udp4");
    this.parser = new F1TelemetryParser();
    this.recorder = new LapRecorder();
  }

  start() {
    this.socket.on("message", (msg: Buffer) => {
      this.handlePacket(msg);
    });

    this.socket.on("error", (err) => {
      console.error(`Socket error: ${err.message}`);
      this.socket.close();
    });

    this.socket.bind(this.port, () => {
      console.log(`F1 2024 Telemetry Listener started on port ${this.port}`);
      console.log(`Waiting for telemetry data...`);
    });
  }

  private handlePacket(buffer: Buffer) {
    const header = this.parser.parseHeader(buffer);

    switch (header.packetId) {
      case PacketType.CAR_TELEMETRY:
        const telemetry = this.parser.parseCarTelemetry(buffer);
        if (telemetry) {
          this.latestTelemetry =
            telemetry.carTelemetryData[header.playerCarIndex];
          this.mergeAndRecord(header);
        }
        break;

      case PacketType.LAP_DATA:
        const lapData = this.parser.parseLapData(buffer);
        if (lapData) {
          this.latestLapData = lapData.lapData[header.playerCarIndex];
          this.mergeAndRecord(header);
        }
        break;

      case PacketType.MOTION:
        const motion = this.parser.parseMotionData(buffer);
        if (motion) {
          this.latestMotion = motion.carMotionData[header.playerCarIndex];
          this.mergeAndRecord(header);
        }
        break;

      case PacketType.SESSION:
        const session = this.parser.parseSessionData(buffer);
        if (session) {
          this.trackName = getTrackName(session.sessionData.trackId);
          this.recorder.setTrackName(this.trackName);
        }
        break;

      case PacketType.PARTICIPANTS:
        const participants = this.parser.parseParticipantsData(buffer);
        if (participants) {
          const playerData = participants.participants[header.playerCarIndex];
          this.carName = getTeamName(playerData.teamId);
          this.recorder.setCarName(this.carName);
        }
        break;
    }
  }

  private mergeAndRecord(header: any) {
    if (!this.latestTelemetry || !this.latestLapData || !this.latestMotion) {
      return;
    }

    if (this.latestLapData.currentLapNum !== this.currentLapNum && this.currentLapNum !== 0) {
      this.totalDistance = 0;
      this.lastX = 0;
      this.lastY = 0;
    }
    this.currentLapNum = this.latestLapData.currentLapNum;

    const currentX = this.latestMotion.worldPositionX;
    const currentY = this.latestMotion.worldPositionZ;

    if (this.lastX !== 0 || this.lastY !== 0) {
      const dx = currentX - this.lastX;
      const dy = currentY - this.lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.totalDistance += distance;
    }

    this.lastX = currentX;
    this.lastY = currentY;

    const point: NormalizedTelemetryPoint = {
      time: header.sessionTime,
      distance: this.totalDistance,
      x: currentX,
      y: currentY,
      speed: this.latestTelemetry.speed,
      throttle: this.latestTelemetry.throttle,
      brake: this.latestTelemetry.brake,
      steering: this.latestTelemetry.steer,
      gear: this.latestTelemetry.gear,
      lapNum: this.latestLapData.currentLapNum,
      gLat: this.latestMotion.gForceLateral,
      gLong: this.latestMotion.gForceLongitudinal,
    };

    this.recorder.addTelemetryPoint(point);
  }

  stop() {
    this.socket.close();
    console.log("Listener stopped");
  }
}

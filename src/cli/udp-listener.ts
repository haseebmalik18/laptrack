/**
 * UDP Listener - Captures F1 2024 telemetry packets and records lap data
 *
 * Listens on port 20777, merges multiple packet types, calculates distance from X/Y position
 * (workaround for Grand Prix mode bug), and saves complete laps to CSV/JSON.
 *
 * Requires F1 2024 telemetry: UDP enabled, port 20777, broadcast mode
 */

import * as dgram from "dgram";
import { F1TelemetryParser } from "../parsers/f1-2024-parser";
import { LapRecorder } from "../services/lap-recorder";
import { NormalizedTelemetryPoint, PacketType } from "../types/f1-2024-packets";
import { getTrackName, getTeamName } from "../constants/f1-2024-constants";

class UDPListener {
  private socket: dgram.Socket;
  private parser: F1TelemetryParser;
  private recorder: LapRecorder;
  private port: number;

  private latestTelemetry: any = null;     // Speed, throttle, brake, gear, RPM
  private latestLapData: any = null;       // Timing, distance, sectors
  private latestMotion: any = null;        // Position, G-forces, yaw
  private lastX: number = 0;               // Previous X for distance calc
  private lastY: number = 0;               // Previous Y for distance calc
  private totalDistance: number = 0;       // Accumulated distance (workaround)
  private trackName: string = "Unknown";
  private trackId: number = -1;
  private carName: string = "Unknown";
  private playerCarIndex: number = -1;    // Player car index (0-21)
  private playerIndexConfirmed: boolean = false;

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

    // Process PARTICIPANTS to get player index
    switch (header.packetId) {
      case PacketType.PARTICIPANTS:
        const participants = this.parser.parseParticipantsData(buffer);
        if (participants && !this.playerIndexConfirmed) {
          this.playerCarIndex = header.playerCarIndex;
          const player = participants.participants[this.playerCarIndex];

          console.log(`Player: ${player.name} (Car ${this.playerCarIndex})`);

          this.playerIndexConfirmed = true;
          this.carName = getTeamName(player.teamId);
          this.recorder.setCarName(this.carName);
        }
        break;
    }

    // Wait until we have player index
    if (this.playerCarIndex === -1) {
      return;
    }

    switch (header.packetId) {
      case PacketType.CAR_TELEMETRY:
        const telemetry = this.parser.parseCarTelemetry(buffer);
        if (telemetry) {
          this.latestTelemetry =
            telemetry.carTelemetryData[this.playerCarIndex];
          this.mergeAndRecord(header);
        }
        break;

      case PacketType.LAP_DATA:
        const lapData = this.parser.parseLapData(buffer);
        if (lapData) {
          this.latestLapData = lapData.lapData[this.playerCarIndex];
          this.mergeAndRecord(header);
        }
        break;

      case PacketType.MOTION:
        const motion = this.parser.parseMotionData(buffer);
        if (motion) {
          this.latestMotion = motion.carMotionData[this.playerCarIndex];
          this.mergeAndRecord(header);
        }
        break;

      case PacketType.SESSION:
        const session = this.parser.parseSessionData(buffer);
        if (session && this.trackId === -1) {
          this.trackId = session.sessionData.trackId;
          this.trackName = getTrackName(this.trackId);
          this.recorder.setTrackName(this.trackName);
          this.recorder.setTrackId(this.trackId);
          console.log(`Track: ${this.trackName}`);
        }
        break;
    }
  }

  private mergeAndRecord(header: any) {
    if (!this.latestTelemetry || !this.latestLapData || !this.latestMotion) {
      return;
    }

    const currentX = this.latestMotion.worldPositionX;
    const currentY = this.latestMotion.worldPositionZ;

    // Calculate distance using Euclidean distance (workaround for Grand Prix bug)
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
      rpm: this.latestTelemetry.engineRPM,
      lapNum: 0,
      gLat: this.latestMotion.gForceLateral,
      gLong: this.latestMotion.gForceLongitudinal,
      yaw: this.latestMotion.yaw,
    };

    this.recorder.addTelemetryPoint(point);
  }

  stop() {
    this.socket.close();
    console.log("Listener stopped");
  }
}

// CLI Entry Point
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 20777;

console.log('LapLens Console Listener - F1 2024');
console.log('===================================\n');

const listener = new UDPListener(PORT);
listener.start();

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  listener.stop();
  process.exit(0);
});

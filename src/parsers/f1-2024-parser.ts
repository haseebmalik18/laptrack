import {
  PacketHeader,
  PacketType,
  PacketCarTelemetryData,
  PacketLapData,
  PacketMotionData,
  CarTelemetryData,
  LapData,
  CarMotionData,
} from '../types/f1-2024-packets';

export class F1TelemetryParser {
  parseHeader(buffer: Buffer): PacketHeader {
    return {
      packetFormat: buffer.readUInt16LE(0),
      gameYear: buffer.readUInt8(2),
      gameMajorVersion: buffer.readUInt8(3),
      gameMinorVersion: buffer.readUInt8(4),
      packetVersion: buffer.readUInt8(5),
      packetId: buffer.readUInt8(6) as PacketType,
      sessionUID: buffer.readBigUInt64LE(7),
      sessionTime: buffer.readFloatLE(15),
      frameIdentifier: buffer.readUInt32LE(19),
      overallFrameIdentifier: buffer.readUInt32LE(23),
      playerCarIndex: buffer.readUInt8(27),
      secondaryPlayerCarIndex: buffer.readUInt8(28),
    };
  }

  parseCarTelemetry(buffer: Buffer): PacketCarTelemetryData | null {
    const header = this.parseHeader(buffer);
    if (header.packetId !== PacketType.CAR_TELEMETRY) return null;

    const carTelemetryData: CarTelemetryData[] = [];
    let offset = 29;

    for (let i = 0; i < 22; i++) {
      const brakesTemp = [];
      const tyresSurfaceTemp = [];
      const tyresInnerTemp = [];
      const tyresPressure = [];
      const surfaceType = [];

      carTelemetryData.push({
        speed: buffer.readUInt16LE(offset),
        throttle: buffer.readFloatLE(offset + 2),
        steer: buffer.readFloatLE(offset + 6),
        brake: buffer.readFloatLE(offset + 10),
        clutch: buffer.readUInt8(offset + 14),
        gear: buffer.readInt8(offset + 15),
        engineRPM: buffer.readUInt16LE(offset + 16),
        drs: buffer.readUInt8(offset + 18),
        revLightsPercent: buffer.readUInt8(offset + 19),
        revLightsBitValue: buffer.readUInt16LE(offset + 20),
        brakesTemperature: [
          buffer.readUInt16LE(offset + 22),
          buffer.readUInt16LE(offset + 24),
          buffer.readUInt16LE(offset + 26),
          buffer.readUInt16LE(offset + 28),
        ],
        tyresSurfaceTemperature: [
          buffer.readUInt8(offset + 30),
          buffer.readUInt8(offset + 31),
          buffer.readUInt8(offset + 32),
          buffer.readUInt8(offset + 33),
        ],
        tyresInnerTemperature: [
          buffer.readUInt8(offset + 34),
          buffer.readUInt8(offset + 35),
          buffer.readUInt8(offset + 36),
          buffer.readUInt8(offset + 37),
        ],
        engineTemperature: buffer.readUInt16LE(offset + 38),
        tyresPressure: [
          buffer.readFloatLE(offset + 40),
          buffer.readFloatLE(offset + 44),
          buffer.readFloatLE(offset + 48),
          buffer.readFloatLE(offset + 52),
        ],
        surfaceType: [
          buffer.readUInt8(offset + 56),
          buffer.readUInt8(offset + 57),
          buffer.readUInt8(offset + 58),
          buffer.readUInt8(offset + 59),
        ],
      });

      offset += 60;
    }

    return {
      header,
      carTelemetryData,
      mfdPanelIndex: buffer.readUInt8(offset),
      mfdPanelIndexSecondaryPlayer: buffer.readUInt8(offset + 1),
      suggestedGear: buffer.readInt8(offset + 2),
    };
  }

  parseLapData(buffer: Buffer): PacketLapData | null {
    const header = this.parseHeader(buffer);
    if (header.packetId !== PacketType.LAP_DATA) return null;

    const lapData: LapData[] = [];
    let offset = 29;

    for (let i = 0; i < 22; i++) {
      lapData.push({
        lastLapTimeInMS: buffer.readUInt32LE(offset),
        currentLapTimeInMS: buffer.readUInt32LE(offset + 4),
        sector1TimeInMS: buffer.readUInt16LE(offset + 8),
        sector1TimeMinutes: buffer.readUInt8(offset + 10),
        sector2TimeInMS: buffer.readUInt16LE(offset + 11),
        sector2TimeMinutes: buffer.readUInt8(offset + 13),
        deltaToCarInFrontInMS: buffer.readUInt16LE(offset + 14),
        deltaToRaceLeaderInMS: buffer.readUInt16LE(offset + 17),
        lapDistance: buffer.readFloatLE(offset + 20),
        totalDistance: buffer.readFloatLE(offset + 24),
        safetyCarDelta: buffer.readFloatLE(offset + 28),
        carPosition: buffer.readUInt8(offset + 32),
        currentLapNum: buffer.readUInt8(offset + 33),
        pitStatus: buffer.readUInt8(offset + 34),
        numPitStops: buffer.readUInt8(offset + 35),
        sector: buffer.readUInt8(offset + 36),
        currentLapInvalid: buffer.readUInt8(offset + 37),
        penalties: buffer.readUInt8(offset + 38),
        totalWarnings: buffer.readUInt8(offset + 39),
        cornerCuttingWarnings: buffer.readUInt8(offset + 40),
        numUnservedDriveThroughPens: buffer.readUInt8(offset + 41),
        numUnservedStopGoPens: buffer.readUInt8(offset + 42),
        gridPosition: buffer.readUInt8(offset + 43),
        driverStatus: buffer.readUInt8(offset + 44),
        resultStatus: buffer.readUInt8(offset + 45),
        pitLaneTimerActive: buffer.readUInt8(offset + 46),
        pitLaneTimeInLaneInMS: buffer.readUInt16LE(offset + 47),
        pitStopTimerInMS: buffer.readUInt16LE(offset + 49),
        pitStopShouldServePen: buffer.readUInt8(offset + 51),
      });

      offset += 52;
    }

    return {
      header,
      lapData,
      timeTrialPBCarIdx: buffer.readUInt8(offset),
      timeTrialRivalCarIdx: buffer.readUInt8(offset + 1),
    };
  }

  parseMotionData(buffer: Buffer): PacketMotionData | null {
    const header = this.parseHeader(buffer);
    if (header.packetId !== PacketType.MOTION) return null;

    const carMotionData: CarMotionData[] = [];
    let offset = 29;

    for (let i = 0; i < 22; i++) {
      carMotionData.push({
        worldPositionX: buffer.readFloatLE(offset),
        worldPositionY: buffer.readFloatLE(offset + 4),
        worldPositionZ: buffer.readFloatLE(offset + 8),
        worldVelocityX: buffer.readFloatLE(offset + 12),
        worldVelocityY: buffer.readFloatLE(offset + 16),
        worldVelocityZ: buffer.readFloatLE(offset + 20),
        worldForwardDirX: buffer.readInt16LE(offset + 24),
        worldForwardDirY: buffer.readInt16LE(offset + 26),
        worldForwardDirZ: buffer.readInt16LE(offset + 28),
        worldRightDirX: buffer.readInt16LE(offset + 30),
        worldRightDirY: buffer.readInt16LE(offset + 32),
        worldRightDirZ: buffer.readInt16LE(offset + 34),
        gForceLateral: buffer.readFloatLE(offset + 36),
        gForceLongitudinal: buffer.readFloatLE(offset + 40),
        gForceVertical: buffer.readFloatLE(offset + 44),
        yaw: buffer.readFloatLE(offset + 48),
        pitch: buffer.readFloatLE(offset + 52),
        roll: buffer.readFloatLE(offset + 56),
      });

      offset += 60;
    }

    return {
      header,
      carMotionData,
    };
  }
}

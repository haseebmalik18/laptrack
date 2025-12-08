/**
 * F1 2024 Telemetry Parser - Converts binary UDP packets to TypeScript objects
 *
 * Handles byte-level parsing with Little Endian format for F1 2024 telemetry spec.
 */

import {
  PacketHeader,
  PacketType,
  PacketCarTelemetryData,
  PacketLapData,
  PacketMotionData,
  PacketSessionData,
  PacketParticipantsData,
  CarTelemetryData,
  LapData,
  CarMotionData,
  SessionData,
  ParticipantData,
} from "../types/f1-2024-packets";

export class F1TelemetryParser {
  // Parse packet header (29 bytes - identical across all packet types)
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

  // Parse telemetry packet (60Hz - speed, throttle, brake, gear, temps)
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

  // Parse lap data packet (timing, sectors, position, pit status)
  // BUG: lapDistance often 0 in Grand Prix mode
  parseLapData(buffer: Buffer): PacketLapData | null {
    const header = this.parseHeader(buffer);
    if (header.packetId !== PacketType.LAP_DATA) return null;

    const lapData: LapData[] = [];
    let offset = 29;

    for (let i = 0; i < 22; i++) {
      // 54 bytes per car (2 bytes added in F1 2024)
      lapData.push({
        lastLapTimeInMS: buffer.readUInt32LE(offset + 0),
        currentLapTimeInMS: buffer.readUInt32LE(offset + 4),
        sector1TimeInMS: buffer.readUInt16LE(offset + 8),
        sector1TimeMinutes: buffer.readUInt8(offset + 10),
        sector2TimeInMS: buffer.readUInt16LE(offset + 11),
        sector2TimeMinutes: buffer.readUInt8(offset + 13),
        deltaToCarInFrontInMS: buffer.readUInt16LE(offset + 14),
        deltaToCarInFrontMinutes: buffer.readUInt8(offset + 16),
        deltaToRaceLeaderInMS: buffer.readUInt16LE(offset + 17),
        deltaToRaceLeaderMinutes: buffer.readUInt8(offset + 19),
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

      offset += 54; // Changed from 52 to 54 bytes per lap entry!
    }

    return {
      header,
      lapData,
      timeTrialPBCarIdx: buffer.readUInt8(offset),
      timeTrialRivalCarIdx: buffer.readUInt8(offset + 1),
    };
  }

  // Parse motion packet (60Hz - position, velocity, G-forces, yaw/pitch/roll)
  // Critical for corner detection and track mapping
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

  // Parse session packet (~2Hz - track info, weather, session type)
  // Contains track ID essential for corner database lookup
  parseSessionData(buffer: Buffer): PacketSessionData | null {
    const header = this.parseHeader(buffer);
    if (header.packetId !== PacketType.SESSION) return null;

    let offset = 29;

    const sessionData: SessionData = {
      weather: buffer.readUInt8(offset),
      trackTemperature: buffer.readInt8(offset + 1),
      airTemperature: buffer.readInt8(offset + 2),
      totalLaps: buffer.readUInt8(offset + 3),
      trackLength: buffer.readUInt16LE(offset + 4),
      sessionType: buffer.readUInt8(offset + 6),
      trackId: buffer.readInt8(offset + 7),
      formula: buffer.readUInt8(offset + 8),
      sessionTimeLeft: buffer.readUInt16LE(offset + 9),
      sessionDuration: buffer.readUInt16LE(offset + 11),
      pitSpeedLimit: buffer.readUInt8(offset + 13),
      gamePaused: buffer.readUInt8(offset + 14),
      isSpectating: buffer.readUInt8(offset + 15),
      spectatorCarIndex: buffer.readUInt8(offset + 16),
      sliProNativeSupport: buffer.readUInt8(offset + 17),
      numMarshalZones: buffer.readUInt8(offset + 18),
      marshalZones: [],
      safetyCarStatus: buffer.readUInt8(offset + 19 + 21 * 5),
      networkGame: buffer.readUInt8(offset + 124),
      numWeatherForecastSamples: buffer.readUInt8(offset + 125),
      weatherForecastSamples: [],
      forecastAccuracy: buffer.readUInt8(offset + 126 + 56 * 8),
      aiDifficulty: buffer.readUInt8(offset + 575),
      seasonLinkIdentifier: buffer.readUInt32LE(offset + 576),
      weekendLinkIdentifier: buffer.readUInt32LE(offset + 580),
      sessionLinkIdentifier: buffer.readUInt32LE(offset + 584),
      pitStopWindowIdealLap: buffer.readUInt8(offset + 588),
      pitStopWindowLatestLap: buffer.readUInt8(offset + 589),
      pitStopRejoinPosition: buffer.readUInt8(offset + 590),
      steeringAssist: buffer.readUInt8(offset + 591),
      brakingAssist: buffer.readUInt8(offset + 592),
      gearboxAssist: buffer.readUInt8(offset + 593),
      pitAssist: buffer.readUInt8(offset + 594),
      pitReleaseAssist: buffer.readUInt8(offset + 595),
      ERSAssist: buffer.readUInt8(offset + 596),
      DRSAssist: buffer.readUInt8(offset + 597),
      dynamicRacingLine: buffer.readUInt8(offset + 598),
      dynamicRacingLineType: buffer.readUInt8(offset + 599),
      gameMode: buffer.readUInt8(offset + 600),
      ruleSet: buffer.readUInt8(offset + 601),
      timeOfDay: buffer.readUInt32LE(offset + 602),
      sessionLength: buffer.readUInt8(offset + 606),
      speedUnitsLeadPlayer: buffer.readUInt8(offset + 607),
      temperatureUnitsLeadPlayer: buffer.readUInt8(offset + 608),
      speedUnitsSecondaryPlayer: buffer.readUInt8(offset + 609),
      temperatureUnitsSecondaryPlayer: buffer.readUInt8(offset + 610),
      numSafetyCarPeriods: buffer.readUInt8(offset + 611),
      numVirtualSafetyCarPeriods: buffer.readUInt8(offset + 612),
      numRedFlagPeriods: buffer.readUInt8(offset + 613),
    };

    return {
      header,
      sessionData,
    };
  }

  // Parse participants packet (driver names, teams, nationalities)
  // Sent once at session start
  parseParticipantsData(buffer: Buffer): PacketParticipantsData | null {
    const header = this.parseHeader(buffer);
    if (header.packetId !== PacketType.PARTICIPANTS) return null;

    let offset = 29;
    const numActiveCars = buffer.readUInt8(offset);
    offset += 1;

    const participants: ParticipantData[] = [];

    for (let i = 0; i < 22; i++) {
      const nameBytes = buffer.subarray(offset + 7, offset + 55);
      const nameStr = nameBytes.toString("utf-8").replace(/\0/g, "").trim();

      participants.push({
        aiControlled: buffer.readUInt8(offset),
        driverId: buffer.readUInt8(offset + 1),
        networkId: buffer.readUInt8(offset + 2),
        teamId: buffer.readUInt8(offset + 3),
        myTeam: buffer.readUInt8(offset + 4),
        raceNumber: buffer.readUInt8(offset + 5),
        nationality: buffer.readUInt8(offset + 6),
        name: nameStr,
        yourTelemetry: buffer.readUInt8(offset + 55),
        showOnlineNames: buffer.readUInt8(offset + 56),
        platform: buffer.readUInt8(offset + 57),
      });

      offset += 58;
    }

    return {
      header,
      numActiveCars,
      participants,
    };
  }
}

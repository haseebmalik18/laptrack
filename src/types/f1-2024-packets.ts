/**
 * F1 2024 Packet Types - UDP telemetry packet definitions
 * Broadcast on port 20777 when telemetry enabled
 */

export enum PacketType {
  MOTION = 0, // Position, rotation, G-forces (60Hz)
  SESSION = 1, // Session and track info (2Hz)
  LAP_DATA = 2, // Lap times, sectors, pit status
  EVENT = 3, // Session events
  PARTICIPANTS = 4, // Driver info (once per session)
  CAR_SETUPS = 5, // Car setup details
  CAR_TELEMETRY = 6, // Speed, throttle, brake, gear (60Hz)
  CAR_STATUS = 7, // Fuel, ERS, tire wear
  FINAL_CLASSIFICATION = 8, // Final race results
  LOBBY_INFO = 9, // Multiplayer lobby info
  CAR_DAMAGE = 10, // Damage state
  SESSION_HISTORY = 11, // Historical lap data
  TYRE_SETS = 12, // Tire set info
  MOTION_EX = 13, // Extended motion data
}

export interface PacketHeader {
  packetFormat: number; // Packet format version
  gameYear: number; // Game year (24)
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: PacketType;
  sessionUID: bigint; // Unique session ID
  sessionTime: number; // Seconds since session start
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number; // Player car index (0-21)
  secondaryPlayerCarIndex: number; // Split-screen (255 if unused)
}

export interface CarTelemetryData {
  speed: number; // km/h
  throttle: number; // 0-1
  steer: number; // -1 to 1
  brake: number; // 0-1
  clutch: number; // 0-100
  gear: number; // -1=reverse, 0=neutral, 1-8=forward
  engineRPM: number;
  drs: number; // 0=off, 1=on
  revLightsPercent: number; // 0-100
  revLightsBitValue: number;
  brakesTemperature: number[]; // [RL, RR, FL, FR] Celsius
  tyresSurfaceTemperature: number[];
  tyresInnerTemperature: number[];
  engineTemperature: number;
  tyresPressure: number[]; // PSI
  surfaceType: number[]; // 0=tarmac, 1=grass, etc
}

export interface PacketCarTelemetryData {
  header: PacketHeader;
  carTelemetryData: CarTelemetryData[]; // All 22 cars
  mfdPanelIndex: number;
  mfdPanelIndexSecondaryPlayer: number;
  suggestedGear: number; // -1 to 8
}

// 54 bytes per car (2 bytes added in F1 2024)
// BUG: lapDistance often 0 in Grand Prix mode - use calculated distance
export interface LapData {
  lastLapTimeInMS: number;
  currentLapTimeInMS: number;
  sector1TimeInMS: number;
  sector1TimeMinutes: number;
  sector2TimeInMS: number;
  sector2TimeMinutes: number;
  deltaToCarInFrontInMS: number;
  deltaToCarInFrontMinutes: number;
  deltaToRaceLeaderInMS: number;
  deltaToRaceLeaderMinutes: number;
  lapDistance: number; // BUG: often 0 for player
  totalDistance: number;
  safetyCarDelta: number;
  carPosition: number; // 1-22
  currentLapNum: number;
  pitStatus: number; // 0=none, 1=pitting, 2=in pit
  numPitStops: number;
  sector: number; // 0=S1, 1=S2, 2=S3
  currentLapInvalid: number; // 0=valid, 1=invalid
  penalties: number; // Seconds
  totalWarnings: number;
  cornerCuttingWarnings: number;
  numUnservedDriveThroughPens: number;
  numUnservedStopGoPens: number;
  gridPosition: number; // 1-22
  driverStatus: number;
  resultStatus: number;
  pitLaneTimerActive: number;
  pitLaneTimeInLaneInMS: number;
  pitStopTimerInMS: number;
  pitStopShouldServePen: number; // 0=no, 1=yes
}

export interface PacketLapData {
  header: PacketHeader;
  lapData: LapData[];            // All 22 cars
  timeTrialPBCarIdx: number;
  timeTrialRivalCarIdx: number;
}

// 60 bytes per car - essential for track mapping (60Hz)
export interface CarMotionData {
  worldPositionX: number;        // World X (meters) - for track mapping
  worldPositionY: number;        // World Y (vertical/height)
  worldPositionZ: number;        // World Z (meters) - for track mapping
  worldVelocityX: number;        // m/s
  worldVelocityY: number;
  worldVelocityZ: number;
  worldForwardDirX: number;      // Normalized
  worldForwardDirY: number;
  worldForwardDirZ: number;
  worldRightDirX: number;        // Normalized
  worldRightDirY: number;
  worldRightDirZ: number;
  gForceLateral: number;         // Left/right (+ = right, - = left)
  gForceLongitudinal: number;    // Braking/accel (+ = accel, - = brake)
  gForceVertical: number;
  yaw: number;                   // Radians - CRITICAL for corner detection
  pitch: number;                 // Radians
  roll: number;                  // Radians
}

export interface PacketMotionData {
  header: PacketHeader;
  carMotionData: CarMotionData[]; // All 22 cars (60Hz)
}

export interface SessionData {
  weather: number;
  trackTemperature: number;
  airTemperature: number;
  totalLaps: number;
  trackLength: number;
  sessionType: number;
  trackId: number;
  formula: number;
  sessionTimeLeft: number;
  sessionDuration: number;
  pitSpeedLimit: number;
  gamePaused: number;
  isSpectating: number;
  spectatorCarIndex: number;
  sliProNativeSupport: number;
  numMarshalZones: number;
  marshalZones: any[];
  safetyCarStatus: number;
  networkGame: number;
  numWeatherForecastSamples: number;
  weatherForecastSamples: any[];
  forecastAccuracy: number;
  aiDifficulty: number;
  seasonLinkIdentifier: number;
  weekendLinkIdentifier: number;
  sessionLinkIdentifier: number;
  pitStopWindowIdealLap: number;
  pitStopWindowLatestLap: number;
  pitStopRejoinPosition: number;
  steeringAssist: number;
  brakingAssist: number;
  gearboxAssist: number;
  pitAssist: number;
  pitReleaseAssist: number;
  ERSAssist: number;
  DRSAssist: number;
  dynamicRacingLine: number;
  dynamicRacingLineType: number;
  gameMode: number;
  ruleSet: number;
  timeOfDay: number;
  sessionLength: number;
  speedUnitsLeadPlayer: number;
  temperatureUnitsLeadPlayer: number;
  speedUnitsSecondaryPlayer: number;
  temperatureUnitsSecondaryPlayer: number;
  numSafetyCarPeriods: number;
  numVirtualSafetyCarPeriods: number;
  numRedFlagPeriods: number;
}

export interface PacketSessionData {
  header: PacketHeader;
  sessionData: SessionData;
}

export interface ParticipantData {
  aiControlled: number;
  driverId: number;
  networkId: number;
  teamId: number;
  myTeam: number;
  raceNumber: number;
  nationality: number;
  name: string;
  yourTelemetry: number;
  showOnlineNames: number;
  platform: number;
}

export interface PacketParticipantsData {
  header: PacketHeader;
  numActiveCars: number;
  participants: ParticipantData[];
}

// Normalized telemetry - 1 meter spacing for consistent analysis
// Example: 17,340 raw points → 5,452 normalized (Bahrain)
export interface NormalizedTelemetryPoint {
  time: number;                  // Seconds since lap start
  distance: number;              // Meters from start/finish (0 to track length)
  x: number;                     // World X (meters) - for track mapping
  y: number;                     // World Y/Z (meters) - for track mapping
  speed: number;                 // km/h
  throttle: number;              // 0-1
  brake: number;                 // 0-1
  steering: number;              // -1 to 1
  gear: number;                  // -1=reverse, 0=neutral, 1-8=forward
  rpm: number;
  lapNum: number;
  gLat: number;                  // Lateral G (cornering)
  gLong: number;                 // Longitudinal G (braking/accel)
  yaw: number;                   // Radians - for corner detection
  [key: string]: number;         // Index signature for interpolation
}

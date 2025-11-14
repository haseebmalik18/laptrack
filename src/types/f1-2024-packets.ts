export enum PacketType {
  MOTION = 0,
  SESSION = 1,
  LAP_DATA = 2,
  EVENT = 3,
  PARTICIPANTS = 4,
  CAR_SETUPS = 5,
  CAR_TELEMETRY = 6,
  CAR_STATUS = 7,
  FINAL_CLASSIFICATION = 8,
  LOBBY_INFO = 9,
  CAR_DAMAGE = 10,
  SESSION_HISTORY = 11,
  TYRE_SETS = 12,
  MOTION_EX = 13,
}

export interface PacketHeader {
  packetFormat: number;
  gameYear: number;
  gameMajorVersion: number;
  gameMinorVersion: number;
  packetVersion: number;
  packetId: PacketType;
  sessionUID: bigint;
  sessionTime: number;
  frameIdentifier: number;
  overallFrameIdentifier: number;
  playerCarIndex: number;
  secondaryPlayerCarIndex: number;
}

export interface CarTelemetryData {
  speed: number;
  throttle: number;
  steer: number;
  brake: number;
  clutch: number;
  gear: number;
  engineRPM: number;
  drs: number;
  revLightsPercent: number;
  revLightsBitValue: number;
  brakesTemperature: number[];
  tyresSurfaceTemperature: number[];
  tyresInnerTemperature: number[];
  engineTemperature: number;
  tyresPressure: number[];
  surfaceType: number[];
}

export interface PacketCarTelemetryData {
  header: PacketHeader;
  carTelemetryData: CarTelemetryData[];
  mfdPanelIndex: number;
  mfdPanelIndexSecondaryPlayer: number;
  suggestedGear: number;
}

export interface LapData {
  lastLapTimeInMS: number;
  currentLapTimeInMS: number;
  sector1TimeInMS: number;
  sector1TimeMinutes: number;
  sector2TimeInMS: number;
  sector2TimeMinutes: number;
  deltaToCarInFrontInMS: number;
  deltaToRaceLeaderInMS: number;
  lapDistance: number;
  totalDistance: number;
  safetyCarDelta: number;
  carPosition: number;
  currentLapNum: number;
  pitStatus: number;
  numPitStops: number;
  sector: number;
  currentLapInvalid: number;
  penalties: number;
  totalWarnings: number;
  cornerCuttingWarnings: number;
  numUnservedDriveThroughPens: number;
  numUnservedStopGoPens: number;
  gridPosition: number;
  driverStatus: number;
  resultStatus: number;
  pitLaneTimerActive: number;
  pitLaneTimeInLaneInMS: number;
  pitStopTimerInMS: number;
  pitStopShouldServePen: number;
}

export interface PacketLapData {
  header: PacketHeader;
  lapData: LapData[];
  timeTrialPBCarIdx: number;
  timeTrialRivalCarIdx: number;
}

export interface CarMotionData {
  worldPositionX: number;
  worldPositionY: number;
  worldPositionZ: number;
  worldVelocityX: number;
  worldVelocityY: number;
  worldVelocityZ: number;
  worldForwardDirX: number;
  worldForwardDirY: number;
  worldForwardDirZ: number;
  worldRightDirX: number;
  worldRightDirY: number;
  worldRightDirZ: number;
  gForceLateral: number;
  gForceLongitudinal: number;
  gForceVertical: number;
  yaw: number;
  pitch: number;
  roll: number;
}

export interface PacketMotionData {
  header: PacketHeader;
  carMotionData: CarMotionData[];
}

export interface NormalizedTelemetryPoint {
  time: number;
  distance: number;
  x: number;
  y: number;
  speed: number;
  throttle: number;
  brake: number;
  steering: number;
  gear: number;
  lapNum: number;
  gLat: number;
  gLong: number;
}

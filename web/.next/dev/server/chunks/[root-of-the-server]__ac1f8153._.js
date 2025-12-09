module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/Desktop/lap-lens/src/analysis/corner-database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CornerDatabase",
    ()=>CornerDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
class CornerDatabase {
    databaseDir;
    constructor(databaseDir = './corners'){
        this.databaseDir = databaseDir;
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](databaseDir)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](databaseDir, {
                recursive: true
            });
        }
    }
    sanitizeTrackName(trackName) {
        const match = trackName.match(/\(([^)]+)\)/);
        const baseName = match ? match[1] : trackName;
        return baseName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    getFilePath(trackName) {
        const sanitized = this.sanitizeTrackName(trackName);
        return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](this.databaseDir, `${sanitized}.json`);
    }
    getLegacyFilePath(trackId) {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](this.databaseDir, `track_${trackId}.json`);
    }
    hasTrackData(trackName, trackId) {
        const filePath = this.getFilePath(trackName);
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](filePath)) return true;
        if (trackId !== undefined) {
            const legacyPath = this.getLegacyFilePath(trackId);
            return __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](legacyPath);
        }
        return false;
    }
    loadTrackCorners(trackName, trackId) {
        let filePath = this.getFilePath(trackName);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](filePath) && trackId !== undefined) {
            const legacyPath = this.getLegacyFilePath(trackId);
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](legacyPath)) {
                filePath = legacyPath;
            }
        }
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](filePath)) {
            return null;
        }
        try {
            const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Failed to load corner database for track ${trackName}:`, error);
            return null;
        }
    }
    saveTrackCorners(trackName, trackId, trackLength, corners, brakingZones, telemetry) {
        const filePath = this.getFilePath(trackName);
        const isUpdate = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](filePath);
        let createdAt = new Date().toISOString();
        if (isUpdate) {
            const existing = this.loadTrackCorners(trackName, trackId);
            if (existing) {
                createdAt = existing.createdAt;
            }
        }
        const brakingZoneMap = new Map();
        if (brakingZones) {
            for (const corner of corners){
                const cornerNumber = corners.indexOf(corner) + 1;
                const candidateZones = brakingZones.filter((zone)=>{
                    const distanceToCorner = corner.entryDistance - zone.exitDistance;
                    return distanceToCorner >= -100 && distanceToCorner <= 50;
                });
                if (candidateZones.length > 0) {
                    const primaryZone = candidateZones.reduce((best, current)=>{
                        const bestDistance = Math.abs(corner.entryDistance - best.exitDistance);
                        const currentDistance = Math.abs(corner.entryDistance - current.exitDistance);
                        return currentDistance < bestDistance ? current : best;
                    });
                    brakingZoneMap.set(cornerNumber, primaryZone);
                }
            }
        }
        const databaseEntries = corners.map((corner, index)=>{
            const cornerNumber = index + 1;
            // Find apex coordinates from telemetry
            let apexX = 0, apexY = 0;
            if (telemetry) {
                // Find closest telemetry point to apex distance
                let closestPoint = telemetry[0];
                let minDist = Infinity;
                for (const point of telemetry){
                    const dist = Math.abs(point.distance - corner.apexDistance);
                    if (dist < minDist) {
                        minDist = dist;
                        closestPoint = point;
                    }
                }
                apexX = closestPoint.x;
                apexY = closestPoint.y;
            }
            const entry = {
                number: cornerNumber,
                entryDistance: Math.round(corner.entryDistance),
                apexDistance: Math.round(corner.apexDistance),
                exitDistance: Math.round(corner.exitDistance),
                apexX: Math.round(apexX * 100) / 100,
                apexY: Math.round(apexY * 100) / 100,
                type: corner.type,
                direction: corner.direction
            };
            const brakingZone = brakingZoneMap.get(cornerNumber);
            if (brakingZone) {
                entry.brakingZone = {
                    entryDistance: Math.round(brakingZone.entryDistance),
                    peakDistance: Math.round(brakingZone.peakDistance),
                    exitDistance: Math.round(brakingZone.exitDistance),
                    entrySpeed: Math.round(brakingZone.entrySpeed),
                    minSpeed: Math.round(brakingZone.minSpeed),
                    exitSpeed: Math.round(brakingZone.exitSpeed),
                    speedLoss: Math.round(brakingZone.speedLoss),
                    peakBrakePressure: Math.round(brakingZone.peakBrakePressure * 100) / 100,
                    avgBrakePressure: Math.round(brakingZone.avgBrakePressure * 100) / 100,
                    peakDeceleration: Math.round(brakingZone.peakDeceleration * 100) / 100,
                    avgDeceleration: Math.round(brakingZone.avgDeceleration * 100) / 100,
                    brakingDistance: Math.round(brakingZone.brakingDistance),
                    brakingDuration: Math.round(brakingZone.brakingDuration * 100) / 100,
                    intensity: brakingZone.intensity,
                    isTrailBraking: brakingZone.isTrailBraking
                };
            }
            return entry;
        });
        const database = {
            trackId,
            trackName,
            trackLength: Math.round(trackLength),
            totalCorners: corners.length,
            corners: databaseEntries,
            createdAt,
            updatedAt: new Date().toISOString()
        };
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](filePath, JSON.stringify(database, null, 2));
    }
    findCornerAtDistance(trackName, distance, trackId, tolerance = 10) {
        const trackData = this.loadTrackCorners(trackName, trackId);
        if (!trackData) {
            return null;
        }
        for (const corner of trackData.corners){
            if (distance >= corner.entryDistance - tolerance && distance <= corner.exitDistance + tolerance) {
                return corner;
            }
        }
        return null;
    }
    getCornerPhase(trackName, distance, trackId, tolerance = 10) {
        const corner = this.findCornerAtDistance(trackName, distance, trackId, tolerance);
        if (!corner) {
            return null;
        }
        const distToEntry = Math.abs(distance - corner.entryDistance);
        const distToApex = Math.abs(distance - corner.apexDistance);
        const distToExit = Math.abs(distance - corner.exitDistance);
        if (distToEntry <= distToApex && distToEntry <= distToExit) {
            return 'entry';
        } else if (distToApex <= distToEntry && distToApex <= distToExit) {
            return 'apex';
        } else {
            return 'exit';
        }
    }
    listAvailableTracks() {
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](this.databaseDir)) {
            return [];
        }
        const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readdirSync"](this.databaseDir).filter((f)=>f.endsWith('.json')).map((f)=>f.replace('.json', ''));
        return files.sort();
    }
    deleteTrackCorners(trackName, trackId) {
        const filePath = this.getFilePath(trackName);
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](filePath)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["unlinkSync"](filePath);
            return true;
        }
        if (trackId !== undefined) {
            const legacyPath = this.getLegacyFilePath(trackId);
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](legacyPath)) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["unlinkSync"](legacyPath);
                return true;
            }
        }
        return false;
    }
    getAllTrackData() {
        const trackNames = this.listAvailableTracks();
        const allData = [];
        for (const trackName of trackNames){
            const data = this.loadTrackCorners(trackName);
            if (data) {
                allData.push(data);
            }
        }
        return allData;
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/speed-comparison.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Speed Comparison - Corner-by-corner speed and acceleration analysis
 *
 * Compares two laps at key corner points (entry/apex/exit) and acceleration zones
 * Provides time deltas, speed differences, and braking analysis
 */ __turbopack_context__.s([
    "SpeedComparisonAnalyzer",
    ()=>SpeedComparisonAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$corner$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/corner-database.ts [app-route] (ecmascript)");
;
class SpeedComparisonAnalyzer {
    config;
    cornerDb;
    constructor(config = {}){
        this.config = {
            accelThrottleThreshold: config.accelThrottleThreshold ?? 0.5,
            minAccelZoneLength: config.minAccelZoneLength ?? 50,
            cornerSpeedTolerance: config.cornerSpeedTolerance ?? 5
        };
        this.cornerDb = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$corner$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CornerDatabase"](config.cornerDbPath);
    }
    /**
   * Compare speed between two laps
   * Returns corner-by-corner analysis, acceleration zones, and summary
   */ compareSpeed(aligned, trackName, trackId) {
        const corners = this.analyzeCorners(aligned, trackName, trackId);
        const accelZones = this.detectAccelerationZones(aligned, corners);
        const summary = this.calculateSummary(aligned, corners, accelZones);
        return {
            corners,
            accelerationZones: accelZones,
            summary
        };
    }
    analyzeCorners(aligned, trackName, trackId) {
        const trackData = this.cornerDb.loadTrackCorners(trackName, trackId);
        if (!trackData) {
            throw new Error(`No corner database found for track: ${trackName}`);
        }
        const { lapA, lapB } = aligned;
        const comparisons = [];
        for (const corner of trackData.corners){
            const comparison = this.analyzeCorner(lapA, lapB, corner);
            comparisons.push(comparison);
        }
        return comparisons;
    }
    /**
   * Analyze single corner comparing speeds at entry/apex/exit
   */ analyzeCorner(lapA, lapB, corner) {
        const tolerance = this.config.cornerSpeedTolerance;
        // Find key corner points (entry, apex, exit)
        const entryA = this.findPointAtDistance(lapA, corner.entryDistance, tolerance);
        const entryB = this.findPointAtDistance(lapB, corner.entryDistance, tolerance);
        const apexA = this.findPointAtDistance(lapA, corner.apexDistance, tolerance);
        const apexB = this.findPointAtDistance(lapB, corner.apexDistance, tolerance);
        const exitA = this.findPointAtDistance(lapA, corner.exitDistance, tolerance);
        const exitB = this.findPointAtDistance(lapB, corner.exitDistance, tolerance);
        // Get all points within corner
        const cornerPointsA = this.getPointsInRange(lapA, corner.entryDistance, corner.exitDistance);
        const cornerPointsB = this.getPointsInRange(lapB, corner.entryDistance, corner.exitDistance);
        const minSpeedA = Math.min(...cornerPointsA.map((p)=>p.speed));
        const minSpeedB = Math.min(...cornerPointsB.map((p)=>p.speed));
        const avgThrottleA = this.average(cornerPointsA.map((p)=>p.throttle));
        const avgThrottleB = this.average(cornerPointsB.map((p)=>p.throttle));
        const avgBrakeA = this.average(cornerPointsA.map((p)=>p.brake));
        const avgBrakeB = this.average(cornerPointsB.map((p)=>p.brake));
        // Calculate time spent in corner
        const timeOffsetA = lapA[0].time;
        const timeOffsetB = lapB[0].time;
        const entryTimeA = entryA.time - timeOffsetA;
        const entryTimeB = entryB.time - timeOffsetB;
        const exitTimeA = exitA.time - timeOffsetA;
        const exitTimeB = exitB.time - timeOffsetB;
        const cornerDurationA = exitTimeA - entryTimeA;
        const cornerDurationB = exitTimeB - entryTimeB;
        const timeDelta = cornerDurationA - cornerDurationB;
        let brakingComparison;
        if (corner.brakingZone) {
            brakingComparison = this.analyzeBraking(lapA, lapB, corner);
        }
        return {
            cornerNumber: corner.number,
            cornerName: corner.name,
            entryDistance: corner.entryDistance,
            apexDistance: corner.apexDistance,
            exitDistance: corner.exitDistance,
            entrySpeed: {
                lapA: entryA.speed,
                lapB: entryB.speed,
                delta: entryA.speed - entryB.speed
            },
            apexSpeed: {
                lapA: apexA.speed,
                lapB: apexB.speed,
                delta: apexA.speed - apexB.speed
            },
            exitSpeed: {
                lapA: exitA.speed,
                lapB: exitB.speed,
                delta: exitA.speed - exitB.speed
            },
            minSpeed: {
                lapA: minSpeedA,
                lapB: minSpeedB,
                delta: minSpeedA - minSpeedB
            },
            entryTime: {
                lapA: entryTimeA,
                lapB: entryTimeB
            },
            exitTime: {
                lapA: exitTimeA,
                lapB: exitTimeB
            },
            timeDelta,
            cornerLength: corner.exitDistance - corner.entryDistance,
            avgThrottle: {
                lapA: avgThrottleA,
                lapB: avgThrottleB,
                delta: avgThrottleA - avgThrottleB
            },
            avgBrake: {
                lapA: avgBrakeA,
                lapB: avgBrakeB,
                delta: avgBrakeA - avgBrakeB
            },
            brakingComparison
        };
    }
    analyzeBraking(lapA, lapB, corner) {
        if (!corner.brakingZone) return undefined;
        const tolerance = this.config.cornerSpeedTolerance;
        const zone = corner.brakingZone;
        const brakingPointA = this.findPointAtDistance(lapA, zone.entryDistance, tolerance);
        const brakingPointB = this.findPointAtDistance(lapB, zone.entryDistance, tolerance);
        const peakBrakeA = this.findPointAtDistance(lapA, zone.peakDistance, tolerance);
        const peakBrakeB = this.findPointAtDistance(lapB, zone.peakDistance, tolerance);
        const brakePointsA = this.getPointsInRange(lapA, zone.entryDistance, zone.exitDistance);
        const brakePointsB = this.getPointsInRange(lapB, zone.entryDistance, zone.exitDistance);
        const avgBrakeA = this.average(brakePointsA.map((p)=>p.brake));
        const avgBrakeB = this.average(brakePointsB.map((p)=>p.brake));
        return {
            brakingPoint: {
                lapA: brakingPointA.speed,
                lapB: brakingPointB.speed,
                delta: brakingPointA.speed - brakingPointB.speed
            },
            peakBrake: {
                lapA: peakBrakeA.brake,
                lapB: peakBrakeB.brake,
                delta: peakBrakeA.brake - peakBrakeB.brake
            },
            brakingDistance: {
                lapA: zone.brakingDistance,
                lapB: zone.brakingDistance,
                delta: 0
            },
            avgBrakePressure: {
                lapA: avgBrakeA,
                lapB: avgBrakeB,
                delta: avgBrakeA - avgBrakeB
            }
        };
    }
    /**
   * Detect acceleration zones between corners
   * Zones must meet minimum length and throttle threshold
   */ detectAccelerationZones(aligned, corners) {
        const { lapA, lapB } = aligned;
        const zones = [];
        if (corners.length === 0) return zones;
        // Zone from start to first corner
        if (corners[0].entryDistance > this.config.minAccelZoneLength) {
            const zone = this.analyzeAccelerationZone(lapA, lapB, 0, corners[0].entryDistance, undefined, corners[0].cornerNumber);
            if (zone) zones.push(zone);
        }
        // Zones between corners
        for(let i = 0; i < corners.length - 1; i++){
            const currentExit = corners[i].exitDistance;
            const nextEntry = corners[i + 1].entryDistance;
            const distance = nextEntry - currentExit;
            if (distance >= this.config.minAccelZoneLength) {
                const zone = this.analyzeAccelerationZone(lapA, lapB, currentExit, nextEntry, corners[i].cornerNumber, corners[i + 1].cornerNumber);
                if (zone) zones.push(zone);
            }
        }
        // Zone from last corner to finish
        const lastCorner = corners[corners.length - 1];
        const trackEnd = lapA[lapA.length - 1].distance;
        if (trackEnd - lastCorner.exitDistance > this.config.minAccelZoneLength) {
            const zone = this.analyzeAccelerationZone(lapA, lapB, lastCorner.exitDistance, trackEnd, lastCorner.cornerNumber, undefined);
            if (zone) zones.push(zone);
        }
        return zones;
    }
    /**
   * Analyze acceleration zone between two corners
   * Returns null if throttle usage is too low
   */ analyzeAccelerationZone(lapA, lapB, startDistance, endDistance, precedingCorner, followingCorner) {
        const pointsA = this.getPointsInRange(lapA, startDistance, endDistance);
        const pointsB = this.getPointsInRange(lapB, startDistance, endDistance);
        if (pointsA.length < 2 || pointsB.length < 2) return null;
        // Check if this is actually an acceleration zone (throttle usage)
        const avgThrottleA = this.average(pointsA.map((p)=>p.throttle));
        const avgThrottleB = this.average(pointsB.map((p)=>p.throttle));
        if (avgThrottleA < this.config.accelThrottleThreshold && avgThrottleB < this.config.accelThrottleThreshold) {
            return null;
        }
        // Calculate speed gain and acceleration
        const startSpeedA = pointsA[0].speed;
        const endSpeedA = pointsA[pointsA.length - 1].speed;
        const startSpeedB = pointsB[0].speed;
        const endSpeedB = pointsB[pointsB.length - 1].speed;
        const durationA = pointsA[pointsA.length - 1].time - pointsA[0].time;
        const durationB = pointsB[pointsB.length - 1].time - pointsB[0].time;
        const avgAccelA = durationA > 0 ? (endSpeedA - startSpeedA) / 3.6 / durationA : 0;
        const avgAccelB = durationB > 0 ? (endSpeedB - startSpeedB) / 3.6 / durationB : 0;
        const timeDelta = durationA - durationB;
        return {
            startDistance,
            endDistance,
            distance: endDistance - startDistance,
            startSpeed: {
                lapA: startSpeedA,
                lapB: startSpeedB,
                delta: startSpeedA - startSpeedB
            },
            endSpeed: {
                lapA: endSpeedA,
                lapB: endSpeedB,
                delta: endSpeedA - endSpeedB
            },
            avgAcceleration: {
                lapA: avgAccelA,
                lapB: avgAccelB,
                delta: avgAccelA - avgAccelB
            },
            avgThrottle: {
                lapA: avgThrottleA,
                lapB: avgThrottleB,
                delta: avgThrottleA - avgThrottleB
            },
            duration: {
                lapA: durationA,
                lapB: durationB
            },
            timeDelta,
            precedingCorner,
            followingCorner
        };
    }
    calculateSummary(aligned, corners, accelZones) {
        const { lapA } = aligned;
        const totalDistance = lapA[lapA.length - 1].distance - lapA[0].distance;
        const timeGainedInCorners = corners.reduce((sum, c)=>sum + c.timeDelta, 0);
        const timeGainedInAccelZones = accelZones.reduce((sum, z)=>sum + z.timeDelta, 0);
        const timeOffsetA = lapA[0].time;
        const timeOffsetB = aligned.lapB[0].time;
        const finalTimeA = lapA[lapA.length - 1].time - timeOffsetA;
        const finalTimeB = aligned.lapB[lapA.length - 1].time - timeOffsetB;
        const totalTimeDelta = finalTimeA - finalTimeB;
        const speedDeltas = lapA.map((p, i)=>p.speed - aligned.lapB[i].speed);
        const avgSpeedDelta = this.average(speedDeltas);
        const maxSpeedDelta = Math.max(...speedDeltas.map(Math.abs));
        const maxSpeedDeltaIdx = speedDeltas.findIndex((d)=>Math.abs(d) === maxSpeedDelta);
        const maxSpeedDeltaDistance = lapA[maxSpeedDeltaIdx].distance;
        const sortedCorners = [
            ...corners
        ].sort((a, b)=>a.timeDelta - b.timeDelta);
        const fastestCornerGain = sortedCorners[0];
        const slowestCornerLoss = sortedCorners[sortedCorners.length - 1];
        const sortedZones = [
            ...accelZones
        ].sort((a, b)=>a.timeDelta - b.timeDelta);
        const bestAccelZone = sortedZones[0];
        const worstAccelZone = sortedZones[sortedZones.length - 1];
        return {
            totalTimeDelta,
            totalDistance,
            timeGainedInCorners,
            timeGainedInAccelZones,
            avgSpeedDelta,
            maxSpeedDelta,
            maxSpeedDeltaDistance,
            fastestCornerGain: {
                cornerNumber: fastestCornerGain?.cornerNumber ?? 0,
                timeDelta: fastestCornerGain?.timeDelta ?? 0
            },
            slowestCornerLoss: {
                cornerNumber: slowestCornerLoss?.cornerNumber ?? 0,
                timeDelta: slowestCornerLoss?.timeDelta ?? 0
            },
            bestAccelZone: {
                zoneIndex: bestAccelZone ? accelZones.indexOf(bestAccelZone) : 0,
                timeDelta: bestAccelZone?.timeDelta ?? 0
            },
            worstAccelZone: {
                zoneIndex: worstAccelZone ? accelZones.indexOf(worstAccelZone) : 0,
                timeDelta: worstAccelZone?.timeDelta ?? 0
            }
        };
    }
    /**
   * Find telemetry point closest to target distance
   */ findPointAtDistance(points, distance, tolerance = 5) {
        const closest = points.reduce((best, current)=>{
            const bestDist = Math.abs(best.distance - distance);
            const currentDist = Math.abs(current.distance - distance);
            return currentDist < bestDist ? current : best;
        });
        if (Math.abs(closest.distance - distance) > tolerance) {
            console.warn(`Point at distance ${distance}m not found within ${tolerance}m tolerance`);
        }
        return closest;
    }
    /**
   * Get all points within distance range
   */ getPointsInRange(points, startDistance, endDistance) {
        return points.filter((p)=>p.distance >= startDistance && p.distance <= endDistance);
    }
    /**
   * Calculate average of numeric array
   */ average(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, v)=>sum + v, 0) / values.length;
    }
    /**
   * Format time delta with sign (+/-)
   */ formatTimeDelta(seconds) {
        const sign = seconds >= 0 ? '+' : '';
        return `${sign}${seconds.toFixed(3)}s`;
    }
    /**
   * Get color for delta (green = faster, red = slower)
   */ getDeltaColor(delta) {
        if (delta < -0.01) return 'green';
        if (delta > 0.01) return 'red';
        return 'neutral';
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/sector-analysis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sector Analysis - Track sector performance comparison
 *
 * Divides track into sectors (configured or auto-detected thirds)
 * Compares sector times, speeds, and driving inputs between laps
 */ __turbopack_context__.s([
    "SectorAnalyzer",
    ()=>SectorAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$corner$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/corner-database.ts [app-route] (ecmascript)");
;
class SectorAnalyzer {
    cornerDb;
    sectorConfigs;
    constructor(cornerDbPath){
        this.cornerDb = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$corner$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CornerDatabase"](cornerDbPath);
        this.sectorConfigs = new Map();
        this.initializeDefaultConfigs();
    }
    /**
   * Initialize track-specific sector configurations
   * Add configs for tracks with known sector boundaries
   */ initializeDefaultConfigs() {
        this.sectorConfigs.set('bahrain', [
            {
                sectorNumber: 1,
                startDistance: 0,
                endDistance: 1900
            },
            {
                sectorNumber: 2,
                startDistance: 1900,
                endDistance: 3700
            },
            {
                sectorNumber: 3,
                startDistance: 3700,
                endDistance: 999999
            }
        ]);
    }
    /**
   * Analyze sectors between two laps
   * Uses configured boundaries or auto-detects thirds
   */ analyzeSectors(aligned, trackName, trackId) {
        const boundaries = this.getSectorBoundaries(trackName, aligned.lapA);
        const sectors = [];
        // Calculate metrics for each sector
        for (const boundary of boundaries){
            const sectorA = this.calculateSectorTime(aligned.lapA, boundary, trackName, trackId);
            const sectorB = this.calculateSectorTime(aligned.lapB, boundary, trackName, trackId);
            const timeDelta = sectorA.time - sectorB.time;
            const avgSpeedDelta = sectorA.avgSpeed - sectorB.avgSpeed;
            const timeGainPercentage = sectorB.time > 0 ? timeDelta / sectorB.time * 100 : 0;
            sectors.push({
                sectorNumber: boundary.sectorNumber,
                startDistance: boundary.startDistance,
                endDistance: Math.min(boundary.endDistance, aligned.endDistance),
                distance: sectorA.distance,
                lapA: sectorA,
                lapB: sectorB,
                timeDelta,
                avgSpeedDelta,
                timeGainPercentage
            });
        }
        // Find best/worst performing sectors
        const sortedSectors = [
            ...sectors
        ].sort((a, b)=>a.timeDelta - b.timeDelta);
        const fastestSector = sortedSectors[0];
        const slowestSector = sortedSectors[sortedSectors.length - 1];
        const totalTimeDelta = sectors.reduce((sum, s)=>sum + s.timeDelta, 0);
        return {
            sectors,
            summary: {
                totalTimeDelta,
                fastestSector: {
                    sectorNumber: fastestSector?.sectorNumber ?? 0,
                    timeDelta: fastestSector?.timeDelta ?? 0
                },
                slowestSector: {
                    sectorNumber: slowestSector?.sectorNumber ?? 0,
                    timeDelta: slowestSector?.timeDelta ?? 0
                }
            }
        };
    }
    /**
   * Get sector boundaries for track
   * Uses configured boundaries if available, otherwise divides into thirds
   */ getSectorBoundaries(trackName, lap) {
        const sanitizedName = this.sanitizeTrackName(trackName);
        const configured = this.sectorConfigs.get(sanitizedName);
        if (configured) {
            return configured;
        }
        return this.autoDetectSectors(lap);
    }
    /**
   * Auto-detect sectors by dividing track into equal thirds
   */ autoDetectSectors(lap) {
        if (lap.length === 0) {
            return [];
        }
        const trackLength = lap[lap.length - 1].distance - lap[0].distance;
        const sectorLength = trackLength / 3;
        return [
            {
                sectorNumber: 1,
                startDistance: lap[0].distance,
                endDistance: lap[0].distance + sectorLength
            },
            {
                sectorNumber: 2,
                startDistance: lap[0].distance + sectorLength,
                endDistance: lap[0].distance + sectorLength * 2
            },
            {
                sectorNumber: 3,
                startDistance: lap[0].distance + sectorLength * 2,
                endDistance: lap[lap.length - 1].distance
            }
        ];
    }
    /**
   * Calculate sector metrics for a single lap
   */ calculateSectorTime(lap, boundary, trackName, trackId) {
        const sectorPoints = lap.filter((p)=>p.distance >= boundary.startDistance && p.distance <= boundary.endDistance);
        if (sectorPoints.length === 0) {
            return {
                sectorNumber: boundary.sectorNumber,
                startDistance: boundary.startDistance,
                endDistance: boundary.endDistance,
                distance: 0,
                time: 0,
                avgSpeed: 0,
                minSpeed: 0,
                maxSpeed: 0,
                avgThrottle: 0,
                avgBrake: 0,
                cornerCount: 0
            };
        }
        // Calculate time through sector
        const startTime = sectorPoints[0].time;
        const endTime = sectorPoints[sectorPoints.length - 1].time;
        const time = endTime - startTime;
        const distance = sectorPoints[sectorPoints.length - 1].distance - sectorPoints[0].distance;
        // Speed metrics
        const speeds = sectorPoints.map((p)=>p.speed);
        const avgSpeed = this.average(speeds);
        const minSpeed = Math.min(...speeds);
        const maxSpeed = Math.max(...speeds);
        // Input metrics
        const avgThrottle = this.average(sectorPoints.map((p)=>p.throttle));
        const avgBrake = this.average(sectorPoints.map((p)=>p.brake));
        const cornerCount = this.countCornersInSector(trackName, trackId, boundary.startDistance, boundary.endDistance);
        return {
            sectorNumber: boundary.sectorNumber,
            startDistance: boundary.startDistance,
            endDistance: boundary.endDistance,
            distance,
            time,
            avgSpeed,
            minSpeed,
            maxSpeed,
            avgThrottle,
            avgBrake,
            cornerCount
        };
    }
    /**
   * Count corners in sector using corner database
   */ countCornersInSector(trackName, trackId, startDistance, endDistance) {
        const trackData = this.cornerDb.loadTrackCorners(trackName, trackId);
        if (!trackData) {
            return 0;
        }
        return trackData.corners.filter((c)=>c.apexDistance >= startDistance && c.apexDistance <= endDistance).length;
    }
    /**
   * Calculate average of numeric array
   */ average(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, v)=>sum + v, 0) / values.length;
    }
    /**
   * Sanitize track name (extract from parentheses, lowercase, remove special chars)
   */ sanitizeTrackName(trackName) {
        const match = trackName.match(/\(([^)]+)\)/);
        const baseName = match ? match[1] : trackName;
        return baseName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    /**
   * Add custom sector configuration for a track
   */ addSectorConfig(config) {
        const sanitizedName = this.sanitizeTrackName(config.trackName);
        this.sectorConfigs.set(sanitizedName, config.sectors);
    }
    /**
   * Format time delta with sign (+/-)
   */ formatTimeDelta(seconds) {
        const sign = seconds >= 0 ? '+' : '';
        return `${sign}${seconds.toFixed(3)}s`;
    }
    /**
   * Get color for delta (green = faster, red = slower)
   */ getDeltaColor(delta) {
        if (delta < -0.01) return 'green';
        if (delta > 0.01) return 'red';
        return 'neutral';
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/gforce-analysis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * G-Force Analysis - Analyzes lateral/longitudinal G-forces for lap comparison
 *
 * Calculates corner-by-corner G-force metrics and generates multi-metric insights.
 * Formula: combinedG = sqrt(lateralG² + longitudinalG²)
 */ __turbopack_context__.s([
    "GForceAnalyzer",
    ()=>GForceAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$corner$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/corner-database.ts [app-route] (ecmascript)");
;
class GForceAnalyzer {
    config;
    cornerDb;
    constructor(config = {}){
        this.config = {
            smoothingWindow: config.smoothingWindow ?? 3,
            minGForceThreshold: config.minGForceThreshold ?? 0.01
        };
        this.cornerDb = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$corner$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CornerDatabase"](config.cornerDbPath);
    }
    // Analyze G-forces across entire lap with corner-by-corner breakdown
    analyzeGForces(aligned, trackName, trackId) {
        const gforcesA = this.calculateGForces(aligned.lapA);
        const gforcesB = this.calculateGForces(aligned.lapB);
        const corners = this.analyzeCorners(gforcesA, gforcesB, trackName, trackId);
        const frictionCircle = {
            lapA: this.calculateFrictionCircle(gforcesA),
            lapB: this.calculateFrictionCircle(gforcesB)
        };
        const summary = this.calculateSummary(gforcesA, gforcesB, corners);
        return {
            corners,
            frictionCircle,
            summary
        };
    }
    // Calculate G-force point from telemetry (uses F1 2024 gLat/gLong data)
    calculateGForces(lap) {
        return lap.map((point)=>{
            const lateralG = Math.abs(point.gLat);
            const longitudinalG = point.gLong;
            const combinedG = Math.sqrt(lateralG ** 2 + longitudinalG ** 2);
            const heading = this.calculateHeading(lap, lap.indexOf(point));
            return {
                distance: point.distance,
                lateralG,
                longitudinalG,
                combinedG,
                speed: point.speed,
                heading
            };
        });
    }
    // Calculate heading from X/Y position
    calculateHeading(lap, index) {
        if (index === 0) return undefined;
        const current = lap[index];
        const previous = lap[index - 1];
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;
        return Math.atan2(dy, dx);
    }
    analyzeCorners(gforcesA, gforcesB, trackName, trackId) {
        const trackData = this.cornerDb.loadTrackCorners(trackName, trackId);
        if (!trackData) {
            throw new Error(`No corner database found for track: ${trackName}`);
        }
        const analyses = [];
        for (const corner of trackData.corners){
            const analysis = this.analyzeCorner(gforcesA, gforcesB, corner);
            analyses.push(analysis);
        }
        return analyses;
    }
    analyzeCorner(gforcesA, gforcesB, corner) {
        const cornerGforcesA = this.getGForcesInRange(gforcesA, corner.entryDistance, corner.exitDistance);
        const cornerGforcesB = this.getGForcesInRange(gforcesB, corner.entryDistance, corner.exitDistance);
        const entryA = this.findPointAtDistance(gforcesA, corner.entryDistance);
        const entryB = this.findPointAtDistance(gforcesB, corner.entryDistance);
        const apexA = this.findPointAtDistance(gforcesA, corner.apexDistance);
        const apexB = this.findPointAtDistance(gforcesB, corner.apexDistance);
        const exitA = this.findPointAtDistance(gforcesA, corner.exitDistance);
        const exitB = this.findPointAtDistance(gforcesB, corner.exitDistance);
        const lateralGsA = cornerGforcesA.map((g)=>g.lateralG);
        const lateralGsB = cornerGforcesB.map((g)=>g.lateralG);
        const peakLateralGA = Math.max(...lateralGsA);
        const peakLateralGB = Math.max(...lateralGsB);
        const avgLateralGA = this.average(lateralGsA);
        const avgLateralGB = this.average(lateralGsB);
        const peakLateralGDistanceA = cornerGforcesA.find((g)=>g.lateralG === peakLateralGA)?.distance ?? corner.apexDistance;
        const peakLateralGDistanceB = cornerGforcesB.find((g)=>g.lateralG === peakLateralGB)?.distance ?? corner.apexDistance;
        const brakingGsA = cornerGforcesA.map((g)=>g.longitudinalG).filter((g)=>g < -this.config.minGForceThreshold);
        const brakingGsB = cornerGforcesB.map((g)=>g.longitudinalG).filter((g)=>g < -this.config.minGForceThreshold);
        const accelGsA = cornerGforcesA.map((g)=>g.longitudinalG).filter((g)=>g > this.config.minGForceThreshold);
        const accelGsB = cornerGforcesB.map((g)=>g.longitudinalG).filter((g)=>g > this.config.minGForceThreshold);
        const peakBrakingGA = brakingGsA.length > 0 ? Math.min(...brakingGsA) : 0;
        const peakBrakingGB = brakingGsB.length > 0 ? Math.min(...brakingGsB) : 0;
        const avgBrakingGA = brakingGsA.length > 0 ? this.average(brakingGsA) : 0;
        const avgBrakingGB = brakingGsB.length > 0 ? this.average(brakingGsB) : 0;
        const peakAccelGA = accelGsA.length > 0 ? Math.max(...accelGsA) : 0;
        const peakAccelGB = accelGsB.length > 0 ? Math.max(...accelGsB) : 0;
        const avgAccelGA = accelGsA.length > 0 ? this.average(accelGsA) : 0;
        const avgAccelGB = accelGsB.length > 0 ? this.average(accelGsB) : 0;
        const combinedGsA = cornerGforcesA.map((g)=>g.combinedG);
        const combinedGsB = cornerGforcesB.map((g)=>g.combinedG);
        const peakCombinedGA = Math.max(...combinedGsA);
        const peakCombinedGB = Math.max(...combinedGsB);
        const lateralGStdDevA = this.stdDev(lateralGsA);
        const lateralGStdDevB = this.stdDev(lateralGsB);
        const longitudinalGStdDevA = this.stdDev(cornerGforcesA.map((g)=>g.longitudinalG));
        const longitudinalGStdDevB = this.stdDev(cornerGforcesB.map((g)=>g.longitudinalG));
        const minSpeedA = Math.min(...cornerGforcesA.map((g)=>g.speed));
        const minSpeedB = Math.min(...cornerGforcesB.map((g)=>g.speed));
        const analysis = {
            cornerNumber: corner.number,
            cornerName: corner.name,
            entryDistance: corner.entryDistance,
            apexDistance: corner.apexDistance,
            exitDistance: corner.exitDistance,
            peakLateralG: {
                lapA: peakLateralGA,
                lapB: peakLateralGB,
                delta: peakLateralGA - peakLateralGB
            },
            avgLateralG: {
                lapA: avgLateralGA,
                lapB: avgLateralGB,
                delta: avgLateralGA - avgLateralGB
            },
            peakLateralGDistance: {
                lapA: peakLateralGDistanceA,
                lapB: peakLateralGDistanceB
            },
            peakBrakingG: {
                lapA: peakBrakingGA,
                lapB: peakBrakingGB,
                delta: peakBrakingGA - peakBrakingGB
            },
            avgBrakingG: {
                lapA: avgBrakingGA,
                lapB: avgBrakingGB,
                delta: avgBrakingGA - avgBrakingGB
            },
            peakAccelG: {
                lapA: peakAccelGA,
                lapB: peakAccelGB,
                delta: peakAccelGA - peakAccelGB
            },
            avgAccelG: {
                lapA: avgAccelGA,
                lapB: avgAccelGB,
                delta: avgAccelGA - avgAccelGB
            },
            peakCombinedG: {
                lapA: peakCombinedGA,
                lapB: peakCombinedGB,
                delta: peakCombinedGA - peakCombinedGB
            },
            lateralGStdDev: {
                lapA: lateralGStdDevA,
                lapB: lateralGStdDevB
            },
            longitudinalGStdDev: {
                lapA: longitudinalGStdDevA,
                lapB: longitudinalGStdDevB
            },
            entrySpeed: {
                lapA: entryA.speed,
                lapB: entryB.speed,
                delta: entryA.speed - entryB.speed
            },
            apexSpeed: {
                lapA: apexA.speed,
                lapB: apexB.speed,
                delta: apexA.speed - apexB.speed
            },
            exitSpeed: {
                lapA: exitA.speed,
                lapB: exitB.speed,
                delta: exitA.speed - exitB.speed
            },
            minSpeed: {
                lapA: minSpeedA,
                lapB: minSpeedB,
                delta: minSpeedA - minSpeedB
            }
        };
        analysis.insight = this.generateInsight(analysis);
        return analysis;
    }
    calculateFrictionCircle(gforces) {
        const points = gforces.map((g)=>({
                lateral: g.lateralG,
                longitudinal: g.longitudinalG
            }));
        const maxRadius = Math.max(...gforces.map((g)=>g.combinedG));
        return {
            points,
            maxRadius
        };
    }
    calculateSummary(gforcesA, gforcesB, corners) {
        const lateralGsA = gforcesA.map((g)=>g.lateralG);
        const lateralGsB = gforcesB.map((g)=>g.lateralG);
        const peakLateralGA = Math.max(...lateralGsA);
        const peakLateralGB = Math.max(...lateralGsB);
        const avgLateralGA = this.average(lateralGsA);
        const avgLateralGB = this.average(lateralGsB);
        const brakingGsA = gforcesA.map((g)=>g.longitudinalG).filter((g)=>g < -this.config.minGForceThreshold);
        const brakingGsB = gforcesB.map((g)=>g.longitudinalG).filter((g)=>g < -this.config.minGForceThreshold);
        const accelGsA = gforcesA.map((g)=>g.longitudinalG).filter((g)=>g > this.config.minGForceThreshold);
        const accelGsB = gforcesB.map((g)=>g.longitudinalG).filter((g)=>g > this.config.minGForceThreshold);
        const peakBrakingGA = brakingGsA.length > 0 ? Math.min(...brakingGsA) : 0;
        const peakBrakingGB = brakingGsB.length > 0 ? Math.min(...brakingGsB) : 0;
        const avgBrakingGA = brakingGsA.length > 0 ? this.average(brakingGsA) : 0;
        const avgBrakingGB = brakingGsB.length > 0 ? this.average(brakingGsB) : 0;
        const peakAccelGA = accelGsA.length > 0 ? Math.max(...accelGsA) : 0;
        const peakAccelGB = accelGsB.length > 0 ? Math.max(...accelGsB) : 0;
        const avgAccelGA = accelGsA.length > 0 ? this.average(accelGsA) : 0;
        const avgAccelGB = accelGsB.length > 0 ? this.average(accelGsB) : 0;
        const sortedCorners = [
            ...corners
        ].sort((a, b)=>b.avgLateralG.lapA - a.avgLateralG.lapA);
        const bestCorner = sortedCorners[0];
        const worstCorner = sortedCorners[sortedCorners.length - 1];
        return {
            peakLateralG: {
                lapA: peakLateralGA,
                lapB: peakLateralGB,
                delta: peakLateralGA - peakLateralGB
            },
            avgLateralG: {
                lapA: avgLateralGA,
                lapB: avgLateralGB,
                delta: avgLateralGA - avgLateralGB
            },
            peakBrakingG: {
                lapA: peakBrakingGA,
                lapB: peakBrakingGB,
                delta: peakBrakingGA - peakBrakingGB
            },
            avgBrakingG: {
                lapA: avgBrakingGA,
                lapB: avgBrakingGB,
                delta: avgBrakingGA - avgBrakingGB
            },
            peakAccelG: {
                lapA: peakAccelGA,
                lapB: peakAccelGB,
                delta: peakAccelGA - peakAccelGB
            },
            avgAccelG: {
                lapA: avgAccelGA,
                lapB: avgAccelGB,
                delta: avgAccelGA - avgAccelGB
            },
            bestCornerLateralG: {
                cornerNumber: bestCorner?.cornerNumber ?? 0,
                lateralG: bestCorner?.avgLateralG.lapA ?? 0
            },
            worstCornerLateralG: {
                cornerNumber: worstCorner?.cornerNumber ?? 0,
                lateralG: worstCorner?.avgLateralG.lapA ?? 0
            }
        };
    }
    // Generate multi-metric insight by correlating G-forces + speeds (WIP - tuning thresholds)
    generateInsight(corner) {
        const entrySpeedSimilar = Math.abs(corner.entrySpeed.delta) < 10;
        const largeLateralGDiff = Math.abs(corner.avgLateralG.delta) > 0.3;
        const largeBrakingGDiff = Math.abs(corner.peakBrakingG.delta) > 0.5;
        const largeEntrySpeedDiff = Math.abs(corner.entrySpeed.delta) > 15;
        const apexSpeedDelta = corner.apexSpeed.delta;
        const exitSpeedDelta = corner.exitSpeed.delta;
        // Under-braking: Same entry, weaker braking, slower apex/exit
        if (entrySpeedSimilar && corner.peakBrakingG.delta > 0.5 && apexSpeedDelta < -5 && exitSpeedDelta < -5) {
            return {
                type: 'under-braking',
                confidence: 'high',
                message: `Same entry speed but weaker braking (${corner.peakBrakingG.delta.toFixed(1)}G) led to slower apex/exit`,
                recommendation: 'Brake harder - you have more grip available'
            };
        }
        // Over-braking: Same entry, harder braking, still slower apex
        if (entrySpeedSimilar && corner.peakBrakingG.delta < -0.5 && apexSpeedDelta < -3) {
            return {
                type: 'over-braking',
                confidence: 'medium',
                message: `Braked harder but still slower apex - may be scrubbing too much speed`,
                recommendation: 'Try lighter braking or different line'
            };
        }
        // Not using grip: Significantly lower lateral G
        if (largeLateralGDiff && corner.avgLateralG.delta < -0.3) {
            return {
                type: 'not-using-grip',
                confidence: 'high',
                message: `Significantly lower lateral G (${corner.avgLateralG.delta.toFixed(1)}G) - not using available grip`,
                recommendation: 'Push harder through this corner - carry more speed'
            };
        }
        // Better previous corner: Faster entry, similar apex
        if (largeEntrySpeedDiff && corner.entrySpeed.delta > 15 && Math.abs(corner.apexSpeed.delta) < 8) {
            return {
                type: 'better-previous-corner',
                confidence: 'medium',
                message: `Entered ${corner.entrySpeed.delta.toFixed(0)} km/h faster from better previous corner/straight`,
                recommendation: 'Good exit from previous section - adapted well'
            };
        }
        // Faster overall: Higher G + faster speeds
        if (largeLateralGDiff && corner.avgLateralG.delta > 0.3 && apexSpeedDelta > 3 && exitSpeedDelta > 3) {
            return {
                type: 'faster-overall',
                confidence: 'high',
                message: `Higher lateral G (+${corner.avgLateralG.delta.toFixed(1)}G) with faster speeds throughout`,
                recommendation: 'Excellent corner - using more grip effectively'
            };
        }
        // Slower overall: Significantly slower apex AND exit
        if (apexSpeedDelta < -8 || exitSpeedDelta < -8) {
            return {
                type: 'slower-overall',
                confidence: 'medium',
                message: `Slower apex/exit - check braking point and throttle application`,
                recommendation: 'Analyze full corner trace - multiple factors at play'
            };
        }
        return {
            type: 'neutral',
            confidence: 'low',
            message: 'Similar performance - small variations'
        };
    }
    findPointAtDistance(gforces, distance) {
        return gforces.reduce((closest, current)=>{
            const closestDist = Math.abs(closest.distance - distance);
            const currentDist = Math.abs(current.distance - distance);
            return currentDist < closestDist ? current : closest;
        });
    }
    getGForcesInRange(gforces, start, end) {
        return gforces.filter((g)=>g.distance >= start && g.distance <= end);
    }
    average(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, v)=>sum + v, 0) / values.length;
    }
    stdDev(values) {
        if (values.length === 0) return 0;
        const avg = this.average(values);
        const squareDiffs = values.map((v)=>(v - avg) ** 2);
        const avgSquareDiff = this.average(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }
    formatG(g) {
        return `${g.toFixed(2)}G`;
    }
    getDeltaColor(delta) {
        if (delta > 0.05) return 'green';
        if (delta < -0.05) return 'red';
        return 'neutral';
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/lap-loader.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Lap Loader - Loads saved lap data from CSV/JSON files
 *
 * Reads telemetry from ./laps directory and parses into NormalizedTelemetryPoint arrays.
 */ __turbopack_context__.s([
    "LapLoader",
    ()=>LapLoader
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
class LapLoader {
    lapsDir;
    constructor(lapsDir = './laps'){
        this.lapsDir = lapsDir;
    }
    // List all available laps from JSON metadata
    listAvailableLaps() {
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](this.lapsDir)) {
            return [];
        }
        const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readdirSync"](this.lapsDir).filter((f)=>f.endsWith('.json')).map((f)=>{
            const jsonPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](this.lapsDir, f);
            const metadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](jsonPath, 'utf-8'));
            return {
                filePath: jsonPath.replace('.json', '.csv'),
                lapNumber: metadata.lapNumber,
                timestamp: metadata.timestamp,
                pointCount: metadata.pointCount
            };
        }).sort((a, b)=>a.lapNumber - b.lapNumber);
        return files;
    }
    // Load telemetry from CSV file (parses all columns including yaw)
    loadLap(csvPath) {
        const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](csvPath, 'utf-8');
        const lines = content.split('\n').slice(1);
        const points = [];
        for (const line of lines){
            if (!line.trim()) continue;
            const parts = line.split(',').map((p)=>parseFloat(p));
            if (parts.length < 11) continue;
            points.push({
                time: parts[0],
                distance: parts[1],
                x: parts[2],
                y: parts[3],
                speed: parts[4],
                throttle: parts[5],
                brake: parts[6],
                steering: parts[7],
                gear: parts[8],
                rpm: parts[9] || 0,
                gLat: parts[10] || 0,
                gLong: parts[11] || 0,
                yaw: parts[12] || 0,
                lapNum: 0
            });
        }
        return points;
    }
    // Load lap by lap number (looks up CSV path from metadata)
    loadLapByNumber(lapNumber) {
        const laps = this.listAvailableLaps();
        const lap = laps.find((l)=>l.lapNumber === lapNumber);
        if (!lap) {
            return null;
        }
        return this.loadLap(lap.filePath);
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/lap-aligner.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Lap Aligner - Aligns two laps by distance for comparison
 *
 * Finds overlapping distance range between laps and trims to matching segments.
 */ __turbopack_context__.s([
    "LapAligner",
    ()=>LapAligner
]);
class LapAligner {
    // Align laps by finding overlapping distance range
    alignLaps(lapA, lapB) {
        if (lapA.length === 0 || lapB.length === 0) {
            throw new Error('Cannot align empty laps');
        }
        const startA = lapA[0].distance;
        const endA = lapA[lapA.length - 1].distance;
        const startB = lapB[0].distance;
        const endB = lapB[lapB.length - 1].distance;
        const startDistance = Math.max(startA, startB);
        const endDistance = Math.min(endA, endB);
        if (endDistance <= startDistance) {
            throw new Error('Laps do not overlap');
        }
        const alignedA = lapA.filter((p)=>p.distance >= startDistance && p.distance <= endDistance);
        const alignedB = lapB.filter((p)=>p.distance >= startDistance && p.distance <= endDistance);
        return {
            lapA: alignedA,
            lapB: alignedB,
            startDistance,
            endDistance,
            length: endDistance - startDistance
        };
    }
    // Trim laps to same point count (alternative to distance-based alignment)
    trimToSameLength(lapA, lapB) {
        const minLength = Math.min(lapA.length, lapB.length);
        return {
            lapA: lapA.slice(0, minLength),
            lapB: lapB.slice(0, minLength),
            startDistance: lapA[0].distance,
            endDistance: lapA[minLength - 1].distance,
            length: lapA[minLength - 1].distance - lapA[0].distance
        };
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/interpolation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Interpolation - Linear interpolation utilities for telemetry data
 */ /**
 * Linear interpolation between two values
 * Formula: a + (b - a) × t
 */ __turbopack_context__.s([
    "interpolatePoint",
    ()=>interpolatePoint,
    "interpolateValue",
    ()=>interpolateValue,
    "lerp",
    ()=>lerp
]);
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function interpolateValue(x, x0, x1, y0, y1) {
    if (x1 === x0) return y0;
    const t = (x - x0) / (x1 - x0);
    return lerp(y0, y1, t);
}
function interpolatePoint(distance, point0, point1, distanceKey = 'distance') {
    const d0 = point0[distanceKey];
    const d1 = point1[distanceKey];
    const result = {};
    for(const key in point0){
        if (typeof point0[key] === 'number') {
            result[key] = interpolateValue(distance, d0, d1, point0[key], point1[key]);
        } else {
            result[key] = point0[key];
        }
    }
    return result;
}
}),
"[project]/Desktop/lap-lens/src/analysis/lap-normalizer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Lap Normalizer - Converts variable-spaced telemetry to even distance intervals
 *
 * Raw telemetry arrives at 60Hz (time-based) creating variable spacing.
 * Normalization creates consistent samples (default: 1 sample per meter) for accurate analysis.
 */ __turbopack_context__.s([
    "LapNormalizer",
    ()=>LapNormalizer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$interpolation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/interpolation.ts [app-route] (ecmascript)");
;
class LapNormalizer {
    options;
    constructor(options = {}){
        this.options = {
            sampleRate: options.sampleRate || 1.0
        };
    }
    /**
   * Normalize telemetry to consistent distance-based sampling
   * Sorts points by distance, then interpolates at even intervals
   */ normalize(points, resetDistance = true) {
        if (points.length < 2) {
            return points;
        }
        // Sort by distance (handles out-of-order UDP packets)
        const sorted = [
            ...points
        ].sort((a, b)=>a.distance - b.distance);
        const minDistance = Math.floor(sorted[0].distance);
        const maxDistance = Math.ceil(sorted[sorted.length - 1].distance);
        const distanceOffset = resetDistance ? minDistance : 0;
        const normalized = [];
        let pointIndex = 0;
        // Create evenly-spaced samples by interpolating
        for(let d = minDistance; d <= maxDistance; d += this.options.sampleRate){
            // Find surrounding points
            while(pointIndex < sorted.length - 1 && sorted[pointIndex + 1].distance < d){
                pointIndex++;
            }
            if (pointIndex >= sorted.length - 1) {
                break;
            }
            const point0 = sorted[pointIndex];
            const point1 = sorted[pointIndex + 1];
            if (point1.distance < d) {
                continue;
            }
            const interpolated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$interpolation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["interpolatePoint"])(d, point0, point1, 'distance');
            interpolated.distance = d - distanceOffset;
            normalized.push(interpolated);
        }
        return normalized;
    }
    /**
   * Get track length from telemetry
   */ getTrackLength(points) {
        if (points.length === 0) return 0;
        const sorted = [
            ...points
        ].sort((a, b)=>a.distance - b.distance);
        return sorted[sorted.length - 1].distance - sorted[0].distance;
    }
}
}),
"[project]/Desktop/lap-lens/web/app/api/analysis/compare/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$speed$2d$comparison$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/speed-comparison.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$sector$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/sector-analysis.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$gforce$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/gforce-analysis.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-loader.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$aligner$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-aligner.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$normalizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-normalizer.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lapANum = parseInt(searchParams.get('lapA') || '');
        const lapBNum = parseInt(searchParams.get('lapB') || '');
        const type = searchParams.get('type') || 'speed';
        if (isNaN(lapANum) || isNaN(lapBNum)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid lap numbers'
            }, {
                status: 400
            });
        }
        // Initialize paths
        const lapsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'laps');
        const cornersDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'corners');
        // Initialize analyzers
        const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapLoader"](lapsDir);
        const normalizer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$normalizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapNormalizer"]({
            sampleRate: 1.0
        });
        const aligner = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$aligner$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapAligner"]();
        // Load laps
        const availableLaps = loader.listAvailableLaps();
        const lapAInfo = availableLaps.find((l)=>l.lapNumber === lapANum);
        const lapBInfo = availableLaps.find((l)=>l.lapNumber === lapBNum);
        if (!lapAInfo || !lapBInfo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Lap not found'
            }, {
                status: 404
            });
        }
        // Get track name from metadata
        const lapAMetadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8'));
        const trackName = lapAMetadata.trackName || 'Unknown';
        // Load and process laps
        const rawLapA = loader.loadLap(lapAInfo.filePath);
        const rawLapB = loader.loadLap(lapBInfo.filePath);
        const normalizedA = normalizer.normalize(rawLapA);
        const normalizedB = normalizer.normalize(rawLapB);
        const aligned = aligner.alignLaps(normalizedA, normalizedB);
        // Run appropriate analysis based on type (speed, sector, or gforce)
        let comparisonData;
        if (type === 'speed') {
            const analyzer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$speed$2d$comparison$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SpeedComparisonAnalyzer"]({
                cornerDbPath: cornersDir
            });
            const analysis = analyzer.compareSpeed(aligned, trackName);
            comparisonData = transformSpeedComparison(analysis);
        } else if (type === 'sector') {
            const analyzer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$sector$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SectorAnalyzer"](cornersDir);
            const analysis = analyzer.analyzeSectors(aligned, trackName);
            comparisonData = transformSectorComparison(analysis);
        } else if (type === 'gforce') {
            const analyzer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$gforce$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GForceAnalyzer"]({
                cornerDbPath: cornersDir
            });
            const analysis = analyzer.analyzeGForces(aligned, trackName);
            comparisonData = transformGForceComparison(analysis);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid analysis type'
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            type,
            comparison: comparisonData
        });
    } catch (error) {
        console.error('Error in comparison analysis:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to perform analysis'
        }, {
            status: 500
        });
    }
}
// Transform analysis results to frontend format
function transformSpeedComparison(analysis) {
    return {
        cornerComparison: analysis.corners.map((corner)=>({
                corner: corner.cornerNumber,
                lapA: {
                    entry: corner.entrySpeed.lapA,
                    apex: corner.apexSpeed.lapA,
                    exit: corner.exitSpeed.lapA,
                    min: corner.minSpeed.lapA
                },
                lapB: {
                    entry: corner.entrySpeed.lapB,
                    apex: corner.apexSpeed.lapB,
                    exit: corner.exitSpeed.lapB,
                    min: corner.minSpeed.lapB
                },
                delta: {
                    entry: corner.entrySpeed.delta,
                    apex: corner.apexSpeed.delta,
                    exit: corner.exitSpeed.delta,
                    min: corner.minSpeed.delta,
                    time: corner.timeDelta
                }
            })),
        accelerationZones: analysis.accelerationZones.map((zone, idx)=>({
                zone: idx + 1,
                lapA: {
                    entrySpeed: zone.startSpeed.lapA,
                    exitSpeed: zone.endSpeed.lapA,
                    speedGain: zone.endSpeed.lapA - zone.startSpeed.lapA,
                    duration: zone.duration.lapA
                },
                lapB: {
                    entrySpeed: zone.startSpeed.lapB,
                    exitSpeed: zone.endSpeed.lapB,
                    speedGain: zone.endSpeed.lapB - zone.startSpeed.lapB,
                    duration: zone.duration.lapB
                },
                delta: {
                    entrySpeed: zone.startSpeed.delta,
                    exitSpeed: zone.endSpeed.delta,
                    time: zone.timeDelta
                }
            })),
        summary: {
            totalTimeDelta: analysis.summary.totalTimeDelta,
            avgSpeedDelta: analysis.summary.avgSpeedDelta,
            timeInCorners: analysis.summary.timeGainedInCorners,
            timeInAcceleration: analysis.summary.timeGainedInAccelZones,
            cornersAnalyzed: analysis.corners.length,
            accelZones: analysis.accelerationZones.length
        }
    };
}
function transformSectorComparison(analysis) {
    return {
        sectors: analysis.sectors.map((sector)=>({
                sector: sector.sectorNumber,
                lapA: {
                    time: sector.lapA.time,
                    avgSpeed: sector.lapA.avgSpeed,
                    corners: sector.lapA.cornerCount,
                    avgThrottle: sector.lapA.avgThrottle,
                    avgBrake: sector.lapA.avgBrake
                },
                lapB: {
                    time: sector.lapB.time,
                    avgSpeed: sector.lapB.avgSpeed,
                    corners: sector.lapB.cornerCount,
                    avgThrottle: sector.lapB.avgThrottle,
                    avgBrake: sector.lapB.avgBrake
                },
                delta: {
                    time: sector.timeDelta,
                    percentage: sector.timeGainPercentage,
                    avgSpeed: sector.avgSpeedDelta
                }
            })),
        summary: {
            totalDelta: analysis.summary.totalTimeDelta,
            bestSector: analysis.summary.fastestSector.sectorNumber,
            bestSectorDelta: analysis.summary.fastestSector.timeDelta,
            worstSector: analysis.summary.slowestSector.sectorNumber,
            worstSectorDelta: analysis.summary.slowestSector.timeDelta
        }
    };
}
function transformGForceComparison(analysis) {
    return {
        cornerComparison: analysis.corners.map((corner)=>({
                corner: corner.cornerNumber,
                lapA: {
                    peakLateral: corner.peakLateralG.lapA,
                    peakLongitudinal: Math.max(Math.abs(corner.peakBrakingG.lapA), Math.abs(corner.peakAccelG.lapA)),
                    peakCombined: corner.peakCombinedG.lapA,
                    avgLateral: corner.avgLateralG.lapA,
                    consistency: 1.0 - corner.lateralGStdDev.lapA
                },
                lapB: {
                    peakLateral: corner.peakLateralG.lapB,
                    peakLongitudinal: Math.max(Math.abs(corner.peakBrakingG.lapB), Math.abs(corner.peakAccelG.lapB)),
                    peakCombined: corner.peakCombinedG.lapB,
                    avgLateral: corner.avgLateralG.lapB,
                    consistency: 1.0 - corner.lateralGStdDev.lapB
                },
                delta: {
                    peakLateral: corner.peakLateralG.delta,
                    peakLongitudinal: corner.peakBrakingG.delta,
                    peakCombined: corner.peakCombinedG.delta,
                    avgLateral: corner.avgLateralG.delta
                }
            })),
        insights: analysis.corners.filter((corner)=>corner.insight).map((corner)=>({
                corner: corner.cornerNumber,
                insight: corner.insight.type,
                recommendation: corner.insight.recommendation || corner.insight.message,
                confidence: corner.insight.confidence
            })),
        summary: {
            avgLateralGA: analysis.summary.avgLateralG.lapA,
            avgLongitudinalGA: Math.max(Math.abs(analysis.summary.avgBrakingG.lapA), Math.abs(analysis.summary.avgAccelG.lapA)),
            peakCombinedGA: analysis.summary.peakLateralG.lapA
        }
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ac1f8153._.js.map
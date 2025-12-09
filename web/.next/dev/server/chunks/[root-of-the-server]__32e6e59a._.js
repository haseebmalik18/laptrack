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
"[project]/Desktop/lap-lens/web/app/api/sectors/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-loader.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$normalizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-normalizer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$aligner$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-aligner.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$sector$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/sector-analysis.ts [app-route] (ecmascript)");
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
        const currentLap = searchParams.get('current');
        const referenceLap = searchParams.get('reference');
        if (!currentLap || !referenceLap) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing lap parameters'
            }, {
                status: 400
            });
        }
        const lapsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'laps');
        const cornersDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'corners');
        const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapLoader"](lapsDir);
        const normalizer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$normalizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapNormalizer"]({
            sampleRate: 1.0
        });
        const aligner = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$aligner$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapAligner"]();
        const sectorAnalyzer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$sector$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SectorAnalyzer"](cornersDir);
        const availableLaps = loader.listAvailableLaps();
        const lapAInfo = availableLaps.find((l)=>l.lapNumber === parseInt(currentLap));
        const lapBInfo = availableLaps.find((l)=>l.lapNumber === parseInt(referenceLap));
        if (!lapAInfo || !lapBInfo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Lap not found'
            }, {
                status: 404
            });
        }
        const lapAMetadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8'));
        const trackName = lapAMetadata.trackName || 'Unknown';
        const rawLapA = loader.loadLap(lapAInfo.filePath);
        const rawLapB = loader.loadLap(lapBInfo.filePath);
        const normalizedA = normalizer.normalize(rawLapA);
        const normalizedB = normalizer.normalize(rawLapB);
        const aligned = aligner.alignLaps(normalizedA, normalizedB);
        const analysis = sectorAnalyzer.analyzeSectors(aligned, trackName);
        const sectors = analysis.sectors.map((sector)=>({
                sector: sector.sectorNumber,
                current: sector.lapA.time,
                reference: sector.lapB.time,
                delta: sector.timeDelta
            }));
        const totalCurrent = sectors.reduce((sum, s)=>sum + s.current, 0);
        const totalRef = sectors.reduce((sum, s)=>sum + s.reference, 0);
        const totalDelta = totalCurrent - totalRef;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            sectors,
            total: {
                current: totalCurrent,
                reference: totalRef,
                delta: totalDelta
            },
            metadata: {
                currentLap: parseInt(currentLap),
                referenceLap: parseInt(referenceLap),
                track: trackName
            }
        });
    } catch (error) {
        console.error('Error generating sector times:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to generate sector times',
            details: String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__32e6e59a._.js.map
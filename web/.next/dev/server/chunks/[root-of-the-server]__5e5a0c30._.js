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

__turbopack_context__.s([
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
                gLat: parts[9],
                gLong: parts[10],
                yaw: parts[11] || 0,
                lapNum: 0
            });
        }
        return points;
    }
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
"[project]/Desktop/lap-lens/src/analysis/track-map-loader.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrackMapLoader",
    ()=>TrackMapLoader
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
class TrackMapLoader {
    mapsDir;
    constructor(mapsDir = './track-maps'){
        this.mapsDir = mapsDir;
    }
    loadTrackMap(trackName) {
        const csvPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](this.mapsDir, `${trackName.toLowerCase()}.csv`);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](csvPath)) {
            console.error(`Track map not found: ${csvPath}`);
            return null;
        }
        const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](csvPath, 'utf-8');
        const lines = content.split('\n').slice(1); // Skip header
        const points = [];
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (const line of lines){
            if (!line.trim()) continue;
            const parts = line.split(',').map((p)=>parseFloat(p));
            if (parts.length < 4) continue;
            const point = {
                x: parts[0],
                y: parts[1],
                widthRight: parts[2],
                widthLeft: parts[3]
            };
            points.push(point);
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        }
        return {
            name: trackName,
            points,
            bounds: {
                minX,
                maxX,
                minY,
                maxY
            }
        };
    }
}
}),
"[project]/Desktop/lap-lens/src/analysis/telemetry-aligner.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryAligner",
    ()=>TelemetryAligner
]);
class TelemetryAligner {
    /**
   * Aligns telemetry data to a reference track map
   * This implements the Track Titan approach: transform telemetry to match track outline
   */ alignToTrackMap(telemetry, trackMap) {
        // Step 1: Calculate bounds of telemetry (using rotated coordinates)
        const telemetryPoints = telemetry.map((p)=>({
                x: p.y,
                y: -p.x
            }));
        const telBounds = this.getBounds(telemetryPoints);
        const trackBounds = trackMap.bounds;
        // Step 2: Calculate scale factor to match track length
        const telRangeX = telBounds.maxX - telBounds.minX;
        const telRangeY = telBounds.maxY - telBounds.minY;
        const trackRangeX = trackBounds.maxX - trackBounds.minX;
        const trackRangeY = trackBounds.maxY - trackBounds.minY;
        const scaleX = trackRangeX / telRangeX;
        const scaleY = trackRangeY / telRangeY;
        const scale = (scaleX + scaleY) / 2; // Average scale
        // Step 3: Calculate translation to center
        const telCenterX = (telBounds.minX + telBounds.maxX) / 2;
        const telCenterY = (telBounds.minY + telBounds.maxY) / 2;
        const trackCenterX = (trackBounds.minX + trackBounds.maxX) / 2;
        const trackCenterY = (trackBounds.minY + trackBounds.maxY) / 2;
        const translateX = trackCenterX - telCenterX * scale;
        const translateY = trackCenterY - telCenterY * scale;
        // Step 4: Apply transformation
        const aligned = telemetry.map((p)=>({
                ...p,
                // Transform: rotate, scale, translate
                x: p.y * scale + translateX,
                y: -p.x * scale + translateY
            }));
        return {
            aligned,
            transform: {
                scale,
                rotation: 270,
                translateX,
                translateY
            }
        };
    }
    getBounds(points) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (const p of points){
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }
        return {
            minX,
            maxX,
            minY,
            maxY
        };
    }
}
}),
"[project]/Desktop/lap-lens/web/app/api/laps/[lapNumber]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-loader.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$track$2d$map$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/track-map-loader.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$telemetry$2d$aligner$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/telemetry-aligner.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(_request, { params }) {
    const { lapNumber } = await params;
    const lapsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "..", "laps");
    const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapLoader"](lapsDir);
    const lapInfo = loader.listAvailableLaps().find((l)=>l.lapNumber === parseInt(lapNumber));
    if (!lapInfo) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Lap not found"
        }, {
            status: 404
        });
    }
    const rawTelemetry = loader.loadLap(lapInfo.filePath);
    const metadataPath = lapInfo.filePath.replace('.csv', '.json');
    let metadata = {};
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(metadataPath)) {
            metadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(metadataPath, 'utf-8'));
        }
    } catch (err) {
        console.error('Failed to read metadata:', err);
    }
    // Load track map and align telemetry (Track Titan approach)
    const trackMapsDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "..", "track-maps");
    const trackMapLoader = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$track$2d$map$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TrackMapLoader"](trackMapsDir);
    // Extract track name (e.g., "Sakhir (Bahrain)" -> "sakhir")
    const trackName = metadata.trackName || "Unknown";
    const simpleName = trackName.match(/\(([^)]+)\)/) ? trackName.match(/\(([^)]+)\)/)[1].toLowerCase() : trackName.toLowerCase();
    const trackMap = trackMapLoader.loadTrackMap(simpleName === 'bahrain' ? 'sakhir' : simpleName);
    let telemetry = rawTelemetry;
    let trackMapData = null;
    if (trackMap) {
        // Align telemetry to track map
        const aligner = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$telemetry$2d$aligner$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TelemetryAligner"]();
        const aligned = aligner.alignToTrackMap(rawTelemetry, trackMap);
        telemetry = aligned.aligned;
        trackMapData = trackMap;
        console.log('Track map loaded and aligned:', trackMap.name);
    } else {
        console.log('No track map found for:', simpleName);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        lapNumber: parseInt(lapNumber),
        metadata,
        telemetry,
        trackMap: trackMapData
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5e5a0c30._.js.map
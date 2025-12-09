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
    // Load lap metadata (track name, car, lap time, etc.)
    let metadata = {};
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(metadataPath)) {
            metadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(metadataPath, 'utf-8'));
        }
    } catch (err) {
        console.error('Failed to read metadata:', err);
    }
    // Normalize time to start from 0 (server-side normalization)
    if (rawTelemetry.length > 0) {
        const startTime = rawTelemetry[0].time;
        rawTelemetry.forEach((point)=>{
            point.time = point.time - startTime;
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        lapNumber: parseInt(lapNumber),
        metadata,
        telemetry: rawTelemetry
    }, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e2b32be6._.js.map
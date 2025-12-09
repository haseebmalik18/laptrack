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
"[project]/Desktop/lap-lens/src/analysis/interpolation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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

__turbopack_context__.s([
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
    normalize(points) {
        if (points.length < 2) {
            return points;
        }
        const sorted = [
            ...points
        ].sort((a, b)=>a.distance - b.distance);
        const minDistance = Math.floor(sorted[0].distance);
        const maxDistance = Math.ceil(sorted[sorted.length - 1].distance);
        const normalized = [];
        let pointIndex = 0;
        for(let d = minDistance; d <= maxDistance; d += this.options.sampleRate){
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
            interpolated.distance = d;
            normalized.push(interpolated);
        }
        return normalized;
    }
    getTrackLength(points) {
        if (points.length === 0) return 0;
        const sorted = [
            ...points
        ].sort((a, b)=>a.distance - b.distance);
        return sorted[sorted.length - 1].distance - sorted[0].distance;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$normalizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/src/analysis/lap-normalizer.ts [app-route] (ecmascript)");
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
    // Normalize to 1 sample per meter for consistent visualization
    const normalizer = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$src$2f$analysis$2f$lap$2d$normalizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LapNormalizer"]({
        sampleRate: 1.0
    });
    const telemetry = normalizer.normalize(rawTelemetry);
    const metadataPath = lapInfo.filePath.replace('.csv', '.json');
    let metadata = {};
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(metadataPath)) {
            metadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(metadataPath, 'utf-8'));
        }
    } catch (err) {
        console.error('Failed to read metadata:', err);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        lapNumber: parseInt(lapNumber),
        metadata,
        telemetry
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0b0ddf9e._.js.map
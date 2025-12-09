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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/Desktop/lap-lens/web/app/api/boundaries/[track]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Apply moving average smoothing using sliding window
function smoothBoundary(points, windowSize = 10) {
    if (points.length === 0) return points;
    const smoothed = [];
    const halfWindow = Math.floor(windowSize / 2);
    for(let i = 0; i < points.length; i++){
        const start = Math.max(0, i - halfWindow);
        const end = Math.min(points.length, i + halfWindow + 1);
        let sumX = 0;
        let sumZ = 0;
        let count = 0;
        for(let j = start; j < end; j++){
            sumX += points[j].x;
            sumZ += points[j].z;
            count++;
        }
        smoothed.push({
            distance: points[i].distance,
            x: sumX / count,
            z: sumZ / count
        });
    }
    return smoothed;
}
// Fill gaps in boundary data with linear interpolation
function fillGaps(points, maxGapDistance = 100) {
    if (points.length === 0) return points;
    const filled = [];
    for(let i = 0; i < points.length; i++){
        filled.push(points[i]);
        if (i < points.length - 1) {
            const current = points[i];
            const next = points[i + 1];
            const gap = next.distance - current.distance;
            if (gap > maxGapDistance) {
                const numInterpolated = Math.floor(gap / 10);
                for(let j = 1; j <= numInterpolated; j++){
                    const t = j / (numInterpolated + 1);
                    filled.push({
                        distance: current.distance + gap * t,
                        x: current.x + (next.x - current.x) * t,
                        z: current.z + (next.z - current.z) * t
                    });
                }
            }
        }
    }
    // Handle wrap-around gap for closed tracks
    if (filled.length > 1) {
        const lastPoint = filled[filled.length - 1];
        const firstPoint = filled[0];
        const dx = firstPoint.x - lastPoint.x;
        const dz = firstPoint.z - lastPoint.z;
        const physicalDistance = Math.sqrt(dx * dx + dz * dz);
        if (physicalDistance > 50) {
            const numInterpolated = Math.floor(physicalDistance / 10);
            for(let j = 1; j <= numInterpolated; j++){
                const t = j / (numInterpolated + 1);
                filled.push({
                    distance: lastPoint.distance + j * 10,
                    x: lastPoint.x + dx * t,
                    z: lastPoint.z + dz * t
                });
            }
        }
    }
    return filled;
}
// Reduce point count by sampling every Nth point
function downsample(points, factor = 5) {
    return points.filter((_, i)=>i % factor === 0);
}
// Cache processed boundaries to avoid recomputing
const boundaryCache = new Map();
async function GET(request, { params }) {
    try {
        const { track } = await params;
        // Return cached result if available
        if (boundaryCache.has(track)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(boundaryCache.get(track), {
                headers: {
                    'Cache-Control': 'public, max-age=31536000, immutable'
                }
            });
        }
        const boundariesDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'boundaries');
        const trackName = track;
        const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(boundariesDir);
        const leftFile = files.find((f)=>f.includes(trackName.toLowerCase()) && f.includes('_left_boundary'));
        const rightFile = files.find((f)=>f.includes(trackName.toLowerCase()) && f.includes('_right_boundary'));
        if (!leftFile || !rightFile) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Boundary files not found'
            }, {
                status: 404
            });
        }
        const leftBoundary = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(boundariesDir, leftFile), 'utf-8'));
        const rightBoundary = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(boundariesDir, rightFile), 'utf-8'));
        const leftFilled = fillGaps(leftBoundary.data, 100);
        const rightFilled = fillGaps(rightBoundary.data, 100);
        const leftSmoothed = smoothBoundary(leftFilled, 15);
        const rightSmoothed = smoothBoundary(rightFilled, 15);
        const leftDownsampled = downsample(leftSmoothed, 10);
        const rightDownsampled = downsample(rightSmoothed, 10);
        const result = {
            track: {
                id: leftBoundary.trackId,
                name: leftBoundary.trackName
            },
            left: leftDownsampled,
            right: rightDownsampled,
            originalPointCount: {
                left: leftBoundary.pointCount,
                right: rightBoundary.pointCount
            },
            processedPointCount: {
                left: leftDownsampled.length,
                right: rightDownsampled.length
            }
        };
        // Cache the processed result
        boundaryCache.set(track, result);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            headers: {
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (error) {
        console.error('Error loading boundaries:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to load boundaries'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc9addbe._.js.map
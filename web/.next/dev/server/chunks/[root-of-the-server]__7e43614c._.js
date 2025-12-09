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
"[project]/Desktop/lap-lens/web/app/api/insights/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../../../../src/analysis/gforce-analysis'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../../../src/analysis/lap-loader'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../../../src/analysis/lap-normalizer'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../../../src/analysis/lap-aligner'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../../../src/analysis/corner-database'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
        // Load laps
        const loader = new LapLoader();
        const lapA = loader.loadLap(parseInt(currentLap));
        const lapB = loader.loadLap(parseInt(referenceLap));
        if (!lapA || !lapB) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to load laps'
            }, {
                status: 404
            });
        }
        // Normalize laps
        const normalizer = new LapNormalizer();
        const normalizedA = normalizer.normalize(lapA.telemetry);
        const normalizedB = normalizer.normalize(lapB.telemetry);
        // Align laps
        const aligner = new LapAligner();
        const aligned = aligner.align(normalizedA, normalizedB);
        // Load corners
        const cornerDb = new CornerDatabase();
        const trackName = lapA.metadata.trackName;
        const match = trackName.match(/\(([^)]+)\)/);
        const simpleName = match ? match[1].toLowerCase() : trackName.toLowerCase();
        const corners = cornerDb.loadCorners(simpleName);
        if (!corners || corners.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No corners database found'
            }, {
                status: 404
            });
        }
        // Analyze G-forces and generate insights
        const analyzer = new GForceAnalyzer();
        const analysis = analyzer.analyzeGForces(aligned, corners);
        // Transform insights into UI-friendly format
        const insights = analysis.corners.filter((corner)=>corner.insight && corner.insight.type !== 'neutral' && corner.insight.type !== 'faster-overall').map((corner)=>{
            const insight = corner.insight;
            // Determine improvement type based on insight
            let type = 'apex';
            if (insight.type === 'under-braking' || insight.type === 'over-braking') {
                type = 'braking';
            } else if (corner.exitSpeed.delta < -5) {
                type = 'exit';
            }
            // Generate concise title and description
            let title = '';
            let description = '';
            switch(insight.type){
                case 'under-braking':
                    title = 'Brake Later';
                    const speedLoss = Math.abs(corner.apexSpeed.delta);
                    description = `${speedLoss.toFixed(0)} km/h slow at apex. ${insight.recommendation || 'Brake later'}`;
                    break;
                case 'over-braking':
                    title = 'Braking Too Early';
                    description = insight.recommendation || 'Brake closer to corner';
                    break;
                case 'not-using-grip':
                    title = 'More Grip Available';
                    const gDelta = Math.abs(corner.peakLateralG.delta);
                    description = `${gDelta.toFixed(1)}G left on table. Push harder through corner.`;
                    break;
                case 'better-previous-corner':
                    title = 'Better Entry';
                    description = `Faster entry from T${corner.cornerNumber - 1}. Good adaptation.`;
                    break;
                default:
                    title = 'Slower';
                    description = insight.message;
            }
            // Calculate potential time gain
            const timeDelta = corner.exitDistance - corner.entryDistance;
            const currentTime = timeDelta / Math.max(corner.apexSpeed.lapA, 1);
            const refTime = timeDelta / Math.max(corner.apexSpeed.lapB, 1);
            const potentialGain = Math.abs(currentTime - refTime);
            return {
                corner: corner.cornerNumber,
                distance: corner.apexDistance,
                brakingDistance: corners[corner.cornerNumber - 1]?.brakingZone?.entryDistance || corner.entryDistance,
                type,
                title,
                description,
                potentialGain: `${potentialGain.toFixed(2)}s`,
                confidence: insight.confidence
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            insights
        });
    } catch (error) {
        console.error('Error generating insights:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to generate insights',
            details: String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7e43614c._.js.map
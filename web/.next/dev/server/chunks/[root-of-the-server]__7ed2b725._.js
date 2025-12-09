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
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/Desktop/lap-lens/web/app/api/insights/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
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
        // Get track name from lap metadata
        const lapFiles = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(lapsDir).filter((f)=>f.startsWith(`lap_${currentLap}_`) && f.endsWith('.json'));
        if (lapFiles.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Lap not found'
            }, {
                status: 404
            });
        }
        const lapMetadata = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(lapsDir, lapFiles[0]), 'utf-8'));
        const trackName = lapMetadata.trackName;
        const match = trackName.match(/\(([^)]+)\)/);
        const simpleName = match ? match[1].toLowerCase() : trackName.toLowerCase();
        // Load corners database
        const cornerDbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(cornersDir, `${simpleName}.json`);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(cornerDbPath)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Corner database not found'
            }, {
                status: 404
            });
        }
        const cornerDb = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(cornerDbPath, 'utf-8'));
        const corners = cornerDb.corners;
        // Run the actual G-force comparison analysis
        const projectRoot = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..');
        const analysisCmd = `cd "${projectRoot}" && npx tsx src/compare-gforce.ts ${currentLap} ${referenceLap} --json`;
        let analysisResult;
        try {
            const output = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["execSync"])(analysisCmd, {
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024
            });
            // Extract JSON from output (it may have other console logs)
            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON output from analysis');
            }
        } catch (execError) {
            console.error('Failed to run analysis:', execError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Analysis failed',
                details: String(execError)
            }, {
                status: 500
            });
        }
        // Transform G-force analysis insights into UI-friendly format
        const insights = analysisResult.corners?.filter((corner)=>corner.insight && corner.insight.type !== 'neutral' && corner.insight.type !== 'faster-overall').map((corner)=>{
            const insight = corner.insight;
            const cornerData = corners.find((c)=>c.cornerNumber === corner.cornerNumber);
            // Determine improvement type and generate concise messages
            let type = 'apex';
            let title = '';
            let description = '';
            switch(insight.type){
                case 'under-braking':
                    type = 'braking';
                    title = 'Brake Later';
                    const speedLoss = Math.abs(corner.apexSpeed?.delta || 0);
                    description = `${speedLoss.toFixed(0)} km/h slow at apex. Brake later.`;
                    break;
                case 'over-braking':
                    type = 'braking';
                    title = 'Braking Too Early';
                    description = 'Braking too early. Brake closer to corner.';
                    break;
                case 'not-using-grip':
                    type = 'apex';
                    title = 'More Grip Available';
                    const gDelta = Math.abs(corner.peakLateralG?.delta || 0);
                    description = `${gDelta.toFixed(1)}G unused. Push harder.`;
                    break;
                case 'better-previous-corner':
                    type = 'apex';
                    title = 'Better Entry';
                    description = `Faster entry. Good adaptation.`;
                    break;
                default:
                    type = 'apex';
                    title = 'Slower';
                    description = insight.message || 'Check this corner.';
            }
            // Calculate time gain
            const timeDelta = corner.exitDistance - corner.entryDistance || 100;
            const currentTime = timeDelta / Math.max(corner.apexSpeed?.lapA || 100, 1);
            const refTime = timeDelta / Math.max(corner.apexSpeed?.lapB || 100, 1);
            const potentialGain = Math.abs(currentTime - refTime);
            return {
                corner: corner.cornerNumber,
                distance: corner.apexDistance,
                brakingDistance: cornerData?.brakingZone?.entryDistance || corner.entryDistance,
                type,
                title,
                description,
                potentialGain: `${potentialGain.toFixed(2)}s`,
                confidence: insight.confidence || 'medium'
            };
        }) || [];
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

//# sourceMappingURL=%5Broot-of-the-server%5D__7ed2b725._.js.map
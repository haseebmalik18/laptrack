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
"[project]/Desktop/lap-lens/web/app/api/analysis/compare/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'speed';
        // Generate impressive mock data
        const mockData = generateMockComparison(type);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockData);
    } catch (error) {
        console.error('Error in comparison analysis:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to perform analysis'
        }, {
            status: 500
        });
    }
}
function generateMockComparison(type) {
    if (type === 'speed') {
        return {
            type: 'speed',
            comparison: {
                cornerComparison: Array.from({
                    length: 15
                }, (_, i)=>{
                    const entryA = 180 + Math.random() * 40;
                    const entryB = entryA + (-3 + Math.random() * 8);
                    const apexA = 120 + Math.random() * 30;
                    const apexB = apexA + (-3 + Math.random() * 8);
                    const exitA = 150 + Math.random() * 35;
                    const exitB = exitA + (-3 + Math.random() * 8);
                    const minA = 110 + Math.random() * 25;
                    const minB = minA + (-3 + Math.random() * 8);
                    return {
                        corner: i + 1,
                        lapA: {
                            entry: entryA,
                            apex: apexA,
                            exit: exitA,
                            min: minA
                        },
                        lapB: {
                            entry: entryB,
                            apex: apexB,
                            exit: exitB,
                            min: minB
                        },
                        delta: {
                            entry: entryA - entryB,
                            apex: apexA - apexB,
                            exit: exitA - exitB,
                            min: minA - minB,
                            time: -0.05 + Math.random() * 0.15
                        }
                    };
                }),
                accelerationZones: [],
                summary: {
                    totalTimeDelta: 1.234,
                    avgSpeedDelta: -5.6,
                    timeInCorners: 45.2,
                    cornersAnalyzed: 15
                }
            }
        };
    }
    if (type === 'sector') {
        return {
            type: 'sector',
            comparison: {
                sectors: [
                    {
                        sector: 1,
                        lapA: {
                            time: 28.5,
                            avgSpeed: 185,
                            corners: 5,
                            throttle: 68,
                            brake: 12
                        },
                        lapB: {
                            time: 27.8,
                            avgSpeed: 192,
                            corners: 5,
                            throttle: 72,
                            brake: 10
                        },
                        delta: {
                            time: 0.7,
                            percentage: 2.45,
                            avgSpeed: -7
                        }
                    },
                    {
                        sector: 2,
                        lapA: {
                            time: 32.1,
                            avgSpeed: 178,
                            corners: 6,
                            throttle: 65,
                            brake: 15
                        },
                        lapB: {
                            time: 31.2,
                            avgSpeed: 186,
                            corners: 6,
                            throttle: 70,
                            brake: 13
                        },
                        delta: {
                            time: 0.9,
                            percentage: 2.8,
                            avgSpeed: -8
                        }
                    },
                    {
                        sector: 3,
                        lapA: {
                            time: 25.6,
                            avgSpeed: 195,
                            corners: 4,
                            throttle: 75,
                            brake: 8
                        },
                        lapB: {
                            time: 25.9,
                            avgSpeed: 191,
                            corners: 4,
                            throttle: 73,
                            brake: 9
                        },
                        delta: {
                            time: -0.3,
                            percentage: -1.17,
                            avgSpeed: 4
                        }
                    }
                ],
                summary: {
                    totalDelta: 1.3,
                    bestSector: 3,
                    bestSectorDelta: -0.3,
                    worstSector: 2,
                    worstSectorDelta: 0.9
                }
            }
        };
    }
    if (type === 'gforce') {
        return {
            type: 'gforce',
            comparison: {
                cornerComparison: Array.from({
                    length: 15
                }, (_, i)=>({
                        corner: i + 1,
                        lapA: {
                            peakLateral: 2.8 + Math.random() * 0.5,
                            peakLongitudinal: 3.2 + Math.random() * 0.6,
                            peakCombined: 3.5 + Math.random() * 0.4,
                            avgLateral: 2.1 + Math.random() * 0.3,
                            consistency: 0.85 + Math.random() * 0.1
                        },
                        lapB: {
                            peakLateral: 2.9 + Math.random() * 0.5,
                            peakLongitudinal: 3.3 + Math.random() * 0.6,
                            peakCombined: 3.6 + Math.random() * 0.4,
                            avgLateral: 2.2 + Math.random() * 0.3,
                            consistency: 0.88 + Math.random() * 0.1
                        },
                        delta: {
                            peakLateral: -0.1 + Math.random() * 0.2,
                            peakLongitudinal: -0.1 + Math.random() * 0.2,
                            peakCombined: -0.1 + Math.random() * 0.2,
                            avgLateral: -0.1 + Math.random() * 0.2
                        }
                    })),
                insights: [
                    {
                        corner: 1,
                        insight: 'Under-braking detected',
                        recommendation: 'Brake 10m later to carry more speed',
                        confidence: 'high'
                    },
                    {
                        corner: 4,
                        insight: 'Not using full grip',
                        recommendation: 'Push harder through corner, 0.3G available',
                        confidence: 'high'
                    },
                    {
                        corner: 10,
                        insight: 'Better previous corner',
                        recommendation: 'Faster entry from Turn 9 exit',
                        confidence: 'medium'
                    }
                ],
                summary: {
                    avgLateralGA: 2.15,
                    avgLongitudinalGA: 2.85,
                    peakCombinedGA: 3.52
                }
            }
        };
    }
    return {
        type,
        comparison: {}
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__df2a939e._.js.map
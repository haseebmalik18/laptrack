(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryOverlay",
    ()=>TelemetryOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function TelemetryOverlay({ telemetryPoint }) {
    if (!telemetryPoint) return null;
    const speed = telemetryPoint.speed || 0;
    const throttle = (telemetryPoint.throttle || 0) * 100;
    const brake = (telemetryPoint.brake || 0) * 100;
    const gear = telemetryPoint.gear || 0;
    const rpm = telemetryPoint.rpm || 0;
    const distance = telemetryPoint.distance || 0;
    const time = telemetryPoint.time || 0;
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(3);
        return `${mins}:${secs.padStart(6, '0')}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 pointer-events-none z-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/95 to-transparent p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start max-w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-black border-l-4 border-blue-500 px-4 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-400 uppercase tracking-wider mb-1",
                                            children: "Speed"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-4xl font-bold text-white tabular-nums leading-none",
                                            children: Math.round(speed)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 33,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-500 uppercase mt-1",
                                            children: "km/h"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 36,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-black border-l-4 border-cyan-500 px-4 py-2 min-w-[80px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-400 uppercase tracking-wider mb-1",
                                            children: "Gear"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-4xl font-bold text-white tabular-nums leading-none text-center",
                                            children: gear
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-black border-t-2 border-zinc-700 px-4 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-400 uppercase tracking-wider mb-1",
                                            children: "Lap Time"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-mono text-white tabular-nums",
                                            children: formatTime(time)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-black border-t-2 border-zinc-700 px-4 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-400 uppercase tracking-wider mb-1",
                                            children: "Distance"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-mono text-white tabular-nums",
                                            children: [
                                                Math.round(distance),
                                                "m"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black border-l-4 border-orange-500 px-4 py-2 min-w-[120px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-zinc-400 uppercase tracking-wider mb-1",
                                    children: "RPM"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white tabular-nums",
                                    children: Math.round(rpm).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-1 bg-zinc-900 mt-2 w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full transition-all duration-100",
                                        style: {
                                            width: `${Math.min(rpm / 15000 * 100, 100)}%`,
                                            backgroundColor: rpm > 12000 ? "#ef4444" : rpm > 10000 ? "#f97316" : "#22c55e"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black border border-zinc-800 px-6 py-3 min-w-[180px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-400 uppercase tracking-wider",
                                            children: "Throttle"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-mono text-white tabular-nums",
                                            children: [
                                                Math.round(throttle),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-2 bg-zinc-900 w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full bg-green-500 transition-all duration-100",
                                        style: {
                                            width: `${throttle}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black border border-zinc-800 px-6 py-3 min-w-[180px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-zinc-400 uppercase tracking-wider",
                                            children: "Brake"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-mono text-white tabular-nums",
                                            children: [
                                                Math.round(brake),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-2 bg-zinc-900 w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full bg-red-500 transition-all duration-100",
                                        style: {
                                            width: `${brake}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = TelemetryOverlay;
var _c;
__turbopack_context__.k.register(_c, "TelemetryOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrackMapWithBoundaries",
    ()=>TrackMapWithBoundaries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$app$2f$components$2f$TelemetryOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/app/components/TelemetryOverlay.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TrackMapWithBoundaries({ lapData, corners = [], currentIndex = 0, trackName = "sakhir-(bahrain)", referenceLapData }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const smoothedRefIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [boundaries, setBoundaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showBoundaries, setShowBoundaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showRacingLine, setShowRacingLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showBrakingZones, setShowBrakingZones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showCornerMarkers, setShowCornerMarkers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showImprovements, setShowImprovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredImprovement, setHoveredImprovement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load boundaries
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TrackMapWithBoundaries.useEffect": ()=>{
            fetch(`/api/boundaries/${trackName}`).then({
                "TrackMapWithBoundaries.useEffect": (res)=>res.json()
            }["TrackMapWithBoundaries.useEffect"]).then({
                "TrackMapWithBoundaries.useEffect": (data)=>{
                    if (data.error) {
                        setBoundaries(null);
                    } else {
                        setBoundaries(data);
                    }
                }
            }["TrackMapWithBoundaries.useEffect"]).catch({
                "TrackMapWithBoundaries.useEffect": (err)=>{
                    setBoundaries(null);
                }
            }["TrackMapWithBoundaries.useEffect"]);
        }
    }["TrackMapWithBoundaries.useEffect"], [
        trackName
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TrackMapWithBoundaries.useEffect": ()=>{
            if (!canvasRef.current || !lapData?.telemetry) {
                return;
            }
            const telemetry = lapData.telemetry;
            if (referenceLapData?.telemetry) {
                // Reset smoothed index when reference lap changes
                smoothedRefIndexRef.current = null;
            }
            if (telemetry.length === 0) {
                return;
            }
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            const width = rect.width;
            const height = rect.height;
            // Get current car position for camera follow with interpolation
            const floorIndex = Math.floor(currentIndex);
            const ceilIndex = Math.min(Math.ceil(currentIndex), telemetry.length - 1);
            const fraction = currentIndex - floorIndex;
            const currentPoint = telemetry[floorIndex];
            const nextPoint = telemetry[ceilIndex];
            // Interpolate position for smooth movement
            const interpolatedX = currentPoint && nextPoint ? currentPoint.x + (nextPoint.x - currentPoint.x) * fraction : currentPoint?.x || 0;
            const interpolatedY = currentPoint && nextPoint ? currentPoint.y + (nextPoint.y - currentPoint.y) * fraction : currentPoint?.y || 0;
            const centerX = interpolatedY;
            const centerY = -interpolatedX;
            // Camera zoom level (higher = more zoomed in)
            const zoomScale = 1.0;
            // View range around car (in meters)
            const viewRange = 80;
            const minX = centerX - viewRange;
            const maxX = centerX + viewRange;
            const minY = centerY - viewRange;
            const maxY = centerY + viewRange;
            const rangeX = maxX - minX;
            const rangeY = maxY - minY;
            const scale = Math.min(width / rangeX, height / rangeY) * zoomScale;
            const toScreenX = {
                "TrackMapWithBoundaries.useEffect.toScreenX": (x, y)=>{
                    const rx = y;
                    return width / 2 + (rx - centerX) * scale;
                }
            }["TrackMapWithBoundaries.useEffect.toScreenX"];
            const toScreenY = {
                "TrackMapWithBoundaries.useEffect.toScreenY": (x, y)=>{
                    const ry = -x;
                    return height / 2 + (ry - centerY) * scale;
                }
            }["TrackMapWithBoundaries.useEffect.toScreenY"];
            // Clear background
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, width, height);
            // Draw track boundaries
            if (boundaries && showBoundaries) {
                // Draw track surface (filled area between boundaries)
                ctx.fillStyle = "#2a2a2a";
                ctx.beginPath();
                // Draw along left boundary
                boundaries.left.forEach({
                    "TrackMapWithBoundaries.useEffect": (p, i)=>{
                        const x = toScreenX(p.x, p.z);
                        const y = toScreenY(p.x, p.z);
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                }["TrackMapWithBoundaries.useEffect"]);
                // Draw along right boundary in REVERSE to close the polygon
                for(let i = boundaries.right.length - 1; i >= 0; i--){
                    const p = boundaries.right[i];
                    const x = toScreenX(p.x, p.z);
                    const y = toScreenY(p.x, p.z);
                    ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                const getBahrainKerbConfig = {
                    "TrackMapWithBoundaries.useEffect.getBahrainKerbConfig": (cornerIndex)=>{
                        const configs = [
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.5,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.3,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: false
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.4,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: false
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.5,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: false
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.4,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: false
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.3,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.6,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: false
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.5,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: true,
                                outsideStart: 0.4,
                                outsideEnd: 1.0
                            },
                            {
                                inside: true,
                                outside: false
                            }
                        ];
                        return configs[cornerIndex] || {
                            inside: true,
                            outside: false
                        };
                    }
                }["TrackMapWithBoundaries.useEffect.getBahrainKerbConfig"];
                const drawKerbsAtCorners = {
                    "TrackMapWithBoundaries.useEffect.drawKerbsAtCorners": ()=>{
                        ctx.lineWidth = 5;
                        ctx.lineCap = "butt";
                        corners.forEach({
                            "TrackMapWithBoundaries.useEffect.drawKerbsAtCorners": (corner, idx)=>{
                                const isLeftTurn = corner.direction === 'left';
                                const insideBoundary = isLeftTurn ? boundaries.left : boundaries.right;
                                const outsideBoundary = isLeftTurn ? boundaries.right : boundaries.left;
                                const kerbConfig = getBahrainKerbConfig(idx);
                                const drawKerbOnBoundary = {
                                    "TrackMapWithBoundaries.useEffect.drawKerbsAtCorners.drawKerbOnBoundary": (boundary, start, end)=>{
                                        for(let i = 0; i < boundary.length - 1; i++){
                                            const p1 = boundary[i];
                                            const p2 = boundary[i + 1];
                                            if (p1.distance >= start && p1.distance <= end) {
                                                const segmentStart = Math.floor(p1.distance / 3);
                                                const color = segmentStart % 2 === 0 ? "#cc0000" : "#d8d8d8";
                                                ctx.strokeStyle = color;
                                                ctx.beginPath();
                                                ctx.moveTo(toScreenX(p1.x, p1.z), toScreenY(p1.x, p1.z));
                                                ctx.lineTo(toScreenX(p2.x, p2.z), toScreenY(p2.x, p2.z));
                                                ctx.stroke();
                                            }
                                        }
                                    }
                                }["TrackMapWithBoundaries.useEffect.drawKerbsAtCorners.drawKerbOnBoundary"];
                                if (kerbConfig.inside) {
                                    drawKerbOnBoundary(insideBoundary, corner.entryDistance, corner.exitDistance);
                                }
                                if (kerbConfig.outside) {
                                    const cornerLength = corner.exitDistance - corner.entryDistance;
                                    const exitStart = corner.entryDistance + cornerLength * (kerbConfig.outsideStart || 0.5);
                                    const exitEnd = corner.entryDistance + cornerLength * (kerbConfig.outsideEnd || 1.0);
                                    drawKerbOnBoundary(outsideBoundary, exitStart, exitEnd);
                                }
                            }
                        }["TrackMapWithBoundaries.useEffect.drawKerbsAtCorners"]);
                    }
                }["TrackMapWithBoundaries.useEffect.drawKerbsAtCorners"];
                // Draw kerbs at corners
                drawKerbsAtCorners();
                // Draw white track boundary lines
                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                // Helper function to draw smooth boundary line using quadratic curves
                const drawSmoothBoundary = {
                    "TrackMapWithBoundaries.useEffect.drawSmoothBoundary": (boundary)=>{
                        if (boundary.length < 2) return;
                        const points = boundary.map({
                            "TrackMapWithBoundaries.useEffect.drawSmoothBoundary.points": (p)=>({
                                    x: toScreenX(p.x, p.z),
                                    y: toScreenY(p.x, p.z)
                                })
                        }["TrackMapWithBoundaries.useEffect.drawSmoothBoundary.points"]);
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        // Use quadratic curves for smooth lines
                        for(let i = 1; i < points.length - 1; i++){
                            const currentPoint = points[i];
                            const nextPoint = points[i + 1];
                            // Calculate midpoint for smooth curve
                            const midX = (currentPoint.x + nextPoint.x) / 2;
                            const midY = (currentPoint.y + nextPoint.y) / 2;
                            ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midX, midY);
                        }
                        // Last segment
                        const lastPoint = points[points.length - 1];
                        ctx.lineTo(lastPoint.x, lastPoint.y);
                        ctx.stroke();
                    }
                }["TrackMapWithBoundaries.useEffect.drawSmoothBoundary"];
                // Left boundary white line (smooth)
                drawSmoothBoundary(boundaries.left);
                // Right boundary white line (smooth)
                drawSmoothBoundary(boundaries.right);
                // Draw start/finish line
                if (boundaries.left.length > 0 && boundaries.right.length > 0) {
                    const leftStart = boundaries.left[0];
                    const rightStart = boundaries.right[0];
                    ctx.strokeStyle = "rgba(0, 255, 136, 0.8)";
                    ctx.lineWidth = 3;
                    ctx.setLineDash([
                        5,
                        5
                    ]);
                    ctx.beginPath();
                    ctx.moveTo(toScreenX(leftStart.x, leftStart.z), toScreenY(leftStart.x, leftStart.z));
                    ctx.lineTo(toScreenX(rightStart.x, rightStart.z), toScreenY(rightStart.x, rightStart.z));
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
            // Draw braking zones - DISABLED (showing in wrong spots)
            // if (showBrakingZones) {
            //   corners.forEach((corner: any) => {
            //     if (corner.brakingZone) {
            //       const bz = corner.brakingZone;
            //       const startIdx = telemetry.findIndex((p: any) => p.distance >= bz.entryDistance);
            //       const endIdx = telemetry.findIndex((p: any) => p.distance >= bz.exitDistance);
            //       if (startIdx >= 0 && endIdx >= 0) {
            //         ctx.strokeStyle = "rgba(255, 60, 60, 0.7)";
            //         ctx.lineWidth = 8;
            //         ctx.lineCap = "round";
            //         ctx.lineJoin = "round";
            //         ctx.beginPath();
            //         for (let i = startIdx; i <= endIdx; i++) {
            //           const p = telemetry[i];
            //           const x = toScreenX(p.x, p.y);
            //           const y = toScreenY(p.x, p.y);
            //           if (i === startIdx) ctx.moveTo(x, y);
            //           else ctx.lineTo(x, y);
            //         }
            //         ctx.stroke();
            //       }
            //     }
            //   });
            // }
            // Draw reference lap racing line (if available)
            if (showRacingLine && referenceLapData?.telemetry) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = "rgba(0, 200, 255, 0.5)"; // Cyan/blue for reference
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();
                referenceLapData.telemetry.forEach({
                    "TrackMapWithBoundaries.useEffect": (p, i)=>{
                        const x = toScreenX(p.x, p.y);
                        const y = toScreenY(p.x, p.y);
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            const prevP = referenceLapData.telemetry[i - 1];
                            const dx = p.x - prevP.x;
                            const dy = p.y - prevP.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist > 50) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        }
                    }
                }["TrackMapWithBoundaries.useEffect"]);
                ctx.stroke();
            }
            // Draw current lap racing line
            if (showRacingLine) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#ffff00";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();
                telemetry.forEach({
                    "TrackMapWithBoundaries.useEffect": (p, i)=>{
                        const x = toScreenX(p.x, p.y);
                        const y = toScreenY(p.x, p.y);
                        // Check for large gaps (discontinuities)
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            const prevP = telemetry[i - 1];
                            const dx = p.x - prevP.x;
                            const dy = p.y - prevP.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            // If gap is too large (> 50m), start new path
                            if (dist > 50) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        }
                    }
                }["TrackMapWithBoundaries.useEffect"]);
                ctx.stroke();
            }
            // Draw corner markers - DISABLED (WIP)
            // if (showCornerMarkers) {
            //   corners.forEach((corner: any, idx: number) => {
            //     // Find closest telemetry point to apex distance (not just within 5m)
            //     let apexPoint = null;
            //     let minDist = Infinity;
            //     for (const p of telemetry) {
            //       const dist = Math.abs(p.distance - corner.apexDistance);
            //       if (dist < minDist) {
            //         minDist = dist;
            //         apexPoint = p;
            //       }
            //     }
            //     if (apexPoint) {
            //       const x = toScreenX(apexPoint.x, apexPoint.y);
            //       const y = toScreenY(apexPoint.x, apexPoint.y);
            //       ctx.fillStyle = "#000";
            //       ctx.beginPath();
            //       ctx.arc(x, y, 16, 0, Math.PI * 2);
            //       ctx.fill();
            //       ctx.fillStyle = "#fff";
            //       ctx.beginPath();
            //       ctx.arc(x, y, 14, 0, Math.PI * 2);
            //       ctx.fill();
            //       ctx.fillStyle = "#000";
            //       ctx.font = "bold 11px sans-serif";
            //       ctx.textAlign = "center";
            //       ctx.textBaseline = "middle";
            //       ctx.fillText(`${idx + 1}`, x, y);
            //     }
            //   });
            // }
            // Draw improvement opportunity markers (only where slower than reference)
            if (showImprovements && referenceLapData?.corners && currentPoint) {
                const currentDistance = currentPoint.distance;
                corners.forEach({
                    "TrackMapWithBoundaries.useEffect": (corner, idx)=>{
                        // Find matching corner in reference lap
                        const refCorner = referenceLapData.corners.find({
                            "TrackMapWithBoundaries.useEffect.refCorner": (c)=>Math.abs(c.apexDistance - corner.apexDistance) < 50
                        }["TrackMapWithBoundaries.useEffect.refCorner"]);
                        if (refCorner && corner.brakingZone) {
                            // Calculate speed difference
                            const speedDiff = (refCorner.apexSpeed || 0) - (corner.apexSpeed || 0);
                            const timeLoss = (corner.exitDistance - corner.entryDistance) / Math.max(corner.apexSpeed, 1) - (refCorner.exitDistance - refCorner.entryDistance) / Math.max(refCorner.apexSpeed, 1);
                            // Only show marker if losing significant time (>0.1s)
                            if (timeLoss > 0.1) {
                                const bz = corner.brakingZone;
                                // Find closest telemetry point to braking zone entry
                                let markerPoint = null;
                                let minDist = Infinity;
                                for (const p of telemetry){
                                    const dist = Math.abs(p.distance - bz.entryDistance);
                                    if (dist < minDist) {
                                        minDist = dist;
                                        markerPoint = p;
                                    }
                                }
                                if (markerPoint) {
                                    const mx = toScreenX(markerPoint.x, markerPoint.y);
                                    const my = toScreenY(markerPoint.x, markerPoint.y);
                                    // Check if currently AT this spot (tight window - only when you reach it)
                                    const distanceToCorner = currentDistance - bz.entryDistance;
                                    const isAtSpot = Math.abs(distanceToCorner) < 20; // Very tight - only at the spot
                                    // Yellow marker with exclamation mark
                                    ctx.fillStyle = "#ffff00";
                                    ctx.beginPath();
                                    ctx.arc(mx, my, 10, 0, Math.PI * 2);
                                    ctx.fill();
                                    // Black border
                                    ctx.strokeStyle = "#000000";
                                    ctx.lineWidth = 2;
                                    ctx.stroke();
                                    // Exclamation mark inside
                                    ctx.fillStyle = "#000000";
                                    ctx.font = "bold 14px Arial";
                                    ctx.textAlign = "center";
                                    ctx.textBaseline = "middle";
                                    ctx.fillText("!", mx, my);
                                    // Show tip ONLY when at the spot
                                    if (isAtSpot) {
                                        // Generate improvement tip based on data
                                        let tipText = '';
                                        if (speedDiff > 5) {
                                            tipText = `Carry +${speedDiff.toFixed(0)} km/h`;
                                        } else if (timeLoss > 0.3) {
                                            tipText = 'Brake later';
                                        } else {
                                            tipText = 'More speed possible';
                                        }
                                        // Dynamic tooltip size based on text
                                        const boxWidth = 160;
                                        const boxHeight = 36;
                                        const boxX = mx - boxWidth / 2;
                                        const boxY = my - 55;
                                        // Tooltip background - solid yellow
                                        ctx.fillStyle = "#ffff00";
                                        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
                                        // Black border
                                        ctx.strokeStyle = "#000000";
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
                                        // Tip text - black on yellow
                                        ctx.fillStyle = "#000000";
                                        ctx.font = "bold 14px Arial";
                                        ctx.textAlign = "center";
                                        ctx.fillText(tipText, mx, boxY + 22);
                                    }
                                }
                            }
                        }
                    }
                }["TrackMapWithBoundaries.useEffect"]);
            }
            // Draw reference lap position (if available) - TIME SYNCHRONIZED
            if (referenceLapData?.telemetry && currentPoint) {
                const refTelemetry = referenceLapData.telemetry;
                // TIME-BASED MATCHING: Find where reference lap was at the same time
                const currentTime = currentPoint.time;
                // Find the reference point that matches the current time
                let targetRefIndex = refTelemetry.findIndex({
                    "TrackMapWithBoundaries.useEffect.targetRefIndex": (p)=>p.time >= currentTime
                }["TrackMapWithBoundaries.useEffect.targetRefIndex"]);
                if (targetRefIndex === -1) targetRefIndex = refTelemetry.length - 1;
                if (targetRefIndex === 0) targetRefIndex = 1; // Ensure we can interpolate
                // Initialize smoothed index on first frame to current target
                if (smoothedRefIndexRef.current === null) {
                    smoothedRefIndexRef.current = targetRefIndex;
                }
                // Smooth transition to target index
                const currentSmoothed = smoothedRefIndexRef.current ?? targetRefIndex;
                const difference = targetRefIndex - currentSmoothed;
                smoothedRefIndexRef.current = currentSmoothed + difference * 0.3; // Smooth movement
                // Now use the smoothed index for interpolation
                const smoothedIdx = smoothedRefIndexRef.current ?? 0;
                const idx1 = Math.floor(smoothedIdx);
                const idx2 = Math.min(idx1 + 1, refTelemetry.length - 1);
                const refFraction = smoothedIdx - idx1;
                const refPoint1 = refTelemetry[idx1];
                const refPoint2 = refTelemetry[idx2];
                // Smooth interpolation with safety checks
                if (refPoint1 && refPoint2) {
                    const refInterpolatedX = refPoint1.x + (refPoint2.x - refPoint1.x) * refFraction;
                    const refInterpolatedY = refPoint1.y + (refPoint2.y - refPoint1.y) * refFraction;
                    const rx = toScreenX(refInterpolatedX, refInterpolatedY);
                    const ry = toScreenY(refInterpolatedX, refInterpolatedY);
                    // Only draw if coordinates are valid (not NaN)
                    if (isFinite(rx) && isFinite(ry)) {
                        // Reference lap car (cyan/blue) - same size as current lap
                        ctx.fillStyle = "#00c8ff";
                        ctx.beginPath();
                        ctx.arc(rx, ry, 5, 0, Math.PI * 2);
                        ctx.fill();
                        // Inner dot
                        ctx.fillStyle = "#000000";
                        ctx.beginPath();
                        ctx.arc(rx, ry, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            // Draw current position as a clean dot using interpolated position
            if (currentPoint) {
                const cx = toScreenX(interpolatedX, interpolatedY);
                const cy = toScreenY(interpolatedX, interpolatedY);
                // Outer ring (yellow to match racing line)
                ctx.fillStyle = "#ffff00";
                ctx.beginPath();
                ctx.arc(cx, cy, 5, 0, Math.PI * 2);
                ctx.fill();
                // Inner dot
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }["TrackMapWithBoundaries.useEffect"], [
        lapData,
        corners,
        currentIndex,
        boundaries,
        showBoundaries,
        showRacingLine,
        showBrakingZones,
        showCornerMarkers,
        showImprovements,
        referenceLapData
    ]);
    const currentTelemetryPoint = lapData?.telemetry?.[Math.floor(currentIndex)];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative rounded-lg border border-zinc-800 bg-zinc-900/50 mx-auto",
        style: {
            maxWidth: "1200px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$app$2f$components$2f$TelemetryOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TelemetryOverlay"], {
                telemetryPoint: currentTelemetryPoint
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 596,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-20 right-2 z-20 flex flex-col gap-1 pointer-events-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowBoundaries(!showBoundaries),
                        className: `px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${showBoundaries ? 'bg-black/90 text-white border border-zinc-700' : 'bg-black/60 text-zinc-500 border border-zinc-800 hover:bg-black/80'}`,
                        children: "Boundaries"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 600,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowRacingLine(!showRacingLine),
                        className: `px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${showRacingLine ? 'bg-black/90 text-white border border-zinc-700' : 'bg-black/60 text-zinc-500 border border-zinc-800 hover:bg-black/80'}`,
                        children: "Line"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 610,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: true,
                        className: "px-2 py-1 text-[10px] uppercase tracking-wide bg-black/40 text-zinc-600 border border-zinc-800 cursor-not-allowed",
                        children: "Braking (WIP)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 620,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: true,
                        className: "px-2 py-1 text-[10px] uppercase tracking-wide bg-black/40 text-zinc-600 border border-zinc-800 cursor-not-allowed",
                        children: "Corners (WIP)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: true,
                        className: "px-2 py-1 text-[10px] uppercase tracking-wide bg-black/40 text-zinc-600 border border-zinc-800 cursor-not-allowed",
                        children: "Tips (WIP)"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 632,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 599,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "cursor-crosshair bg-black mx-auto",
                style: {
                    height: "650px",
                    width: "1200px",
                    maxWidth: "100%"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 640,
                columnNumber: 7
            }, this),
            tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed z-50 rounded bg-black px-3 py-2 text-sm text-white shadow-lg border border-zinc-700",
                style: {
                    left: tooltip.x + 10,
                    top: tooltip.y + 10
                },
                children: tooltip.text
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 647,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
        lineNumber: 594,
        columnNumber: 5
    }, this);
}
_s(TrackMapWithBoundaries, "w2f/5oDMgensTqvvhD9Y8wJV6yU=");
_c = TrackMapWithBoundaries;
var _c;
__turbopack_context__.k.register(_c, "TrackMapWithBoundaries");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=Desktop_lap-lens_web_app_components_24e2f7ea._.js.map
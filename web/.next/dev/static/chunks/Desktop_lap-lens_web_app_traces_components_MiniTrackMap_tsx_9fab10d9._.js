(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniTrackMap",
    ()=>MiniTrackMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function MiniTrackMap({ lapData, referenceLapData, corners, hoveredDistance }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const fullTelemetryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastDrawnDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { normalizedPoints, bounds } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MiniTrackMap.useMemo": ()=>{
            if (!lapData?.telemetry) return {
                normalizedPoints: [],
                bounds: {
                    minX: 0,
                    maxX: 0,
                    minY: 0,
                    maxY: 0
                }
            };
            const telemetry = lapData.telemetry;
            // Store full telemetry with rotation for hover lookup
            const fullRotated = telemetry.map({
                "MiniTrackMap.useMemo.fullRotated": (p)=>({
                        ...p,
                        x: -p.x,
                        y: -p.y
                    })
            }["MiniTrackMap.useMemo.fullRotated"]);
            fullTelemetryRef.current = fullRotated;
            // Sample every 20 points for much faster rendering (reduces ~5000 points to ~250)
            const sampledTelemetry = telemetry.filter({
                "MiniTrackMap.useMemo.sampledTelemetry": (_, i)=>i % 20 === 0
            }["MiniTrackMap.useMemo.sampledTelemetry"]);
            // Rotate sampled points
            const rotatedPoints = sampledTelemetry.map({
                "MiniTrackMap.useMemo.rotatedPoints": (p)=>({
                        ...p,
                        x: -p.x,
                        y: -p.y
                    })
            }["MiniTrackMap.useMemo.rotatedPoints"]);
            const xs = rotatedPoints.map({
                "MiniTrackMap.useMemo.xs": (p)=>p.x
            }["MiniTrackMap.useMemo.xs"]);
            const ys = rotatedPoints.map({
                "MiniTrackMap.useMemo.ys": (p)=>p.y
            }["MiniTrackMap.useMemo.ys"]);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            return {
                normalizedPoints: rotatedPoints,
                bounds: {
                    minX,
                    maxX,
                    minY,
                    maxY
                }
            };
        }
    }["MiniTrackMap.useMemo"], [
        lapData
    ]);
    const draw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MiniTrackMap.useCallback[draw]": ()=>{
            const canvas = canvasRef.current;
            if (!canvas || normalizedPoints.length === 0) return;
            // Skip redraw if distance hasn't changed
            if (lastDrawnDistance.current === hoveredDistance && hoveredDistance !== null) {
                return;
            }
            lastDrawnDistance.current = hoveredDistance;
            const ctx = canvas.getContext("2d", {
                alpha: false,
                desynchronized: true // Better performance
            });
            if (!ctx) return;
            const width = canvas.width;
            const height = canvas.height;
            // Clear canvas
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, width, height);
            const padding = 30;
            const drawWidth = width - padding * 2;
            const drawHeight = height - padding * 2;
            const { minX, maxX, minY, maxY } = bounds;
            const rangeX = maxX - minX;
            const rangeY = maxY - minY;
            // Scale to fit canvas (maintain aspect ratio)
            const scaleX = drawWidth / rangeX;
            const scaleY = drawHeight / rangeY;
            const scale = Math.min(scaleX, scaleY);
            // Center the track
            const offsetX = padding + (drawWidth - rangeX * scale) / 2;
            const offsetY = padding + (drawHeight - rangeY * scale) / 2;
            const toCanvasX = {
                "MiniTrackMap.useCallback[draw].toCanvasX": (x)=>offsetX + (x - minX) * scale
            }["MiniTrackMap.useCallback[draw].toCanvasX"];
            const toCanvasY = {
                "MiniTrackMap.useCallback[draw].toCanvasY": (y)=>height - (offsetY + (y - minY) * scale)
            }["MiniTrackMap.useCallback[draw].toCanvasY"];
            // Draw racing line (current lap only) - simplified rendering
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            for(let i = 0; i < normalizedPoints.length; i++){
                const point = normalizedPoints[i];
                const x = toCanvasX(point.x);
                const y = toCanvasY(point.y);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            // Draw corner markers
            if (corners && corners.length > 0) {
                corners.forEach({
                    "MiniTrackMap.useCallback[draw]": (corner)=>{
                        if (!corner || corner.apexDistance === undefined || corner.cornerNumber === undefined) return;
                        const apexPoint = normalizedPoints.find({
                            "MiniTrackMap.useCallback[draw].apexPoint": (p)=>Math.abs(p.distance - corner.apexDistance) < 5
                        }["MiniTrackMap.useCallback[draw].apexPoint"]);
                        if (apexPoint) {
                            const x = toCanvasX(apexPoint.x);
                            const y = toCanvasY(apexPoint.y);
                            // Corner dot
                            ctx.fillStyle = "#ef4444";
                            ctx.beginPath();
                            ctx.arc(x, y, 4, 0, Math.PI * 2);
                            ctx.fill();
                            // Corner number
                            ctx.fillStyle = "#fff";
                            ctx.font = "10px monospace";
                            ctx.textAlign = "center";
                            ctx.fillText(String(corner.cornerNumber), x, y - 8);
                        }
                    }
                }["MiniTrackMap.useCallback[draw]"]);
            }
            // Draw start/finish line
            const startPoint = normalizedPoints[0];
            if (startPoint) {
                const x = toCanvasX(startPoint.x);
                const y = toCanvasY(startPoint.y);
                ctx.strokeStyle = "#22c55e";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x - 6, y - 6);
                ctx.lineTo(x + 6, y + 6);
                ctx.moveTo(x - 6, y + 6);
                ctx.lineTo(x + 6, y - 6);
                ctx.stroke();
            }
            // Draw hovered position marker (use full telemetry for accuracy)
            if (hoveredDistance !== null && hoveredDistance !== undefined && fullTelemetryRef.current.length > 0) {
                // Fast lookup - since distance is sequential, we can estimate the index
                const maxDist = fullTelemetryRef.current[fullTelemetryRef.current.length - 1].distance;
                const estimatedIndex = Math.floor(hoveredDistance / maxDist * fullTelemetryRef.current.length);
                let closestPoint = null;
                let minDiff = Infinity;
                // Search around estimated position (much faster than full search)
                const searchRange = 100;
                const start = Math.max(0, estimatedIndex - searchRange);
                const end = Math.min(fullTelemetryRef.current.length, estimatedIndex + searchRange);
                for(let i = start; i < end; i++){
                    const p = fullTelemetryRef.current[i];
                    const diff = Math.abs(p.distance - hoveredDistance);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestPoint = p;
                    }
                }
                if (closestPoint) {
                    const x = toCanvasX(closestPoint.x);
                    const y = toCanvasY(closestPoint.y);
                    // Simple circle marker
                    ctx.fillStyle = "#3b82f6";
                    ctx.beginPath();
                    ctx.arc(x, y, 7, 0, Math.PI * 2);
                    ctx.fill();
                    // Outer glow
                    ctx.strokeStyle = "#60a5fa";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    // Distance label
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 10px monospace";
                    ctx.textAlign = "center";
                    ctx.fillText(`${Math.round(hoveredDistance)}m`, x, y - 13);
                }
            }
        }
    }["MiniTrackMap.useCallback[draw]"], [
        normalizedPoints,
        bounds,
        corners,
        referenceLapData,
        hoveredDistance
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MiniTrackMap.useEffect": ()=>{
            // Cancel any pending animation frame
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // Schedule the draw on next animation frame
            animationFrameRef.current = requestAnimationFrame(draw);
            return ({
                "MiniTrackMap.useEffect": ()=>{
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                }
            })["MiniTrackMap.useEffect"];
        }
    }["MiniTrackMap.useEffect"], [
        draw
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-black border border-zinc-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-zinc-800 px-4 py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xs font-semibold text-white uppercase tracking-wider",
                    children: "Track Map"
                }, void 0, false, {
                    fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        width: 400,
                        height: 400,
                        className: "w-full h-auto"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex items-center justify-between text-[10px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-0.5 bg-yellow-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: [
                                            "Lap ",
                                            lapData?.metadata?.lapNumber || "?"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                                        lineNumber: 236,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-red-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                                        lineNumber: 239,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: "Corners"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
_s(MiniTrackMap, "G+ox9XBf4ew1zso+ewl5tBklN44=");
_c = MiniTrackMap;
var _c;
__turbopack_context__.k.register(_c, "MiniTrackMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/lap-lens/web/app/traces/components/MiniTrackMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=Desktop_lap-lens_web_app_traces_components_MiniTrackMap_tsx_9fab10d9._.js.map
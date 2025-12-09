module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrackMapWithBoundaries",
    ()=>TrackMapWithBoundaries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function TrackMapWithBoundaries({ lapData, corners = [], currentIndex = 0, trackName = "sakhir-(bahrain)" }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [boundaries, setBoundaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showBoundaries, setShowBoundaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showRacingLine, setShowRacingLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showBrakingZones, setShowBrakingZones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showCornerMarkers, setShowCornerMarkers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load boundaries
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch(`/api/boundaries/${trackName}`).then((res)=>res.json()).then((data)=>{
            if (data.error) {
                console.warn('Boundaries not available:', data.error);
                setBoundaries(null);
            } else {
                setBoundaries(data);
            }
        }).catch((err)=>{
            console.error('Failed to load boundaries:', err);
            setBoundaries(null);
        });
    }, [
        trackName
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!canvasRef.current || !lapData?.telemetry) {
            return;
        }
        const telemetry = lapData.telemetry;
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
        // Get current car position for camera follow
        const currentPoint = telemetry[Math.floor(currentIndex)];
        const centerX = currentPoint ? currentPoint.y : 0;
        const centerY = currentPoint ? -currentPoint.x : 0;
        // Camera zoom level (higher = more zoomed in)
        const zoomScale = 0.9;
        // View range around car (in meters)
        const viewRange = 200;
        const minX = centerX - viewRange;
        const maxX = centerX + viewRange;
        const minY = centerY - viewRange;
        const maxY = centerY + viewRange;
        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        const scale = Math.min(width / rangeX, height / rangeY) * zoomScale;
        const toScreenX = (x, y)=>{
            const rx = y;
            return width / 2 + (rx - centerX) * scale;
        };
        const toScreenY = (x, y)=>{
            const ry = -x;
            return height / 2 + (ry - centerY) * scale;
        };
        // Clear background
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, width, height);
        // Draw track boundaries
        if (boundaries && showBoundaries) {
            // Draw track surface (filled area between boundaries)
            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            // Start at left boundary first point
            const leftStart = boundaries.left[0];
            ctx.moveTo(toScreenX(leftStart.x, leftStart.z), toScreenY(leftStart.x, leftStart.z));
            // Draw to right boundary first point (connect start line)
            const rightStart = boundaries.right[0];
            ctx.lineTo(toScreenX(rightStart.x, rightStart.z), toScreenY(rightStart.x, rightStart.z));
            // Draw along right boundary
            boundaries.right.forEach((p, i)=>{
                if (i === 0) return; // Skip first point (already there)
                const x = toScreenX(p.x, p.z);
                const y = toScreenY(p.x, p.z);
                ctx.lineTo(x, y);
            });
            // Connect to left boundary last point (finish line)
            const leftEnd = boundaries.left[boundaries.left.length - 1];
            ctx.lineTo(toScreenX(leftEnd.x, leftEnd.z), toScreenY(leftEnd.x, leftEnd.z));
            // Draw back along left boundary (reverse)
            for(let i = boundaries.left.length - 2; i >= 0; i--){
                const p = boundaries.left[i];
                const x = toScreenX(p.x, p.z);
                const y = toScreenY(p.x, p.z);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            // Draw boundary lines
            // Left boundary
            ctx.strokeStyle = "rgba(255, 68, 68, 0.6)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            boundaries.left.forEach((p, i)=>{
                const x = toScreenX(p.x, p.z);
                const y = toScreenY(p.x, p.z);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            // Right boundary
            ctx.strokeStyle = "rgba(68, 136, 255, 0.6)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            boundaries.right.forEach((p, i)=>{
                const x = toScreenX(p.x, p.z);
                const y = toScreenY(p.x, p.z);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
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
        // Draw braking zones
        if (showBrakingZones) {
            corners.forEach((corner)=>{
                if (corner.brakingZone) {
                    const bz = corner.brakingZone;
                    const startIdx = telemetry.findIndex((p)=>p.distance >= bz.entryDistance);
                    const endIdx = telemetry.findIndex((p)=>p.distance >= bz.exitDistance);
                    if (startIdx >= 0 && endIdx >= 0) {
                        ctx.strokeStyle = "rgba(255, 60, 60, 0.7)";
                        ctx.lineWidth = 8;
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.beginPath();
                        for(let i = startIdx; i <= endIdx; i++){
                            const p = telemetry[i];
                            const x = toScreenX(p.x, p.y);
                            const y = toScreenY(p.x, p.y);
                            if (i === startIdx) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                }
            });
        }
        // Draw racing line
        if (showRacingLine) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#ffff00";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            telemetry.forEach((p, i)=>{
                const x = toScreenX(p.x, p.y);
                const y = toScreenY(p.x, p.y);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }
        // Draw corner markers
        if (showCornerMarkers) {
            corners.forEach((corner, idx)=>{
                const apexPoint = telemetry.find((p)=>Math.abs(p.distance - corner.apexDistance) < 5);
                if (apexPoint) {
                    const x = toScreenX(apexPoint.x, apexPoint.y);
                    const y = toScreenY(apexPoint.x, apexPoint.y);
                    ctx.fillStyle = "#000";
                    ctx.beginPath();
                    ctx.arc(x, y, 16, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#fff";
                    ctx.beginPath();
                    ctx.arc(x, y, 14, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#000";
                    ctx.font = "bold 11px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(`${idx + 1}`, x, y);
                }
            });
        }
        // Draw current position as a pulsing dot (reuse currentPoint from above)
        if (currentPoint) {
            const cx = toScreenX(currentPoint.x, currentPoint.y);
            const cy = toScreenY(currentPoint.x, currentPoint.y);
            // Outer glow
            ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
            ctx.shadowBlur = 15;
            // Outer ring
            ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(cx, cy, 12, 0, Math.PI * 2);
            ctx.fill();
            // Inner dot
            ctx.shadowBlur = 8;
            ctx.fillStyle = "#00ffff";
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();
            // Center dot
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }, [
        lapData,
        corners,
        currentIndex,
        boundaries,
        showBoundaries,
        showRacingLine,
        showBrakingZones,
        showCornerMarkers
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-white",
                                children: "Track Map"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this),
                            boundaries && boundaries.track ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500 mt-1",
                                children: [
                                    boundaries.track.name,
                                    " | Boundaries: ",
                                    boundaries.processedPointCount.left + boundaries.processedPointCount.right,
                                    " points"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500 mt-1",
                                children: "No boundaries available - racing line only"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowBoundaries(!showBoundaries),
                                className: `px-3 py-1.5 text-sm rounded-md transition-colors ${showBoundaries ? 'bg-zinc-700 text-white' : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800'}`,
                                children: "Boundaries"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowRacingLine(!showRacingLine),
                                className: `px-3 py-1.5 text-sm rounded-md transition-colors ${showRacingLine ? 'bg-zinc-700 text-white' : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800'}`,
                                children: "Racing Line"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowBrakingZones(!showBrakingZones),
                                className: `px-3 py-1.5 text-sm rounded-md transition-colors ${showBrakingZones ? 'bg-zinc-700 text-white' : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800'}`,
                                children: "Braking"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowCornerMarkers(!showCornerMarkers),
                                className: `px-3 py-1.5 text-sm rounded-md transition-colors ${showCornerMarkers ? 'bg-zinc-700 text-white' : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800'}`,
                                children: "Corners"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "w-full rounded-lg cursor-crosshair bg-black",
                style: {
                    height: "1200px"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed z-50 rounded bg-black px-3 py-2 text-sm text-white shadow-lg border border-zinc-700",
                style: {
                    left: tooltip.x + 10,
                    top: tooltip.y + 10
                },
                children: tooltip.text
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
                lineNumber: 375,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReplayScrubber",
    ()=>ReplayScrubber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function ReplayScrubber({ lapData, currentIndex, isPlaying, playbackSpeed, onIndexChange, onPlayPause, onSpeedChange }) {
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying || !lapData?.telemetry) return;
        const animate = (currentTime)=>{
            if (!lastTimeRef.current) {
                lastTimeRef.current = currentTime;
            }
            const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
            if (deltaTime >= 0.016) {
                onIndexChange((prev)=>{
                    if (prev >= lapData.telemetry.length - 1) {
                        return 0;
                    }
                    // Calculate how many points to advance based on real time
                    // Each telemetry point represents ~1 meter, car speed in km/h
                    const currentPoint = lapData.telemetry[Math.floor(prev)];
                    const speed = Math.max(currentPoint?.speed || 100, 30); // km/h, minimum 30 to prevent too slow braking
                    const metersPerSecond = speed * 1000 / 3600; // Convert km/h to m/s
                    const pointsToAdvance = metersPerSecond * deltaTime * playbackSpeed;
                    return Math.min(prev + pointsToAdvance, lapData.telemetry.length - 1);
                });
                lastTimeRef.current = currentTime;
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        return ()=>{
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            lastTimeRef.current = 0;
        };
    }, [
        isPlaying,
        playbackSpeed,
        lapData,
        onIndexChange
    ]);
    if (!lapData?.telemetry) return null;
    const totalPoints = lapData.telemetry.length;
    const currentPoint = lapData.telemetry[Math.floor(currentIndex)];
    const progress = currentIndex / totalPoints * 100;
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(1);
        return `${mins}:${secs.padStart(4, '0')}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-zinc-800 bg-zinc-900/50 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onPlayPause,
                                className: "flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors",
                                children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "6",
                                            y: "4",
                                            width: "4",
                                            height: "16"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                            lineNumber: 90,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "14",
                                            y: "4",
                                            width: "4",
                                            height: "16"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                            lineNumber: 91,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M8 5v14l11-7z"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 95,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-zinc-400",
                                        children: "Speed:"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        0.5,
                                        1,
                                        2,
                                        4
                                    ].map((speed)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onSpeedChange(speed),
                                            className: `rounded px-2 py-1 text-sm transition-colors ${playbackSpeed === speed ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`,
                                            children: [
                                                speed,
                                                "x"
                                            ]
                                        }, speed, true, {
                                            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-6 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: "Distance: "
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-white",
                                        children: [
                                            Math.round(currentPoint?.distance || 0),
                                            "m"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: "Speed: "
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-white",
                                        children: [
                                            Math.round(currentPoint?.speed || 0),
                                            " km/h"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: "Time: "
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-white",
                                        children: formatTime(currentPoint?.time || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-400",
                                        children: "Gear: "
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-white",
                                        children: currentPoint?.gear || 0
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative pt-2 pb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "range",
                    min: "0",
                    max: totalPoints - 1,
                    value: currentIndex,
                    onChange: (e)=>onIndexChange(Number(e.target.value)),
                    className: "w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-cyan-500/50",
                    style: {
                        background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${progress}%, rgb(39 39 42) ${progress}%, rgb(39 39 42) 100%)`
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex justify-between text-xs text-zinc-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "0m"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            Math.round(lapData.telemetry[totalPoints - 1]?.distance || 0),
                            "m"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LapAnalysisPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$app$2f$components$2f$TrackMapWithBoundaries$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/app/components/TrackMapWithBoundaries.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$app$2f$lap$2d$analysis$2f$components$2f$ReplayScrubber$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lap-lens/web/app/lap-analysis/components/ReplayScrubber.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function LapAnalysisPage() {
    const [availableLaps, setAvailableLaps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedLap, setSelectedLap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lapData, setLapData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [corners, setCorners] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [playbackSpeed, setPlaybackSpeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch("/api/laps").then((res)=>res.json()).then((data)=>{
            console.log("Laps loaded:", data);
            setAvailableLaps(data.laps);
            if (data.laps.length > 0) {
                setSelectedLap(data.laps[0].lapNumber);
            }
            setLoading(false);
        }).catch((err)=>{
            console.error("Failed to load laps:", err);
            setLoading(false);
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedLap === null) return;
        fetch(`/api/laps/${selectedLap}`).then((res)=>res.json()).then((data)=>{
            console.log("Lap data loaded:", data);
            setLapData(data);
        }).catch((err)=>console.error("Failed to load lap:", err));
    }, [
        selectedLap
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!lapData?.metadata?.trackName) return;
        const trackName = lapData.metadata.trackName;
        const match = trackName.match(/\(([^)]+)\)/);
        const simpleName = match ? match[1].toLowerCase() : trackName.toLowerCase();
        console.log("Loading corners for:", simpleName);
        fetch(`/api/corners/${simpleName}`).then((res)=>res.json()).then((data)=>{
            console.log("Corners loaded:", data);
            setCorners(data.corners || []);
        }).catch((err)=>console.error("Failed to load corners:", err));
    }, [
        lapData
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center bg-zinc-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-4xl",
                        children: "⏱️"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xl text-zinc-400",
                        children: "Loading telemetry data..."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    if (availableLaps.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center bg-zinc-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-4xl",
                        children: "🏎️"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 text-2xl text-white",
                        children: "No Laps Recorded"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400",
                        children: "Start the UDP listener and drive some laps in F1 2024"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-white",
                                        children: "2D Lap Analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-zinc-400",
                                        children: [
                                            lapData?.metadata?.trackName || "Loading...",
                                            lapData?.metadata?.carName && ` • ${lapData.metadata.carName}`
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm font-medium text-zinc-400",
                                        children: "Lap"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedLap || "",
                                        onChange: (e)=>setSelectedLap(Number(e.target.value)),
                                        className: "rounded-lg bg-zinc-800 px-3 py-2 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none",
                                        children: availableLaps.map((lap)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: lap.lapNumber,
                                                children: [
                                                    "Lap ",
                                                    lap.lapNumber,
                                                    " (",
                                                    lap.lapTime,
                                                    ")"
                                                ]
                                            }, lap.lapNumber, true, {
                                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                                lineNumber: 112,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto px-6 py-6 max-w-[1800px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$app$2f$components$2f$TrackMapWithBoundaries$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TrackMapWithBoundaries"], {
                            lapData: lapData,
                            corners: corners,
                            currentIndex: currentIndex,
                            trackName: "sakhir-(bahrain)"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lap$2d$lens$2f$web$2f$app$2f$lap$2d$analysis$2f$components$2f$ReplayScrubber$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReplayScrubber"], {
                            lapData: lapData,
                            currentIndex: currentIndex,
                            isPlaying: isPlaying,
                            playbackSpeed: playbackSpeed,
                            onIndexChange: setCurrentIndex,
                            onPlayPause: ()=>setIsPlaying(!isPlaying),
                            onSpeedChange: setPlaybackSpeed
                        }, void 0, false, {
                            fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lap-lens/web/app/lap-analysis/page.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Desktop/lap-lens/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__de6c0b48._.js.map
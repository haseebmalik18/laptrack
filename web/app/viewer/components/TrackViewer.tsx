"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import * as THREE from "three";

interface TrackViewerProps {
  lapsData: any[];
  currentLapIndex: number;
  playbackIndex: number;
  smoothPlaybackRef?: React.MutableRefObject<number>;
  isPlaying?: boolean;
  playbackSpeed?: number;
}

interface CornerData {
  corners: any[];
  trackName: string;
}

function Kerb({ position, rotation, length }: { position: [number, number, number]; rotation: number; length: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 2;
    shape.moveTo(-length / 2, -width / 2);
    shape.lineTo(length / 2, -width / 2);
    shape.lineTo(length / 2, width / 2);
    shape.lineTo(-length / 2, width / 2);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false });
  }, [length]);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const stripeWidth = 32;
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#ff0000' : '#ffffff';
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, 64);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.x = length / 10;
    return tex;
  }, [length]);

  return (
    <mesh geometry={geometry} position={position} rotation={[0, rotation, 0]}>
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function BrakingZone({ startPoint, endPoint }: { startPoint: any; endPoint: any }) {
  const points = useMemo(() => [
    new THREE.Vector3(startPoint.x, 0.1, startPoint.y),
    new THREE.Vector3(endPoint.x, 0.1, endPoint.y)
  ], [startPoint, endPoint]);

  return (
    <Line
      points={points}
      color="#ff4444"
      lineWidth={8}
    />
  );
}

function CornerMarker({ point, cornerNumber, type }: { point: any; cornerNumber: number; type: string }) {
  const colorMap: Record<string, string> = {
    hairpin: '#ff0000',
    slow: '#ff9900',
    medium: '#ffff00',
    fast: '#00ff00',
    'very-fast': '#00ffff'
  };

  return (
    <group position={[point.x, 2, point.y]}>
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color={colorMap[type] || '#ffffff'} emissive={colorMap[type] || '#ffffff'} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 8, 0]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {cornerNumber}
      </Text>
    </group>
  );
}

function Track({ points, cornerData }: { points: any[]; cornerData?: CornerData }) {
  const ROAD_WIDTH = 15;
  const KERB_WIDTH = 2.5;

  const trackPoints = useMemo(() => {
    return points.map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [points]);

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(trackPoints);
    c.closed = true;
    return c;
  }, [trackPoints]);

  const roadGeometry = useMemo(() => {
    const segments = points.length * 3;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];
    const normals: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);

      const perpendicular = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const left = point.clone().add(perpendicular.clone().multiplyScalar(ROAD_WIDTH / 2));
      const right = point.clone().add(perpendicular.clone().multiplyScalar(-ROAD_WIDTH / 2));

      vertices.push(left.x, left.y, left.z);
      vertices.push(right.x, right.y, right.z);

      uvs.push(0, t * 10);
      uvs.push(1, t * 10);

      normals.push(0, 1, 0);
      normals.push(0, 1, 0);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    return geometry;
  }, [curve, points.length]);

  const asphaltTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const brightness = Math.random() * 30 + 10;
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.fillRect(x, y, Math.random() * 2, Math.random() * 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 50);
    return tex;
  }, []);

  const roadEdgeGeometry = useMemo(() => {
    const segments = points.length * 3;
    const leftEdge: THREE.Vector3[] = [];
    const rightEdge: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);

      const perpendicular = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      leftEdge.push(point.clone().add(perpendicular.clone().multiplyScalar(ROAD_WIDTH / 2)));
      rightEdge.push(point.clone().add(perpendicular.clone().multiplyScalar(-ROAD_WIDTH / 2)));
    }

    return { leftEdge, rightEdge };
  }, [curve, points.length]);

  const getPointAtDistance = (distance: number) => {
    return points.find(p => Math.abs(p.distance - distance) < 0.5) || points[0];
  };

  const kerbGeometry = useMemo(() => {
    const segments = points.length * 4;
    const leftKerbVerts: number[] = [];
    const rightKerbVerts: number[] = [];
    const leftKerbIndices: number[] = [];
    const rightKerbIndices: number[] = [];
    const leftKerbUVs: number[] = [];
    const rightKerbUVs: number[] = [];
    const normals: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) % 1;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const perpendicular = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const leftInner = point.clone().add(perpendicular.clone().multiplyScalar(ROAD_WIDTH / 2));
      const leftOuter = point.clone().add(perpendicular.clone().multiplyScalar(ROAD_WIDTH / 2 + KERB_WIDTH));

      const rightInner = point.clone().add(perpendicular.clone().multiplyScalar(-ROAD_WIDTH / 2));
      const rightOuter = point.clone().add(perpendicular.clone().multiplyScalar(-ROAD_WIDTH / 2 - KERB_WIDTH));

      leftKerbVerts.push(
        leftInner.x, 0.2, leftInner.z,
        leftOuter.x, 0.2, leftOuter.z
      );

      rightKerbVerts.push(
        rightInner.x, 0.2, rightInner.z,
        rightOuter.x, 0.2, rightOuter.z
      );

      leftKerbUVs.push(0, t * 30, 1, t * 30);
      rightKerbUVs.push(0, t * 30, 1, t * 30);

      if (i < segments) {
        const base = i * 2;
        leftKerbIndices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
        rightKerbIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }

    const leftGeom = new THREE.BufferGeometry();
    leftGeom.setAttribute('position', new THREE.Float32BufferAttribute(leftKerbVerts, 3));
    leftGeom.setAttribute('uv', new THREE.Float32BufferAttribute(leftKerbUVs, 2));
    leftGeom.setIndex(leftKerbIndices);
    leftGeom.computeVertexNormals();

    const rightGeom = new THREE.BufferGeometry();
    rightGeom.setAttribute('position', new THREE.Float32BufferAttribute(rightKerbVerts, 3));
    rightGeom.setAttribute('uv', new THREE.Float32BufferAttribute(rightKerbUVs, 2));
    rightGeom.setIndex(rightKerbIndices);
    rightGeom.computeVertexNormals();

    return { leftGeom, rightGeom };
  }, [curve, points.length]);

  const kerbTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const stripeHeight = 32;
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#ff0000' : '#ffffff';
      ctx.fillRect(0, i * stripeHeight, 64, stripeHeight);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <>
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial
          map={asphaltTexture}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      <mesh geometry={kerbGeometry.leftGeom}>
        <meshStandardMaterial map={kerbTexture} />
      </mesh>

      <mesh geometry={kerbGeometry.rightGeom}>
        <meshStandardMaterial map={kerbTexture} />
      </mesh>

      <Line points={roadEdgeGeometry.leftEdge} color="#ffffff" lineWidth={2} position={[0, 0.1, 0]} />
      <Line points={roadEdgeGeometry.rightEdge} color="#ffffff" lineWidth={2} position={[0, 0.1, 0]} />

      <Line
        points={trackPoints.map(p => new THREE.Vector3(p.x, 0.15, p.z))}
        color="#ffff00"
        lineWidth={1}
      />

      <mesh position={[points[0].x, 0.2, points[0].y]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROAD_WIDTH, 40]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>

      {cornerData?.corners.map((corner) => {
        const apexPoint = getPointAtDistance(corner.apexDistance);

        return (
          <group key={corner.number}>
            <CornerMarker
              point={apexPoint}
              cornerNumber={corner.number}
              type={corner.type}
            />

            {corner.brakingZone && (
              <BrakingZone
                startPoint={getPointAtDistance(corner.brakingZone.entryDistance)}
                endPoint={getPointAtDistance(corner.brakingZone.exitDistance)}
              />
            )}
          </group>
        );
      })}
    </>
  );
}

function Car({ lapData, isActive, smoothPlaybackRef, isPlaying, playbackSpeed, color, cameraTargetRef }: {
  lapData: any;
  isActive: boolean;
  smoothPlaybackRef?: React.MutableRefObject<number>;
  isPlaying?: boolean;
  playbackSpeed?: number;
  color: string;
  cameraTargetRef?: React.MutableRefObject<{ x: number; z: number }>;
}) {
  const carRef = useRef<THREE.Group>(null);
  const localPlayback = useRef(0);
  const smoothRotation = useRef(0);
  const lastPos = useRef({ x: 0, z: 0 });

  useFrame((state, delta) => {
    if (!carRef.current || !isActive || !lapData.points) return;

    const maxIndex = lapData.points.length - 1;

    if (isPlaying && playbackSpeed) {
      const speed = playbackSpeed * 60;
      localPlayback.current += delta * speed;

      if (localPlayback.current > maxIndex) {
        localPlayback.current = maxIndex;
      }

      if (smoothPlaybackRef) {
        smoothPlaybackRef.current = Math.floor(localPlayback.current);
      }
    } else if (smoothPlaybackRef) {
      localPlayback.current = smoothPlaybackRef.current;
    }

    const index = Math.floor(localPlayback.current);
    const fraction = localPlayback.current - index;

    const point = lapData.points[index];
    const nextPoint = lapData.points[Math.min(index + 1, lapData.points.length - 1)];

    if (!point) return;

    const x = point.x + (nextPoint.x - point.x) * fraction;
    const z = point.y + (nextPoint.y - point.y) * fraction;

    carRef.current.position.set(x, 1, z);

    if (cameraTargetRef) {
      cameraTargetRef.current.x = x;
      cameraTargetRef.current.z = z;
    }

    const dx = x - lastPos.current.x;
    const dz = z - lastPos.current.z;
    const movementMag = Math.sqrt(dx * dx + dz * dz);

    if (movementMag > 0.1) {
      const targetRotation = Math.atan2(dx, dz);

      let diff = targetRotation - smoothRotation.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      const rotSpeed = Math.min(movementMag * 0.5, 0.5);
      smoothRotation.current += diff * rotSpeed;
    }

    carRef.current.rotation.y = smoothRotation.current;
    lastPos.current.x = x;
    lastPos.current.z = z;
  });

  if (!isActive) return null;

  return (
    <group ref={carRef}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3.5, 1.2, 8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.8, -2]} castShadow>
        <boxGeometry args={[2.5, 0.6, 2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[0, 1.2, 2.5]} castShadow>
        <boxGeometry args={[4, 0.3, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.3, -4]} castShadow>
        <boxGeometry args={[5, 0.2, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[-1.5, 0, 2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 0, 2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
      <mesh position={[-1.5, 0, -2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 0, -2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>

      <mesh position={[0, 1.5, 3]}>
        <boxGeometry args={[0.3, 0.5, 0.3]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Scene({ lapsData, currentLapIndex, playbackIndex, smoothPlaybackRef, isPlaying, playbackSpeed }: TrackViewerProps) {
  const [cornerData, setCornerData] = useState<CornerData | undefined>();
  const cameraTargetRef = useRef({ x: 0, z: 0 });

  useEffect(() => {
    fetch('/api/corners/bahrain')
      .then(res => res.json())
      .then(data => setCornerData(data))
      .catch(err => console.error('Failed to load corner data:', err));
  }, []);

  useEffect(() => {
    if (smoothPlaybackRef) {
      smoothPlaybackRef.current = playbackIndex;
    }
  }, [playbackIndex, smoothPlaybackRef]);

  if (!lapsData || lapsData.length === 0) return null;

  const currentLap = lapsData[currentLapIndex];
  if (!currentLap || !currentLap.points) return null;

  const colors = ["#4a9eff", "#ff9944", "#00ff88", "#ff4444"];

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[200, 300, 200]} intensity={1.2} castShadow />
      <directionalLight position={[-200, 150, -200]} intensity={0.5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>

      <Track points={lapsData[0].points} cornerData={cornerData} />

      {lapsData.map((lap, index) => (
        <Car
          key={index}
          lapData={lap}
          isActive={index === currentLapIndex}
          smoothPlaybackRef={smoothPlaybackRef}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          color={colors[index % colors.length]}
          cameraTargetRef={index === currentLapIndex ? cameraTargetRef : undefined}
        />
      ))}

      <OrbitControls
        target={[cameraTargetRef.current.x, 0, cameraTargetRef.current.z]}
        enableDamping
        dampingFactor={0.15}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={50}
        maxDistance={1000}
      />
    </>
  );
}

export function TrackViewer(props: TrackViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 400, 600], fov: 60, near: 1, far: 5000 }}
      shadows
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 1000, 3000]} />
      <Scene {...props} />
    </Canvas>
  );
}

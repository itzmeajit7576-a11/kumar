import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShieldThreatState } from "../types/security";

interface CyberShield3DProps {
  threatState?: ShieldThreatState;
  isScanning?: boolean;
  heightClass?: string;
  interactive?: boolean;
}

const THREAT_PALETTES: Record<
  ShieldThreatState,
  {
    primary: number;
    secondary: number;
    core: number;
    speedMultiplier: number;
    label: string;
    cssHex: string;
  }
> = {
  SAFE: {
    primary: 0x06b6d4, // Cyan
    secondary: 0x10b981, // Emerald
    core: 0x38bdf8, // Sky blue
    speedMultiplier: 1.0,
    label: "SHIELD INTEGRITY: NOMINAL",
    cssHex: "#06B6D4",
  },
  WARNING: {
    primary: 0xf59e0b, // Amber
    secondary: 0x38bdf8, // Electric blue
    core: 0xfbbf24, // Gold
    speedMultiplier: 1.75,
    label: "ELEVATED HEURISTIC SCAN",
    cssHex: "#F59E0B",
  },
  CRITICAL: {
    primary: 0xef4444, // Crimson
    secondary: 0xf97316, // Orange-Red
    core: 0xf43f5e, // Rose
    speedMultiplier: 2.6,
    label: "ACTIVE THREAT CONTAINMENT",
    cssHex: "#EF4444",
  },
};

export const CyberShield3D: React.FC<CyberShield3DProps> = ({
  threatState = "SAFE",
  isScanning = false,
  heightClass = "h-[380px]",
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);
  const threatStateRef = useRef<ShieldThreatState>(threatState);
  const isScanningRef = useRef<boolean>(isScanning);

  useEffect(() => {
    threatStateRef.current = threatState;
  }, [threatState]);

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    const onContextRestored = () => {
      setWebglFallback(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.2);

    // Three-point studio + cyber rim lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 4.0, 15);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0x06b6d4, 3.5, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Main Root Group for mouse parallax
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Custom 3D Cyber Shield Crest Geometry (Extruded/Beveled Shield + Geodesic Lattice)
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.55);
    shieldShape.lineTo(1.25, 1.05);
    shieldShape.lineTo(1.1, -0.35);
    shieldShape.quadraticCurveTo(0.85, -1.25, 0, -1.7);
    shieldShape.quadraticCurveTo(-0.85, -1.25, -1.1, -0.35);
    shieldShape.lineTo(-1.25, 1.05);
    shieldShape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 1,
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 3,
    };

    const shieldArmorGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldArmorGeo.center();

    const shieldArmorMat = new THREE.MeshPhysicalMaterial({
      color: 0x091526,
      metalness: 0.82,
      roughness: 0.22,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.84,
    });
    const shieldMesh = new THREE.Mesh(shieldArmorGeo, shieldArmorMat);
    rootGroup.add(shieldMesh);

    // Glowing Shield Wireframe Edges
    const shieldEdgesGeo = new THREE.EdgesGeometry(shieldArmorGeo, 18);
    const shieldEdgesMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.9,
    });
    const shieldEdges = new THREE.LineSegments(shieldEdgesGeo, shieldEdgesMat);
    shieldMesh.add(shieldEdges);

    // 2. Holographic Security Core (Inner Icosahedron + Energy Octahedron)
    const outerCoreGeo = new THREE.IcosahedronGeometry(0.78, 1);
    const outerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    outerCoreMesh.position.z = 0.15;
    rootGroup.add(outerCoreMesh);

    const innerCoreGeo = new THREE.OctahedronGeometry(0.42, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.4,
      metalness: 0.5,
      roughness: 0.1,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    innerCoreMesh.position.z = 0.15;
    rootGroup.add(innerCoreMesh);

    // 3. Concentric Holographic Radar / Scanner Rings
    const ring1Geo = new THREE.TorusGeometry(2.05, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.38, 0.012, 16, 90, Math.PI * 1.45);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    rootGroup.add(ring2);

    // Radar Sweeping Laser Plane
    const scanRingGeo = new THREE.RingGeometry(0.2, 2.15, 48);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const scanPlane = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanPlane.rotation.x = Math.PI / 2;
    rootGroup.add(scanPlane);

    // 4. Orbiting Network Satellite Nodes
    const nodeGroup = new THREE.Group();
    rootGroup.add(nodeGroup);
    const nodeSpheres: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.055, 12, 12);
    for (let i = 0; i < 6; i++) {
      const nodeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0x10b981,
      });
      const sphere = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.15 + (i % 2) * 0.25;
      sphere.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * (radius * 0.65),
        Math.sin(angle * 2) * 0.6
      );
      nodeGroup.add(sphere);
      nodeSpheres.push(sphere);
    }

    // 5. Floating Cyber Particle Field (Lightweight 140 particles)
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax Tracking
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetX = Math.max(-1, Math.min(1, normX)) * 0.45;
      targetY = Math.max(-1, Math.min(1, normY)) * 0.32;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 500;
      const newH = container.clientHeight || 380;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const palette = THREAT_PALETTES[threatStateRef.current];
      const activeSpeed = palette.speedMultiplier * (isScanningRef.current ? 2.1 : 1.0);

      // Update dynamic colors smoothly
      shieldEdgesMat.color.setHex(palette.primary);
      outerCoreMat.color.setHex(palette.primary);
      innerCoreMat.color.setHex(palette.core);
      innerCoreMat.emissive.setHex(palette.primary);
      ring1Mat.color.setHex(palette.primary);
      ring2Mat.color.setHex(palette.secondary);
      scanRingMat.color.setHex(palette.primary);
      particleMat.color.setHex(palette.core);
      rimLight.color.setHex(palette.primary);
      coreLight.color.setHex(palette.core);

      // Shield subtle rotation + mouse follow
      shieldMesh.rotation.y = Math.sin(elapsed * 0.65 * activeSpeed) * 0.38;
      shieldMesh.rotation.x = Math.cos(elapsed * 0.45 * activeSpeed) * 0.12;

      rootGroup.rotation.y += (targetX - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (-targetY - rootGroup.rotation.x) * 0.06;

      // Pulsing holographic security core
      const pulse = 1 + Math.sin(elapsed * 2.5 * activeSpeed) * 0.09;
      innerCoreMesh.scale.set(pulse, pulse, pulse);
      innerCoreMesh.rotation.y += 0.022 * activeSpeed;
      innerCoreMesh.rotation.x += 0.015 * activeSpeed;

      outerCoreMesh.rotation.y -= 0.014 * activeSpeed;
      outerCoreMesh.rotation.z += 0.01 * activeSpeed;

      // Radar rings rotation
      ring1.rotation.z += 0.012 * activeSpeed;
      ring1.rotation.y = Math.sin(elapsed * 0.4) * 0.35;

      ring2.rotation.z -= 0.016 * activeSpeed;
      ring2.rotation.x = Math.cos(elapsed * 0.5) * 0.4;

      // Vertical scanning beam plane
      scanPlane.position.y = Math.sin(elapsed * 1.4 * activeSpeed) * 1.55;
      scanRingMat.opacity = isScanningRef.current ? 0.36 : 0.16;

      // Satellite nodes orbit
      nodeGroup.rotation.z += 0.008 * activeSpeed;
      nodeGroup.rotation.y += 0.006 * activeSpeed;

      // Gentle particle drift
      particles.rotation.y = elapsed * 0.04;
      particles.rotation.x = Math.sin(elapsed * 0.15) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      renderer.dispose();
    };
  }, [interactive]);

  const currentPalette = THREAT_PALETTES[threatState];

  return (
    <div className={`relative w-full ${heightClass} select-none overflow-hidden rounded-2xl`}>
      {/* Ambient Radial Glow matching Threat Level */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentPalette.cssHex}22 0%, transparent 70%)`,
        }}
      />

      {/* WebGL Canvas Container or Fallback */}
      {!webglFallback ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div
            className="w-32 h-32 rounded-full border-2 flex items-center justify-center animate-pulse"
            style={{ borderColor: currentPalette.cssHex }}
          >
            <svg
              className="w-16 h-16"
              style={{ color: currentPalette.cssHex }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <p className="mt-3 text-xs font-mono text-slate-400">{currentPalette.label}</p>
        </div>
      )}

      {/* Subtle Corner HUD Brackets */}
      <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40" />
      <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/40" />
      <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/40" />
      <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40" />

      {/* Bottom Floating HUD Readout */}
      <div className="pointer-events-none absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
        <span className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: currentPalette.cssHex }}
          />
          <span className="text-slate-200 font-medium">{currentPalette.label}</span>
        </span>
        <span className="tabular-nums text-slate-400">
          {isScanning ? "ACTIVE DEEP SCANNING..." : "3D CORE TELEMETRY · 60 FPS"}
        </span>
      </div>
    </div>
  );
};

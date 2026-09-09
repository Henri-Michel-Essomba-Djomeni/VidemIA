"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1600;
const HOLD_DURATION = 4.5;
const TRANSITION_DURATION = 2.5;
const CYCLE_DURATION = HOLD_DURATION + TRANSITION_DURATION;

// Chaque forme a sa couleur signature — le nuage change de couleur à chaque formation.
const COLORS = ["#2ea5ff", "#22d3ee", "#7c5cff", "#34e2b8", "#5b8def", "#c084fc"];

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// --- Générateurs de formations ---

function shapeSphere(i: number, count: number): [number, number, number] {
  const y = 1 - (i / (count - 1)) * 2;
  const radiusAtY = Math.sqrt(1 - y * y);
  const theta = i * 2.399963;
  const r = 1.7;
  return [Math.cos(theta) * radiusAtY * r, y * r, Math.sin(theta) * radiusAtY * r];
}

function shapeTorus(i: number, count: number): [number, number, number] {
  const u = (i / count) * Math.PI * 2 * 9;
  const v = (i / count) * Math.PI * 2;
  const R = 1.5;
  const tube = 0.55;
  return [
    (R + tube * Math.cos(v)) * Math.cos(u),
    tube * Math.sin(v),
    (R + tube * Math.cos(v)) * Math.sin(u),
  ];
}

function shapeAtom(i: number, count: number): [number, number, number] {
  const nucleusCount = Math.floor(count * 0.12);
  if (i < nucleusCount) {
    const p = shapeSphere(i, nucleusCount);
    return [p[0] * 0.22, p[1] * 0.22, p[2] * 0.22];
  }
  const idx = i - nucleusCount;
  const remaining = count - nucleusCount;
  const ring = idx % 3;
  const t = (idx / remaining) * Math.PI * 2 * 6;
  const r = 1.8;
  const tilts = [0, Math.PI / 3, -Math.PI / 3];
  const x = Math.cos(t) * r;
  const y = Math.sin(t) * r * 0.35;
  const z = Math.sin(t) * r * 0.15;
  const tilt = tilts[ring];
  return [x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)];
}

function shapeHelix(i: number, count: number): [number, number, number] {
  const strand = i % 2;
  const t = (i / count) * Math.PI * 8;
  const r = 1.1;
  const y = ((i / count) * 2 - 1) * 2.2;
  const angle = t + strand * Math.PI;
  return [Math.cos(angle) * r, y, Math.sin(angle) * r];
}

function shapeSpiral(i: number, count: number): [number, number, number] {
  const arms = 3;
  const arm = i % arms;
  const t = i / count;
  const angle = t * Math.PI * 6 + (arm * (Math.PI * 2)) / arms;
  const r = t * 2.3;
  const y = Math.sin(t * Math.PI * 2 + arm) * 0.3;
  return [Math.cos(angle) * r, y, Math.sin(angle) * r];
}

function shapeGrid(i: number, count: number): [number, number, number] {
  const side = Math.round(Math.cbrt(count));
  const gap = 2.5 / side;
  const xi = i % side;
  const yi = Math.floor(i / side) % side;
  const zi = Math.floor(i / (side * side)) % side;
  return [(xi - side / 2) * gap, (yi - side / 2) * gap, (zi - side / 2) * gap];
}

const SHAPES = [shapeSphere, shapeTorus, shapeAtom, shapeHelix, shapeSpiral, shapeGrid];

export type ParticleActivity = "idle" | "working" | "celebrating";

function ParticleField({
  interactive,
  activity,
}: {
  interactive: boolean;
  activity: ParticleActivity;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    function handleMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [interactive]);

  const shapeCache = useMemo(() => {
    return SHAPES.map((shapeFn) => {
      const arr = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const [x, y, z] = shapeFn(i, PARTICLE_COUNT);
        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
      }
      return arr;
    });
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    return geo;
  }, []);

  const colorObjects = useMemo(() => COLORS.map((c) => new THREE.Color(c)), []);
  const celebrationColor = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !materialRef.current) return;

    // La vitesse du cycle dépend de l'activité : plus vif pendant la génération.
    const speedMultiplier = activity === "working" ? 2.4 : activity === "celebrating" ? 1.4 : 1;
    const realT = clock.getElapsedTime();
    const t = realT * speedMultiplier;

    const segment = t / CYCLE_DURATION;
    const shapeIndex = Math.floor(segment) % SHAPES.length;
    const nextShapeIndex = (shapeIndex + 1) % SHAPES.length;
    const frac = segment - Math.floor(segment);
    const holdFrac = HOLD_DURATION / CYCLE_DURATION;

    const current = shapeCache[shapeIndex];
    const next = shapeCache[nextShapeIndex];
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    let mixAmount = 0;
    if (frac >= holdFrac) {
      mixAmount = easeInOutCubic((frac - holdFrac) / (1 - holdFrac));
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const wobble = Math.sin(realT * 0.6 + i) * 0.04;
      const x = THREE.MathUtils.lerp(current[i * 3], next[i * 3], mixAmount);
      const y = THREE.MathUtils.lerp(current[i * 3 + 1], next[i * 3 + 1], mixAmount);
      const z = THREE.MathUtils.lerp(current[i * 3 + 2], next[i * 3 + 2], mixAmount);
      posAttr.setXYZ(i, x + wobble, y + wobble, z + wobble);
    }
    posAttr.needsUpdate = true;

    // Couleur : suit la formation en cours, sauf en célébration (flash blanc/doré).
    const baseColor = materialRef.current.color;
    if (activity === "celebrating") {
      baseColor.lerp(celebrationColor, 0.08);
    } else {
      const target = new THREE.Color().lerpColors(colorObjects[shapeIndex], colorObjects[nextShapeIndex], mixAmount);
      baseColor.lerp(target, 0.08);
    }

    // Opacité et taille : pulsent plus fort pendant le travail.
    const baseOpacity = activity === "idle" ? 0.7 : activity === "celebrating" ? 1 : 0.85;
    const pulse = activity === "working" ? Math.sin(realT * 4) * 0.15 : 0;
    materialRef.current.opacity = Math.min(1, baseOpacity + pulse);
    materialRef.current.size = activity === "working" ? 0.036 : 0.032;

    if (groupRef.current) {
      groupRef.current.rotation.y = realT * 0.06;
      if (interactive) {
        groupRef.current.rotation.x += (mouse.current.y * 0.25 - groupRef.current.rotation.x) * 0.03;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={materialRef}
          color={COLORS[0]}
          size={0.032}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export interface ParticleBackgroundProps {
  /** "hero" : net, proche, interactif (landing). "ambient" : discret, en arrière-plan (appli). */
  variant?: "hero" | "ambient";
  /** État du travail en cours, module la vitesse/couleur/intensité. */
  activity?: ParticleActivity;
}

export function ParticleBackground({ variant = "hero", activity = "idle" }: ParticleBackgroundProps) {
  const isAmbient = variant === "ambient";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        filter: isAmbient ? "blur(6px) brightness(0.9)" : "none",
        transform: isAmbient ? "scale(1.02)" : "none",
        transition: "filter 0.6s ease",
      }}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, isAmbient ? 6.5 : 4.2], fov: 50 }}>
        <ParticleField interactive={!isAmbient} activity={activity} />
      </Canvas>
    </div>
  );
}
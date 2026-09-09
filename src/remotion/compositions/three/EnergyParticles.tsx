import { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";

const PARTICLE_COUNT = 1200;

export const EnergyParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const base = useMemo(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const seed = i * 12.9898;
      const theta = ((seed * 43758.5453) % 1) * Math.PI * 2;
      const phi = ((seed * 78.233) % 1) * Math.PI;
      const radius = 1.2 + ((seed * 39.346) % 1) * 0.8;
      arr.push({ theta, phi, radius, speed: 0.3 + ((seed * 17.13) % 1) * 0.5 });
    }
    return arr;
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    base.forEach((p, i) => {
      const wobble = Math.sin(t * p.speed + p.theta) * 0.15;
      const r = p.radius + wobble;
      const theta = p.theta + t * 0.15;
      const phi = p.phi + Math.sin(t * 0.2 + p.phi) * 0.1;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) + Math.sin(t * 0.5 + i) * 0.05;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [base, t]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#2ea5ff"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
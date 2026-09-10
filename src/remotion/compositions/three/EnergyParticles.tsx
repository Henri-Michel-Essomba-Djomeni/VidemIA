import { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SHAPE_BY_THEME, COLOR_BY_THEME } from "./shapes";
import type { Theme } from "../../../lib/pipeline/classifyTheme";

const PARTICLE_COUNT = 1200;

export interface EnergyParticlesProps {
  theme: Theme;
}

export const EnergyParticles: React.FC<EnergyParticlesProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const shapeFn = SHAPE_BY_THEME[theme] ?? SHAPE_BY_THEME.sphere;
  const color = COLOR_BY_THEME[theme] ?? COLOR_BY_THEME.sphere;

  const basePositions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [x, y, z] = shapeFn(i, PARTICLE_COUNT);
      arr.push(x, y, z);
    }
    return arr;
  }, [shapeFn]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const wobble = Math.sin(t * 0.6 + i) * 0.05;
      positions[i * 3] = basePositions[i * 3] + wobble;
      positions[i * 3 + 1] = basePositions[i * 3 + 1] + wobble;
      positions[i * 3 + 2] = basePositions[i * 3 + 2] + wobble;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [basePositions, t]);

  return (
    <group rotation={[0, t * 0.15, 0]}>
      <points geometry={geometry}>
        <pointsMaterial
          color={color}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
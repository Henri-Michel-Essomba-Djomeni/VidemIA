import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EnergyParticles } from "./EnergyParticles";

export const EnergyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const rotationY = t * 0.15;

  return (
    <ThreeCanvas width={width} height={height}>
      <group rotation={[0, rotationY, 0]}>
        <EnergyParticles />
      </group>
    </ThreeCanvas>
  );
};
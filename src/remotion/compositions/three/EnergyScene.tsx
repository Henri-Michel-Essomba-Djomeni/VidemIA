import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import { EnergyParticles } from "./EnergyParticles";
import type { Theme } from "../../../lib/pipeline/classifyTheme";

export interface EnergySceneProps {
  theme: Theme;
}

export const EnergyScene: React.FC<EnergySceneProps> = ({ theme }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height}>
      <EnergyParticles theme={theme} />
    </ThreeCanvas>
  );
};
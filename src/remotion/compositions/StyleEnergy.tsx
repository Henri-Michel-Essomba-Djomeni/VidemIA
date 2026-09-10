import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EnergyScene } from "./three/EnergyScene";
import { Caption } from "../../lib/subtitles/parseSrt";
import type { Theme } from "../../lib/pipeline/classifyTheme";

export interface StyleEnergyProps {
  script: string;
  audioSrc?: string;
  captions: Caption[];
  watermarkText: string;
  showWatermark: boolean;
  theme: Theme;
}

export const StyleEnergy: React.FC<StyleEnergyProps> = ({
  script,
  audioSrc,
  captions,
  watermarkText,
  showWatermark,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const currentCaption = captions.find((c) => currentMs >= c.startMs && currentMs < c.endMs);
  const displayText = currentCaption?.text ?? (captions.length === 0 ? script : "");

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {audioSrc && <Audio src={staticFile(audioSrc.replace(/^\//, ""))} />}

      <EnergyScene theme={theme} />

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 260 }}>
        <p style={{ color: "white", fontSize: 42, fontWeight: 700, textAlign: "center", maxWidth: "80%", fontFamily: "sans-serif" }}>
          {displayText}
        </p>
      </AbsoluteFill>

      {showWatermark && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 32 }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 22, fontFamily: "sans-serif" }}>
            {watermarkText}
          </p>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
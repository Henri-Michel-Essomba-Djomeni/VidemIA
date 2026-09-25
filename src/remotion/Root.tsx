import { Composition, CalculateMetadataFunction } from "remotion";
import { StyleEnergy, StyleEnergyProps } from "./compositions/StyleEnergy";

const calculateMetadata: CalculateMetadataFunction<StyleEnergyProps> = async ({ props }) => {
  const lastCaptionEnd = props.captions?.length
    ? Math.max(...props.captions.map((c) => c.endMs))
    : 30 * 1000;
  const durationInFrames = Math.ceil(((lastCaptionEnd + 500) / 1000) * 30);
  return { durationInFrames };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="style-energy"
      component={StyleEnergy}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={30 * 30}
      defaultProps={{
        script: "Exemple de script pour prévisualiser le style.",
        audioSrc: undefined,
        captions: [],
        watermarkText: "VidemIA AI \u2014 Powered by nOX-00",
        showWatermark: true,
        theme: "sphere",
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};
import { Composition } from "remotion";
import { StyleEnergy } from "./compositions/StyleEnergy";

/**
 * Chaque style visuel de VidemIA = une composition Remotion enregistrée ici.
 * Pour ajouter un nouveau style : créer un composant dans compositions/
 * et l'enregistrer avec <Composition /> ci-dessous.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="style-energy"
        component={StyleEnergy}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          script: "Exemple de script pour prévisualiser le style.",
          watermarkText: "VidemIA AI \u2014 Powered by nOX-00",
          showWatermark: true,
        }}
      />
    </>
  );
};

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export interface StyleEnergyProps {
  script: string;
  watermarkText: string;
  showWatermark: boolean;
}

/**
 * Premier template visuel de VidemIA (format vertical 1080x1920).
 * Reprend l'esprit de la vidéo exemple : figure abstraite lumineuse en mouvement
 * sur fond noir, sous-titres incrustés, watermark en coin bas.
 *
 * Étape suivante : remplacer ce placeholder par de vraies animations
 * (particules/énergie) et brancher les sous-titres synchronisés réels
 * (aujourd'hui un seul texte statique en exemple) + l'audio de la voix off.
 */
export const StyleEnergy: React.FC<StyleEnergyProps> = ({
  script,
  watermarkText,
  showWatermark,
}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 60, [0, 30, 60], [0.85, 1, 0.85]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Placeholder du visuel animé (à remplacer par le vrai motion design) */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 260 * pulse,
            height: 260 * pulse,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(46,165,255,0.9) 0%, rgba(46,165,255,0) 70%)",
          }}
        />
      </AbsoluteFill>

      {/* Sous-titre (placeholder statique, à remplacer par les mots synchronisés) */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 260,
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: 42,
            fontWeight: 700,
            textAlign: "center",
            maxWidth: "80%",
            fontFamily: "sans-serif",
          }}
        >
          {script}
        </p>
      </AbsoluteFill>

      {/* Watermark de branding */}
      {showWatermark && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: 32,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 22,
              fontFamily: "sans-serif",
            }}
          >
            {watermarkText}
          </p>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

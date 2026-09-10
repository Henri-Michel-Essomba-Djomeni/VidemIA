import { ollamaChat } from "../llm/ollamaChat";

export const THEMES = ["sphere", "torus", "atom", "helix", "spiral", "grid"] as const;
export type Theme = (typeof THEMES)[number];

const THEME_DESCRIPTIONS = `
sphere: sujets généraux, vie quotidienne, société, émotions
torus: cycles, processus, systèmes, mécanismes, boucles, économie
atom: science, physique, chimie
helix: biologie, santé, corps humain, ADN
spiral: espace, astronomie, univers
grid: technologie, informatique, numérique`;

/** Classe un sujet dans l'un des thèmes visuels disponibles, en local via Qwen. */
export async function classifyTheme(topic: string): Promise<Theme> {
  const systemPrompt =
    "Tu classes un sujet de vidéo dans exactement un thème visuel parmi cette liste :\n" +
    THEME_DESCRIPTIONS +
    "\nRéponds UNIQUEMENT avec le mot du thème choisi (sphere, torus, atom, helix, spiral ou grid), " +
    "rien d'autre, pas de ponctuation, pas d'explication. /no_think";

  const raw = await ollamaChat([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Sujet : ${topic} /no_think` },
  ]);

  const cleaned = raw.trim().toLowerCase().replace(/[^a-z]/g, "");
  return (THEMES as readonly string[]).includes(cleaned) ? (cleaned as Theme) : "sphere";
}
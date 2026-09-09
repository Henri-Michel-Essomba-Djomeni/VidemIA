import { ollamaChat } from "../llm/ollamaChat";

export async function generateScript(topic: string): Promise<string> {
  const systemPrompt =
    "Tu écris des scripts de voix off pour des vidéos éducatives courtes " +
    "(format TikTok/Reels). Le script doit faire entre 90 et 130 mots — ni plus court, ni plus long. " +
    "Il doit être clair, direct, avec une accroche dès la première phrase, " +
    "une explication simple et concrète (avec une image ou un exemple si possible), " +
    "et une chute courte. " +
    "Réponds uniquement avec le texte à lire à voix haute, sans titre, " +
    "sans balises, sans notes de mise en scène. /no_think";

  return ollamaChat([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Sujet de la vidéo : ${topic} /no_think` },
  ]);
}
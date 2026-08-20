/**
 * Génère un script narratif structuré à partir d'un sujet.
 * À brancher sur une API LLM (ex: Anthropic API).
 */
export async function generateScript(topic: string): Promise<string> {
  // TODO: appeler le LLM avec un prompt qui structure intro / développement / conclusion
  return `[Script à générer pour le sujet : "${topic}"]`;
}

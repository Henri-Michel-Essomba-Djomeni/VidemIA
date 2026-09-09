const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3:4b";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function stripThinking(text: string): string {
  const closingTag = "</think>";
  const idx = text.lastIndexOf(closingTag);
  return idx !== -1 ? text.slice(idx + closingTag.length).trim() : text.trim();
}

/** Appelle Ollama (qwen3:4b, local, sans clé API) en streaming, renvoie le texte final nettoyé. */
export async function ollamaChat(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: OLLAMA_MODEL, stream: true, think: false, messages }),
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `Ollama a répondu avec une erreur (${response.status}). ` +
      `Vérifie qu'Ollama tourne bien et que le modèle ${OLLAMA_MODEL} est installé.`
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const chunk = JSON.parse(line);
      if (chunk.message?.content) fullText += chunk.message.content;
    }
  }

  return stripThinking(fullText);
}
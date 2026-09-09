import { NextRequest, NextResponse } from "next/server";
import { ollamaChat, ChatMessage } from "@/lib/llm/ollamaChat";

const SYSTEM_PROMPT = `Tu es nOX-00, l'assistant intégré à l'application VidemIA. Tu réponds en français, de façon brève et claire.

VidemIA : génère automatiquement des vidéos éducatives courtes (format vertical, style TikTok/Reels) à partir d'un sujet donné par l'utilisateur. Parcours : 1) l'utilisateur décrit un sujet, 2) VidemIA génère un script modifiable, 3) VidemIA génère la voix off, les sous-titres et le rendu vidéo final.

Kalima : l'application sœur de VidemIA, dans le même groupe nOX-00. Kalima traduit et double automatiquement des vidéos dans une autre langue (transcription, traduction, clonage vocal). C'est un projet distinct de VidemIA.

Si l'utilisateur te donne un sujet de vidéo et veut clairement que tu lances la génération maintenant, termine ta réponse par exactement une ligne, sans rien après :
[ACTION:GENERATE_VIDEO:<sujet reformulé en une phrase claire>]
N'ajoute cette ligne que si l'intention de générer est claire. /no_think`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Message requis." }, { status: 400 });
  }

  const chatMessages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];
  const reply = await ollamaChat(chatMessages);
  return NextResponse.json({ reply });
}
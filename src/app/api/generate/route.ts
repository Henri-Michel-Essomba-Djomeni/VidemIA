import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/pipeline/generateScript";
import { generateVoice } from "@/lib/pipeline/generateVoice";
import { generateSubtitles } from "@/lib/pipeline/generateSubtitles";
import { renderVideo } from "@/lib/pipeline/renderVideo";

/**
 * Orchestre le pipeline complet :
 * sujet -> script -> voix off -> sous-titres synchronisés -> rendu vidéo
 *
 * Étape suivante du projet : brancher chaque fonction du pipeline
 * (aujourd'hui des stubs) sur les vraies API (LLM, TTS, transcription, Remotion).
 */
export async function POST(req: NextRequest) {
  const { topic, style } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "Le sujet est requis." }, { status: 400 });
  }

  const script = await generateScript(topic);
  const voice = await generateVoice(script);
  const subtitles = await generateSubtitles(voice);
  const video = await renderVideo({ script, voice, subtitles, style });

  return NextResponse.json({ video });
}

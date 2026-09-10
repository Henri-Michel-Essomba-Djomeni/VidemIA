import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/pipeline/generateScript";
import { classifyTheme } from "@/lib/pipeline/classifyTheme";

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "Le sujet est requis." }, { status: 400 });
  }

  // Séquentiel plutôt qu'en parallèle : évite de solliciter Ollama deux fois
  // en même temps sur une machine qui a déjà du mal avec une seule génération.
  const script = await generateScript(topic);
  const theme = await classifyTheme(topic);

  return NextResponse.json({ script, theme });
}
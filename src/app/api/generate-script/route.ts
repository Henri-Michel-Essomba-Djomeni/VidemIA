import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/pipeline/generateScript";

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "Le sujet est requis." }, { status: 400 });
  }

  const script = await generateScript(topic);
  return NextResponse.json({ script });
}
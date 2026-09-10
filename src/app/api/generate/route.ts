import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateVoice } from "@/lib/pipeline/generateVoice";
import { generateSubtitles } from "@/lib/pipeline/generateSubtitles";
import { renderVideo } from "@/lib/pipeline/renderVideo";

function sseEvent(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(sseEvent({ error: "Tu dois être connecté pour générer une vidéo." }), {
      status: 401,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.credits <= 0) {
    return new Response(sseEvent({ error: "NO_CREDITS" }), {
      status: 402,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const { script, style, theme } = await req.json();
  if (!script) {
    return new Response(sseEvent({ error: "Le script est requis." }), {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  // Décompté avant le rendu : évite qu'un utilisateur relance plusieurs générations
  // en parallèle pour dépasser son quota pendant qu'une génération est en cours.
  await prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) => controller.enqueue(encoder.encode(sseEvent(data)));

      try {
        send({ step: "voice", percent: 0 });
        const voice = await generateVoice(script);
        send({ step: "voice", percent: 100 });

        send({ step: "subtitles", percent: 0 });
        const subtitles = await generateSubtitles(voice);
        send({ step: "subtitles", percent: 100 });

        send({ step: "render", percent: 0 });
        const video = await renderVideo({ script, voice, subtitles, style, theme }, (percent) => {
          send({ step: "render", percent });
        });

        send({ done: true, videoUrl: video.videoUrl });
      } catch (err) {
        // En cas d'échec du pipeline, on rembourse le crédit — l'utilisateur
        // ne doit pas payer pour une génération qui a planté.
        await prisma.user.update({ where: { id: user.id }, data: { credits: { increment: 1 } } }).catch(() => {});
        send({ error: err instanceof Error ? err.message : "Erreur inconnue" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
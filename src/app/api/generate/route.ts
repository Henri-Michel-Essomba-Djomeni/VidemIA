import { NextRequest } from "next/server";
import { generateVoice } from "@/lib/pipeline/generateVoice";
import { generateSubtitles } from "@/lib/pipeline/generateSubtitles";
import { renderVideo } from "@/lib/pipeline/renderVideo";

function sseEvent(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const { script, style } = await req.json();

  if (!script) {
    return new Response(sseEvent({ error: "Le script est requis." }), {
      status: 400,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

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
        const video = await renderVideo({ script, voice, subtitles, style }, (percent) => {
          send({ step: "render", percent });
        });

        send({ done: true, videoUrl: video.videoUrl });
      } catch (err) {
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
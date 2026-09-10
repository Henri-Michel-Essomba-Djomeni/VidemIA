import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { VoiceResult } from "./generateVoice";
import { SubtitlesResult } from "./generateSubtitles";
import { parseSrt } from "../subtitles/parseSrt";
import type { Theme } from "./classifyTheme";

export interface RenderVideoParams {
  script: string;
  voice: VoiceResult;
  subtitles: SubtitlesResult;
  style?: string;
  showWatermark?: boolean;
  theme?: Theme;
}

export interface RenderVideoResult {
  videoUrl: string;
}

const OUTPUT_DIR = path.join(process.cwd(), "public", "generated", "video");
const ENTRY_POINT = path.join(process.cwd(), "src", "remotion", "index.ts");

export async function renderVideo(
  params: RenderVideoParams,
  onProgress?: (percent: number) => void
): Promise<RenderVideoResult> {
  const compositionId = params.style ?? "style-energy";
  const bundleLocation = await bundle({ entryPoint: ENTRY_POINT });

  const inputProps = {
    script: params.script,
    audioSrc: params.voice.audioUrl,
    captions: parseSrt(params.subtitles.srt),
    watermarkText: "VidemIA AI \u2014 Powered par nOX-00",
    showWatermark: params.showWatermark ?? true,
    theme: params.theme ?? "sphere",
  };

  const composition = await selectComposition({ serveUrl: bundleLocation, id: compositionId, inputProps });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const fileName = `${randomUUID()}.mp4`;
  const outputLocation = path.join(OUTPUT_DIR, fileName);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
    metadata: {
      title: "VidemIA AI",
      artist: "nOX-00",
      comment: "Powered by nOX-00 — VidemIA AI",
      copyright: "nOX-00",
    },
    onProgress: ({ progress }) => {
      onProgress?.(Math.round(progress * 100));
    },
  });

  return { videoUrl: `/generated/video/${fileName}` };
}
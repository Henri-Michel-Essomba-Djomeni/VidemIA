import { VoiceResult } from "./generateVoice";
import { SubtitleWord } from "./generateSubtitles";

export interface RenderVideoParams {
  script: string;
  voice: VoiceResult;
  subtitles: SubtitleWord[];
  style?: string;
}

export interface RenderVideoResult {
  videoUrl: string;
}

/**
 * Assemble le template visuel choisi + la voix off + les sous-titres,
 * puis lance le rendu final via Remotion (voir src/remotion/).
 */
export async function renderVideo(params: RenderVideoParams): Promise<RenderVideoResult> {
  // TODO: appeler le renderer Remotion (@remotion/renderer) avec la composition
  // correspondant à params.style, en lui passant voice + subtitles en props.
  return { videoUrl: "" };
}

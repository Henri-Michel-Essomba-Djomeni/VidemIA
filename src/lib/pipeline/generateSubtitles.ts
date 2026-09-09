import { VoiceResult } from "./generateVoice";

export interface SubtitlesResult {
  srt: string;
}

/**
 * edge-tts génère déjà les sous-titres synchronisés en même temps que
 * la voix (voir generateVoice.ts) — cette étape les fait juste transiter.
 */
export async function generateSubtitles(voice: VoiceResult): Promise<SubtitlesResult> {
  return { srt: voice.srt };
}
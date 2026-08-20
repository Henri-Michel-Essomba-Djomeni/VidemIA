import { VoiceResult } from "./generateVoice";

export interface SubtitleWord {
  word: string;
  startMs: number;
  endMs: number;
}

/**
 * Transcrit l'audio généré avec horodatage mot-à-mot,
 * pour synchroniser les sous-titres incrustés dans la vidéo.
 * À brancher sur un service de transcription (ex: Whisper).
 */
export async function generateSubtitles(voice: VoiceResult): Promise<SubtitleWord[]> {
  // TODO: transcrire voice.audioUrl et renvoyer les mots horodatés
  return [];
}

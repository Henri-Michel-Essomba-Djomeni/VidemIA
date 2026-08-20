export interface VoiceResult {
  audioUrl: string;
  durationMs: number;
}

/**
 * Transforme le script en voix off naturelle.
 * À brancher sur une API de TTS (ex: ElevenLabs).
 */
export async function generateVoice(script: string): Promise<VoiceResult> {
  // TODO: appeler l'API TTS, stocker le fichier audio, renvoyer son URL + durée
  return { audioUrl: "", durationMs: 0 };
}

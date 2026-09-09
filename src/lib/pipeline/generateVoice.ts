import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const OUTPUT_DIR = path.join(process.cwd(), "public", "generated", "audio");
const DEFAULT_VOICE = process.env.TTS_VOICE || "fr-FR-HenriNeural";
const TIMEOUT_MS = 60_000;

export interface VoiceResult {
  audioUrl: string;
  srt: string;
}

/**
 * Transforme le script en voix off via edge-tts (Python), le même outil
 * déjà éprouvé sur Kalima — appelé en sous-processus, plus fiable que
 * les portages Node qui cassent régulièrement.
 */
export async function generateVoice(script: string): Promise<VoiceResult> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const id = randomUUID();
  const audioPath = path.join(OUTPUT_DIR, `${id}.mp3`);
  const srtPath = path.join(OUTPUT_DIR, `${id}.srt`);

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("edge-tts", [
      "--text", script,
      "--voice", DEFAULT_VOICE,
      "--write-media", audioPath,
      "--write-subtitles", srtPath,
    ]);

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`edge-tts : délai dépassé (${TIMEOUT_MS / 1000}s).`));
    }, TIMEOUT_MS);

    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`edge-tts a échoué (code ${code}) : ${stderr}`));
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(
        `Impossible de lancer edge-tts : ${err.message}. ` +
        `Vérifie qu'il est installé (pip install edge-tts) et dans le PATH.`
      ));
    });
  });

  const srt = await fs.readFile(srtPath, "utf-8");
  return { audioUrl: `/generated/audio/${id}.mp3`, srt };
}
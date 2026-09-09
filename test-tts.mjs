import { EdgeTTS } from "@travisvn/edge-tts";
import { writeFile } from "fs/promises";

console.log("Connexion à edge-tts...");
const start = Date.now();

const tts = new EdgeTTS("Ceci est un test.", "fr-FR-HenriNeural");
const result = await tts.synthesize();

console.log(`Terminé en ${(Date.now() - start) / 1000}s`);
const buffer = Buffer.from(await result.audio.arrayBuffer());
await writeFile("test-audio.mp3", buffer);
console.log("Fichier test-audio.mp3 créé.");
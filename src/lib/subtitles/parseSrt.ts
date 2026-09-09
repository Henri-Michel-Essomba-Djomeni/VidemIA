export interface Caption {
  text: string;
  startMs: number;
  endMs: number;
}

function timeToMs(time: string): number {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return ((h * 60 + m) * 60 + s) * 1000 + Number(ms);
}

/** Parse un contenu SRT en liste de sous-titres avec horodatage en ms. */
export function parseSrt(srt: string): Caption[] {
  const blocks = srt.trim().split(/\r?\n\r?\n/);
  const captions: Caption[] = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const timeLine = lines.find((line) => line.includes("-->"));
    if (!timeLine) continue;

    const [startStr, endStr] = timeLine.split(" --> ").map((s) => s.trim());
    const textLines = lines.slice(lines.indexOf(timeLine) + 1);

    captions.push({
      text: textLines.join(" ").trim(),
      startMs: timeToMs(startStr),
      endMs: timeToMs(endStr),
    });
  }

  return captions;
}
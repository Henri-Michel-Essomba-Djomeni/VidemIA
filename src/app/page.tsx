"use client";

import { useState } from "react";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleGenerate() {
    setStatus("Génération en cours...");
    // TODO: appeler /api/generate une fois le pipeline branché
  }

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>VidemIA</h1>
      <p>Décris le sujet de ta vidéo éducative :</p>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Ex : comment un avion fait pour voler"
        rows={4}
        style={{ width: "100%" }}
      />
      <button onClick={handleGenerate} style={{ marginTop: 16 }}>
        Générer la vidéo
      </button>
      {status && <p>{status}</p>}
    </main>
  );
}

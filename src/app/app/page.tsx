"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ParticleBackground } from "@/components/ParticleBackground";
//import { addHistoryEntry } from "@/lib/history";
import Link from "next/link";

type Stage = "topic" | "reviewing" | "generatingVideo" | "done" | "error";

const STEPS: { key: "topic" | "script" | "video"; label: string }[] = [
  { key: "topic", label: "Sujet" },
  { key: "script", label: "Script" },
  { key: "video", label: "Vidéo" },
];

const PROGRESS_STEPS = [
  { key: "voice", label: "Voix off" },
  { key: "subtitles", label: "Sous-titres" },
  { key: "render", label: "Rendu vidéo" },
] as const;

function stepStatus(stepKey: "topic" | "script" | "video", stage: Stage) {
  const order: Stage[] = ["topic", "reviewing", "generatingVideo", "done"];
  const currentIndex = order.indexOf(stage === "error" ? "reviewing" : stage);
  const stepIndex = { topic: 0, script: 1, video: 2 }[stepKey];
  if (stepIndex < currentIndex) return "is-done";
  if (stepIndex === currentIndex) return "is-active";
  return "";
}

function AppPageContent() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [stage, setStage] = useState<Stage>("topic");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState({ voice: 0, subtitles: 0, render: 0 });
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  useEffect(() => {
    const t = searchParams.get("topic");
    if (t) setTopic(t);
  }, [searchParams]);

  const activity =
    stage === "generatingVideo" || (stage === "reviewing" && script === "Génération du script...")
      ? "working"
      : stage === "done"
      ? "celebrating"
      : "idle";

  async function handleGenerateScript() {
    setStage("reviewing");
    setErrorMessage(null);
    setScript("Génération du script...");
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur serveur (${res.status})`);
      }
      const data = await res.json();
      setScript(data.script);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
      setStage("error");
    }
  }

  async function handleGenerateVideo() {
    setStage("generatingVideo");
    setErrorMessage(null);
    setProgress({ voice: 0, subtitles: 0, render: 0 });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });

      if (!res.body) throw new Error("Pas de flux de réponse.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;
          const payload = JSON.parse(line.slice(5).trim());

          if (payload.error) {
            throw new Error(payload.error);
          }
          if (payload.step) {
            setProgress((prev) => ({ ...prev, [payload.step]: payload.percent }));
          }
          if (payload.done) {
            setVideoUrl(payload.videoUrl);
            fetch("/api/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ topic, videoUrl: payload.videoUrl }),
            }).catch(() => {});
            setStage("done");
          }
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
      setStage("error");
    }
  }

  return (
    <main className="app-shell">
      <ParticleBackground variant="ambient" activity={activity} />
      <Sidebar />

      <div className="topbar">
        <Link href="/" className="logo-mark" style={{ textDecoration: "none" }}>
          <h1 className="logo-text">VidemIA</h1>
        </Link>
        <p className="logo-tagline">Powered by nOX-00</p>
      </div>

      <div className="workspace-card">
        <div className="stepper">
          {STEPS.map((step, i) => (
            <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div className={`stepper-item ${stepStatus(step.key, stage)}`}>
                <span className="stepper-dot" />
                {step.label}
              </div>
              {i < STEPS.length - 1 && <div className="stepper-line" style={{ marginLeft: 10 }} />}
            </div>
          ))}
        </div>
        
        {stage === "topic" && (
          <>
            <p className="workspace-heading">Quelle vidéo veux-tu créer ?</p>
            <textarea
              className="prompt-textarea"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Décris un sujet, une question, un concept à expliquer..."
              rows={4}
            />
            <div className="quick-chips">
              {[
                "Vulgarisation scientifique",
                "Astuce tech en 30s",
                "Actualité expliquée simplement",
                "Tuto rapide",
              ].map((suggestion) => (
                <button key={suggestion} className="chip" onClick={() => setTopic(suggestion + " : ")}>
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="prompt-footer">
              <div className="model-selector" onClick={() => setModelMenuOpen((v) => !v)}>
                <span className="model-selector-dot" />
                VidemIA · Nyx-1
                <span className="model-selector-chevron">▾</span>
                {modelMenuOpen && (
                  <div className="model-dropdown">
                    <div className="model-dropdown-item is-active">
                      <span className="model-selector-dot" />
                      Nyx-1 (actif)
                    </div>
                  </div>
                )}
              </div>
              <button className="button button-primary" onClick={handleGenerateScript} disabled={!topic}>
                Générer le script
              </button>
            </div>
          </>
        )}

        {(stage === "reviewing" || stage === "generatingVideo") && (
          <>
            <p className="workspace-heading">Vérifie ton script</p>
            <textarea className="prompt-textarea" value={script} onChange={(e) => setScript(e.target.value)} rows={8} />
            <div className="actions-row" style={{ justifyContent: "flex-end" }}>
              <button className="button button-secondary" onClick={() => setStage("topic")} disabled={stage === "generatingVideo"}>
                Recommencer
              </button>
              <button className="button button-primary" onClick={handleGenerateVideo} disabled={stage === "generatingVideo" || !script}>
                {stage === "generatingVideo" ? "Génération de la vidéo..." : "Valider et générer la vidéo"}
              </button>
            </div>
        
            {stage === "generatingVideo" && (
              <div className="progress-list">
                {PROGRESS_STEPS.map((p) => (
            <div key={p.key}>
              <div className="progress-row-label">
                <span>{p.label}</span>
                <span>{progress[p.key]}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress[p.key]}%` }} />
              </div>
            </div>
                ))}
              </div>
            )}
          </>
        )}

        {stage === "error" && <p className="error-text">{errorMessage}</p>}
      
        {stage === "done" && videoUrl && (
          <div className="video-frame" style={{ margin: "0 auto" }}>
            <video src={videoUrl} controls />
          </div>
        )}
      </div>
    </main>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={null}>
      <AppPageContent />
    </Suspense>
  );
}
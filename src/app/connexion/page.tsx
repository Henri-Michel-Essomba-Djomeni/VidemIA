"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";

type Step = "email" | "password";

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinueWithEmail() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.exists) {
        router.push(`/inscription?email=${encodeURIComponent(email)}`);
        return;
      }
      setStep("password");
    } catch {
      setError("Une erreur est survenue, réessaie.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit() {
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <main className="app-shell">
      <ParticleBackground variant="hero" />
      <div className="topbar">
        <div className="logo-mark">
          <h1 className="logo-text">VidemIA</h1>
        </div>
        <p className="logo-tagline">Powered by nOX-00</p>
      </div>

      <div className="panel">
        {step === "email" && (
          <>
            <p className="field-label">Connecte-toi avec ton email</p>
            <input
              className="field-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinueWithEmail()}
            />
            {error && <p className="error-text">{error}</p>}
            <div className="actions-row">
              <button className="button button-primary" onClick={handleContinueWithEmail} disabled={loading || !email}>
                {loading ? "Vérification..." : "Continuer"}
              </button>
            </div>

            <div style={{ height: 1, background: "var(--color-panel-border)", margin: "24px 0" }} />

            <p className="field-label" style={{ textAlign: "center" }}>Ou continue avec</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              <button className="button button-oauth" onClick={() => signIn("google", { callbackUrl })}>
                Continuer avec Google
              </button>
              <button className="button button-oauth" onClick={() => signIn("github", { callbackUrl })}>
                Continuer avec GitHub
              </button>
              <button className="button button-oauth button-disabled" disabled title="Pas encore disponible">
                Continuer avec Facebook
              </button>
            </div>
          </>
        )}

        {step === "password" && (
          <>
            <p className="field-label">
              Connecté en tant que <strong>{email}</strong> —{" "}
              <span style={{ color: "var(--color-accent)", cursor: "pointer" }} onClick={() => setStep("email")}>
                changer
              </span>
            </p>
            <input
              className="field-input"
              type="password"
              placeholder="Mot de passe"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            {error && <p className="error-text">{error}</p>}
            <div className="actions-row">
              <button className="button button-primary" onClick={handlePasswordSubmit} disabled={loading || !password}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionContent />
    </Suspense>
  );
}
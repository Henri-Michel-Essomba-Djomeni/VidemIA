"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ParticleBackground } from "@/components/ParticleBackground";
import Link from "next/link";

function InscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription.");

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Compte créé, mais la connexion a échoué. Réessaie depuis /connexion.");

      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
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
        <p className="field-label">Créer un compte</p>
        <input
          className="field-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="field-input"
          type="password"
          placeholder="Mot de passe (8 caractères min.)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: 10 }}
        />
        {error && <p className="error-text">{error}</p>}
        <div className="actions-row">
          <button className="button button-primary" onClick={handleSubmit} disabled={loading || !email || !password}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </div>
        <p className="field-label" style={{ marginTop: 20 }}>
          Déjà un compte ?{" "}
          <Link href="/connexion" style={{ color: "var(--color-accent)" }}>
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <InscriptionContent />
    </Suspense>
  );
}
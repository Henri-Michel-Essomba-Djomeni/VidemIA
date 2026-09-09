import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function LandingPage() {
  return (
    <>
      <ParticleBackground />

      <header className="site-header">
        <span className="logo-text">VidemIA</span>
        <Link href="/app" className="nav-cta">
          Commencer
        </Link>
      </header>

      <section className="hero">
        <h1 className="hero-title">Ton sujet. Sa vidéo.</h1>
        <p className="hero-subtitle">
          Décris ce que tu veux expliquer — VidemIA écrit le script, génère la voix
          et monte la vidéo, prête à publier.
        </p>
        <Link href="/app" className="hero-cta">
          Commencer gratuitement
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">Comment ça marche</h2>
        <p className="section-subtitle">Trois étapes, aucune compétence en montage nécessaire.</p>
        <div className="features-grid">
          <div className="feature-card">
            <p className="feature-step">01</p>
            <h3 className="feature-title">Décris ton sujet</h3>
            <p className="feature-text">
              Une idée, une question, un concept à expliquer — écris-le simplement.
            </p>
          </div>
          <div className="feature-card">
            <p className="feature-step">02</p>
            <h3 className="feature-title">Vérifie le script</h3>
            <p className="feature-text">
              VidemIA rédige le script, tu le relis et l'ajustes si besoin.
            </p>
          </div>
          <div className="feature-card">
            <p className="feature-step">03</p>
            <h3 className="feature-title">Récupère ta vidéo</h3>
            <p className="feature-text">
              Voix off, sous-titres et habillage visuel générés automatiquement.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-section">
        <span className="about-badge">nOX-00</span>
        <h2 className="section-title">Derrière VidemIA</h2>
        <p className="about-text">
          VidemIA fait partie du groupe nOX-00, fondé par Essomba Djomeni Henri Michel,
          étudiant en informatique. Elle rejoint Kalima, son projet de traduction et
          doublage vidéo par IA, dans une même ambition : rendre la création de
          contenu accessible à tous, sans compétences techniques.
        </p>
      </section>

      <footer className="site-footer">
        <p>VidemIA — Powered by nOX-00</p>
      </footer>
    </>
  );
}
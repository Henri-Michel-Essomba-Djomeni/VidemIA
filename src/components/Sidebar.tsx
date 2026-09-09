"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

interface VideoEntry {
  id: string;
  topic: string;
  videoUrl: string;
  createdAt: string;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<VideoEntry[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.videos ?? []))
      .catch(() => setHistory([]));
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu">
          ☰
        </button>
      )}

      <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="sidebar-header">
          <span className="logo-text">VidemIA</span>
          <button className="sidebar-close" onClick={() => setIsOpen(false)} aria-label="Fermer le menu">
            ✕
          </button>
        </div>

        <div className="sidebar-body">
          <p className="sidebar-section-title">Historique</p>
          {history.length === 0 && <p className="sidebar-empty">Aucune vidéo générée pour l'instant.</p>}
          {history.map((entry) => (
            <a key={entry.id} href={entry.videoUrl} target="_blank" rel="noreferrer" className="sidebar-history-item">
              <p className="sidebar-history-topic">{entry.topic}</p>
              <p className="sidebar-history-date">
                {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </a>
          ))}
        </div>

        <SidebarAccount />
      </aside>
    </>
  );
}

function SidebarAccount() {
  const { data: session } = useSession();

  return (
    <div className="sidebar-account">
      <p className="sidebar-account-label">Compte</p>
      {session?.user ? (
        <>
          <p className="sidebar-account-value">{session.user.email}</p>
          <button
            className="button button-secondary"
            style={{ marginTop: 8, fontSize: 12, padding: "6px 12px" }}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Se déconnecter
          </button>
        </>
      ) : (
        <p className="sidebar-account-value">Aucun compte connecté</p>
      )}
    </div>
  );
}
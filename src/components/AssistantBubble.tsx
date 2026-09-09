"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  action?: { topic: string } | null;
}

const ACTION_REGEX = /\[ACTION:GENERATE_VIDEO:(.+?)\]\s*$/;

export function AssistantBubble() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Salut, je suis nOX-00 👋 Une question sur VidemIA ou Kalima ? Ou donne-moi directement le sujet de ta vidéo.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const raw: string = data.reply ?? "";
      const match = raw.match(ACTION_REGEX);
      const cleanText = raw.replace(ACTION_REGEX, "").trim();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleanText, action: match ? { topic: match[1].trim() } : null },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Une erreur est survenue, réessaie." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLaunch(topic: string) {
    router.push(`/app?topic=${encodeURIComponent(topic)}`);
  }

  return (
    <>
      <button className="assistant-toggle" onClick={() => setIsOpen((v) => !v)} aria-label="Assistant nOX-00">
        {isOpen ? "✕" : <span className="assistant-orb" />}
      </button>

      {isOpen && (
        <div className="assistant-panel">
          <div className="assistant-header">nOX-00</div>
          <div className="assistant-messages">
            {messages.map((m, i) => (
              <div key={i} className={`assistant-message assistant-message-${m.role}`}>
                <p>{m.content}</p>
                {m.action && (
                  <button className="button button-primary assistant-action" onClick={() => handleLaunch(m.action!.topic)}>
                    Lancer la génération
                  </button>
                )}
              </div>
            ))}
            {isLoading && <div className="assistant-message assistant-message-assistant"><p>...</p></div>}
          </div>
          <div className="assistant-input-row">
            <input
              className="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Écris ton message..."
            />
            <button className="button button-primary" onClick={handleSend} disabled={isLoading || !input.trim()}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
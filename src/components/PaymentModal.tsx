"use client";

import { useState } from "react";

interface PaymentModalProps {
  onClose: () => void;
  packLabel: string;
}

type Operator = "orange_money" | "mtn_momo";

export function PaymentModal({ onClose, packLabel }: PaymentModalProps) {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!operator || !phone) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/camerpay/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, method: operator }),
      });
      const data = await res.json();
      if (!data.link) throw new Error(data.error || "Impossible de démarrer le paiement.");
      window.location.href = data.link;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Passer au premium</h2>
        <p className="modal-subtitle">{packLabel}</p>

        <div className="operator-choice">
          <button
            className={`operator-option ${operator === "orange_money" ? "is-selected" : ""}`}
            onClick={() => setOperator("orange_money")}
          >
            Orange Money
          </button>
          <button
            className={`operator-option ${operator === "mtn_momo" ? "is-selected" : ""}`}
            onClick={() => setOperator("mtn_momo")}
          >
            MTN MoMo
          </button>
        </div>

        <input
          className="field-input"
          type="tel"
          placeholder="+237 6XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button className="button button-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button
            className="button button-primary"
            onClick={handleSubmit}
            disabled={loading || !operator || !phone}
          >
            {loading ? "Redirection..." : "Payer"}
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function AcceptForm({
  accessToken,
  status,
}: {
  accessToken: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const accepted = status === "accepted" || status === "paid";
  const paid = status === "paid";

  async function accept() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/public/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "Não foi possível registrar o aceite.");
      return;
    }
    setMessage("Proposta aceita. Você já pode simular o pagamento (lab).");
    router.refresh();
  }

  async function simulatePay() {
    setPaying(true);
    setMessage(null);
    const res = await fetch("/api/public/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
    });
    const data = await res.json();
    setPaying(false);
    if (!res.ok) {
      setMessage(data.error ?? "Não foi possível simular o pagamento.");
      return;
    }
    setMessage("Pagamento simulado com sucesso (billing mock).");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
      <h3 className="font-display text-2xl">Aceite e pagamento</h3>
      <p className="mt-2 text-sm text-white/65">
        Ao aceitar, você confirma o escopo. O pagamento neste lab é simulado — sem
        cobrança real.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {!accepted ? (
          <Button onClick={accept} disabled={loading}>
            {loading ? "Registrando…" : "Aceitar proposta"}
          </Button>
        ) : (
          <Button disabled>Aceite registrado</Button>
        )}
        {accepted && !paid ? (
          <Button
            variant="secondary"
            className="border-white/20 bg-white/10 text-white"
            onClick={simulatePay}
            disabled={paying}
          >
            {paying ? "Simulando…" : "Simular pagamento (lab)"}
          </Button>
        ) : null}
        {paid ? (
          <Button disabled variant="secondary" className="border-white/20 bg-white/10 text-white">
            Pagamento simulado
          </Button>
        ) : null}
      </div>
      {message ? <p className="mt-3 text-sm text-[var(--gold)]">{message}</p> : null}
    </div>
  );
}

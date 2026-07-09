"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function AcceptForm({
  slug,
  token,
  status,
  paymentUrl,
}: {
  slug: string;
  token: string;
  status: string;
  paymentUrl?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const accepted = status === "accepted" || status === "paid";

  async function accept() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/public/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, token }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "Não foi possível registrar o aceite.");
      return;
    }
    setMessage("Proposta aceita. Você já pode seguir para o pagamento.");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
      <h3 className="font-display text-2xl">Aceite e pagamento</h3>
      <p className="mt-2 text-sm text-white/65">
        Ao aceitar, você confirma o escopo e libera o CTA de pagamento.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {!accepted ? (
          <Button onClick={accept} disabled={loading}>
            {loading ? "Registrando…" : "Aceitar proposta"}
          </Button>
        ) : (
          <Button disabled>Aceite registrado</Button>
        )}
        {accepted && paymentUrl ? (
          <a href={paymentUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="border-white/20 bg-white/10 text-white">
              Ir para pagamento
            </Button>
          </a>
        ) : null}
      </div>
      {message ? <p className="mt-3 text-sm text-[var(--gold)]">{message}</p> : null}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function ProposalActions({
  proposalId,
  status,
}: {
  proposalId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function run(action: string) {
    setLoading(action);
    setMessage(null);
    const res = await fetch(`/api/proposals/${proposalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setMessage(data.error ?? "Ação falhou.");
      return;
    }
    setMessage(data.message ?? "Atualizado.");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" ? (
        <Button onClick={() => run("send")} disabled={!!loading}>
          {loading === "send" ? "Enviando…" : "Enviar ao cliente"}
        </Button>
      ) : null}
      <Button variant="secondary" onClick={() => run("remind")} disabled={!!loading}>
        {loading === "remind" ? "Agendando…" : "Enviar lembrete"}
      </Button>
      {status !== "accepted" && status !== "paid" ? (
        <Button variant="ghost" onClick={() => run("archive")} disabled={!!loading}>
          Arquivar
        </Button>
      ) : null}
      {message ? <p className="w-full text-sm text-[var(--muted-strong)]">{message}</p> : null}
    </div>
  );
}

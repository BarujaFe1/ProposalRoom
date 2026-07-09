"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, Input, Label, PageHeader, Textarea } from "@/components/ui";
import Link from "next/link";

export default function NewProposalPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpgrade(false);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount") || 0);
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        clientName: form.get("clientName"),
        clientEmail: form.get("clientEmail"),
        brief: form.get("brief"),
        amountCents: Math.round(amount * 100),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Não foi possível criar a proposta.");
      setUpgrade(Boolean(data.upgradeRequired));
      return;
    }
    router.push(`/app/proposals/${data.proposal.id}`);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Nova proposta"
        description="Cole o brief. A IA (ou o gerador local em demo) monta seções editoriais."
      />
      <form
        onSubmit={onSubmit}
        className="max-w-2xl space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" required placeholder="Identidade visual — Cliente" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="clientName">Cliente</Label>
            <Input id="clientName" name="clientName" required />
          </div>
          <div>
            <Label htmlFor="clientEmail">E-mail do cliente</Label>
            <Input id="clientEmail" name="clientEmail" type="email" required />
          </div>
        </div>
        <div>
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input id="amount" name="amount" type="number" min={1} step="0.01" defaultValue={8500} />
        </div>
        <div>
          <Label htmlFor="brief">Brief</Label>
          <Textarea
            id="brief"
            name="brief"
            required
            placeholder="Contexto, objetivo, prazo, restrições e resultado esperado…"
          />
        </div>
        {error ? (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}{" "}
            {upgrade ? (
              <Link href="/app/upgrade" className="font-medium underline">
                Fazer upgrade
              </Link>
            ) : null}
          </div>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Gerando…" : "Gerar proposta"}
        </Button>
      </form>
    </div>
  );
}

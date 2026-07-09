"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, Input, Label } from "@/components/ui";

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceName: form.get("workspaceName"),
        brandColor: form.get("brandColor") || "#1F3A2E",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Falha no onboarding.");
      return;
    }
    router.push("/app/proposals/new");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Onboarding</p>
      <h1 className="mt-2 font-display text-4xl">Crie seu workspace</h1>
      <p className="mt-2 text-sm text-[var(--muted-strong)]">
        Este será o espaço da sua marca para propostas, aceite e cobrança.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="workspaceName">Nome do workspace</Label>
          <Input id="workspaceName" name="workspaceName" required placeholder="Atelier Norte" />
        </div>
        <div>
          <Label htmlFor="brandColor">Cor da marca</Label>
          <Input id="brandColor" name="brandColor" type="color" defaultValue="#1F3A2E" />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando…" : "Ir para primeira proposta"}
        </Button>
      </form>
    </div>
  );
}

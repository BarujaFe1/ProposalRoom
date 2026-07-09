"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import type { PlanId } from "@/billing/plans";

export function BillingActions({
  currentPlan,
  customerId,
}: {
  currentPlan: PlanId;
  customerId: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "Portal indisponível.");
      return;
    }
    window.location.href = data.portalUrl;
  }

  return (
    <div className="space-y-2">
      <Button onClick={openPortal} disabled={loading} variant="secondary">
        {loading ? "Abrindo…" : "Abrir portal do cliente"}
      </Button>
      <p className="text-xs text-[var(--muted)]">
        Provider atual: {process.env.NEXT_PUBLIC_BILLING_PROVIDER ?? "mock"} · plano {currentPlan}
      </p>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
    </div>
  );
}

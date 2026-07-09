"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import type { PlanId } from "@/billing/plans";

export function UpgradeCheckout({ planId }: { planId: PlanId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Checkout falhou.");
      return;
    }
    window.location.href = data.checkoutUrl;
  }

  return (
    <div>
      <Button onClick={checkout} disabled={loading} className="w-full">
        {loading ? "Redirecionando…" : `Assinar ${planId}`}
      </Button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

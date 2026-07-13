import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { getBillingProvider } from "@/billing";
import { absoluteUrl } from "@/lib/utils";
import { applyBillingWebhookEvent } from "@/billing/webhook-router";
import { db, saveDb } from "@/lib/db";
import type { PlanId } from "@/billing/plans";

const schema = z.object({
  planId: z.enum(["starter", "pro", "business"]),
});

export async function POST(req: Request) {
  const session = await getSessionContext();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  try {
    const provider = getBillingProvider();
    const result = await provider.createCheckoutSession({
      workspaceId: session.workspace.id,
      planId: parsed.data.planId,
      customerEmail: session.user.email,
      successUrl: absoluteUrl("/app/billing"),
      cancelUrl: absoluteUrl("/app/upgrade"),
    });

    // Mock provider: apply subscription immediately so demo gating works end-to-end.
    if (provider.name === "mock" && parsed.data.planId !== "starter") {
      applyBillingWebhookEvent({
        id: `mock_checkout_${result.sessionId}`,
        type: "checkout.completed",
        provider: "mock",
        workspaceId: session.workspace.id,
        customerId: session.workspace.billingCustomerId ?? "cus_mock",
        subscriptionId: result.sessionId,
        planId: parsed.data.planId as PlanId,
        status: "active",
        occurredAt: new Date().toISOString(),
        raw: { sessionId: result.sessionId },
      });
      session.workspace.planId = parsed.data.planId;
      session.workspace.subscriptionStatus = "active";
      db().subscriptionEvents.push({
        id: `mock_checkout_${result.sessionId}`,
        provider: "mock",
        type: "checkout.completed",
        payload: { planId: parsed.data.planId },
        createdAt: new Date().toISOString(),
      });
      await saveDb();
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout indisponível." },
      { status: 500 },
    );
  }
}

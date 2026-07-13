import { NextResponse } from "next/server";
import { getBillingProvider } from "@/billing";
import { applyBillingWebhookEvent } from "@/billing/webhook-router";
import { db } from "@/lib/db";
import type { PlanId } from "@/billing/plans";

export async function POST(req: Request) {
  const payload = await req.text();
  const provider = getBillingProvider();
  const signature =
    req.headers.get("stripe-signature") ??
    req.headers.get("x-signature") ??
    req.headers.get("x-hub-signature") ??
    (provider.name === "mock" ? "mock" : null);

  try {
    const event = await provider.verifyAndParseWebhook(payload, signature);

    // Always persist raw event for auditability.
    const alreadyStored = db().subscriptionEvents.some((e) => e.id === event.id);
    if (!alreadyStored) {
      db().subscriptionEvents.push({
        id: event.id,
        provider: event.provider,
        type: event.type,
        payload: event.raw,
        createdAt: event.occurredAt,
      });
    }

    const result = applyBillingWebhookEvent(event);

    if (result.applied && result.subscription) {
      const workspace = db().workspaces.find(
        (w) => w.id === result.subscription!.workspaceId,
      );
      if (workspace) {
        workspace.planId = result.subscription.planId as PlanId;
        workspace.subscriptionStatus =
          (result.subscription.status as typeof workspace.subscriptionStatus) ||
          workspace.subscriptionStatus;
        if (result.subscription.customerId) {
          workspace.billingCustomerId = result.subscription.customerId;
        }
      }
    }

    return NextResponse.json({
      received: true,
      duplicate: result.duplicate,
      applied: result.applied,
      eventId: event.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook inválido." },
      { status: 400 },
    );
  }
}

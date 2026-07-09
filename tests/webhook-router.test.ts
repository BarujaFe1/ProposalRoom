import { beforeEach, describe, expect, it } from "vitest";
import {
  applyBillingWebhookEvent,
  resetWebhookStore,
  getWebhookStoreSnapshot,
} from "@/billing/webhook-router";
import type { NormalizedBillingEvent } from "@/billing/billing-provider";

function event(partial: Partial<NormalizedBillingEvent> = {}): NormalizedBillingEvent {
  return {
    id: "evt_1",
    type: "checkout.completed",
    provider: "mock",
    workspaceId: "ws_1",
    customerId: "cus_1",
    subscriptionId: "sub_1",
    planId: "pro",
    status: "active",
    occurredAt: new Date().toISOString(),
    raw: { hello: "world" },
    ...partial,
  };
}

describe("webhook router idempotency", () => {
  beforeEach(() => {
    resetWebhookStore();
  });

  it("applies a new event once", () => {
    const first = applyBillingWebhookEvent(event());
    expect(first.duplicate).toBe(false);
    expect(first.applied).toBe(true);
    expect(first.subscription?.planId).toBe("pro");
  });

  it("ignores duplicate event ids but keeps raw history", () => {
    applyBillingWebhookEvent(event());
    const second = applyBillingWebhookEvent(event());
    expect(second.duplicate).toBe(true);
    expect(second.applied).toBe(false);

    const snap = getWebhookStoreSnapshot();
    expect(snap.events).toHaveLength(2);
    expect(snap.processedCount).toBe(1);
    expect(snap.subscriptions).toHaveLength(1);
  });

  it("marks canceled subscriptions", () => {
    applyBillingWebhookEvent(event());
    const canceled = applyBillingWebhookEvent(
      event({
        id: "evt_2",
        type: "subscription.canceled",
        status: "canceled",
      }),
    );
    expect(canceled.subscription?.status).toBe("canceled");
  });
});

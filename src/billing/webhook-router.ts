import type { NormalizedBillingEvent } from "./billing-provider";
import type { PlanId } from "./plans";

export type SubscriptionRecord = {
  workspaceId: string;
  planId: PlanId;
  status: string;
  customerId?: string;
  subscriptionId?: string;
  updatedAt: string;
};

export type InvoiceRecord = {
  id: string;
  workspaceId: string;
  amountCents: number;
  status: "open" | "paid" | "void" | "uncollectible";
  createdAt: string;
};

export type WebhookStore = {
  processedEventIds: Set<string>;
  events: NormalizedBillingEvent[];
  subscriptions: Map<string, SubscriptionRecord>;
  invoices: Map<string, InvoiceRecord>;
};

const globalStore = globalThis as unknown as {
  __proposalRoomWebhookStore?: WebhookStore;
};

function store(): WebhookStore {
  if (!globalStore.__proposalRoomWebhookStore) {
    globalStore.__proposalRoomWebhookStore = {
      processedEventIds: new Set(),
      events: [],
      subscriptions: new Map(),
      invoices: new Map(),
    };
  }
  return globalStore.__proposalRoomWebhookStore;
}

export type WebhookApplyResult = {
  duplicate: boolean;
  applied: boolean;
  event: NormalizedBillingEvent;
  subscription?: SubscriptionRecord;
};

/**
 * Idempotent webhook router: raw events are always retained,
 * but side-effects apply only once per provider event id.
 */
export function applyBillingWebhookEvent(
  event: NormalizedBillingEvent,
): WebhookApplyResult {
  const s = store();
  s.events.push(event);

  if (s.processedEventIds.has(event.id)) {
    return { duplicate: true, applied: false, event };
  }

  s.processedEventIds.add(event.id);

  const workspaceId = event.workspaceId || "unknown";
  let subscription = s.subscriptions.get(workspaceId);

  switch (event.type) {
    case "checkout.completed":
    case "subscription.created":
    case "subscription.updated":
    case "trial.started":
    case "payment.succeeded":
    case "invoice.paid": {
      subscription = {
        workspaceId,
        planId: (event.planId as PlanId) ?? subscription?.planId ?? "pro",
        status: event.status || "active",
        customerId: event.customerId ?? subscription?.customerId,
        subscriptionId: event.subscriptionId ?? subscription?.subscriptionId,
        updatedAt: event.occurredAt,
      };
      s.subscriptions.set(workspaceId, subscription);
      break;
    }
    case "subscription.canceled":
    case "payment.failed":
    case "trial.ending": {
      subscription = {
        workspaceId,
        planId: (event.planId as PlanId) ?? subscription?.planId ?? "starter",
        status:
          event.type === "subscription.canceled"
            ? "canceled"
            : event.type === "payment.failed"
              ? "past_due"
              : "trialing",
        customerId: event.customerId ?? subscription?.customerId,
        subscriptionId: event.subscriptionId ?? subscription?.subscriptionId,
        updatedAt: event.occurredAt,
      };
      s.subscriptions.set(workspaceId, subscription);
      break;
    }
    case "invoice.created": {
      const invoiceId = `inv_${event.id}`;
      s.invoices.set(invoiceId, {
        id: invoiceId,
        workspaceId,
        amountCents: event.amountCents ?? 0,
        status: "open",
        createdAt: event.occurredAt,
      });
      break;
    }
    case "chargeback":
    case "refund": {
      if (subscription) {
        subscription = {
          ...subscription,
          status: "past_due",
          updatedAt: event.occurredAt,
        };
        s.subscriptions.set(workspaceId, subscription);
      }
      break;
    }
    default:
      break;
  }

  return { duplicate: false, applied: true, event, subscription };
}

export function getWebhookStoreSnapshot() {
  const s = store();
  return {
    processedCount: s.processedEventIds.size,
    events: [...s.events],
    subscriptions: [...s.subscriptions.values()],
    invoices: [...s.invoices.values()],
  };
}

export function resetWebhookStore() {
  globalStore.__proposalRoomWebhookStore = {
    processedEventIds: new Set(),
    events: [],
    subscriptions: new Map(),
    invoices: new Map(),
  };
}

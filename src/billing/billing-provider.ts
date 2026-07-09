import type { PlanId } from "./plans";

export type CheckoutInput = {
  workspaceId: string;
  planId: PlanId;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult = {
  provider: BillingProviderName;
  checkoutUrl: string;
  sessionId: string;
};

export type PortalInput = {
  workspaceId: string;
  customerId: string;
  returnUrl: string;
};

export type PortalResult = {
  provider: BillingProviderName;
  portalUrl: string;
};

export type BillingProviderName = "mock" | "stripe" | "mercadopago" | "pagarme";

export type NormalizedBillingEvent = {
  id: string;
  type:
    | "checkout.completed"
    | "subscription.created"
    | "subscription.updated"
    | "subscription.canceled"
    | "trial.started"
    | "trial.ending"
    | "payment.succeeded"
    | "payment.failed"
    | "invoice.created"
    | "invoice.paid"
    | "chargeback"
    | "refund"
    | "unknown";
  provider: BillingProviderName;
  workspaceId?: string;
  customerId?: string;
  subscriptionId?: string;
  planId?: PlanId;
  status?: string;
  amountCents?: number;
  raw: unknown;
  occurredAt: string;
};

export interface BillingProvider {
  name: BillingProviderName;
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult>;
  createCustomerPortal(input: PortalInput): Promise<PortalResult>;
  verifyAndParseWebhook(
    payload: string,
    signature: string | null,
  ): Promise<NormalizedBillingEvent>;
}

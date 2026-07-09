import { nanoid } from "nanoid";
import type {
  BillingProvider,
  CheckoutInput,
  CheckoutResult,
  NormalizedBillingEvent,
  PortalInput,
  PortalResult,
} from "./billing-provider";
import type { PlanId } from "./plans";

/**
 * Stripe adapter — production-ready shape without requiring live credentials.
 * When STRIPE_SECRET_KEY is missing, methods throw a clear configuration error.
 */
export class StripeBillingProvider implements BillingProvider {
  name = "stripe" as const;

  private requireKey() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY não configurada. Defina BILLING_PROVIDER=mock em desenvolvimento.",
      );
    }
    return key;
  }

  private priceForPlan(planId: PlanId) {
    const map: Record<PlanId, string | undefined> = {
      starter: process.env.STRIPE_PRICE_STARTER,
      pro: process.env.STRIPE_PRICE_PRO,
      business: process.env.STRIPE_PRICE_BUSINESS,
    };
    const price = map[planId];
    if (!price) {
      throw new Error(`Stripe price ID ausente para o plano ${planId}.`);
    }
    return price;
  }

  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    this.requireKey();
    const priceId = this.priceForPlan(input.planId);
    // Placeholder session — wire Stripe SDK when credentials are present.
    const sessionId = `cs_test_${nanoid(12)}`;
    return {
      provider: "stripe",
      sessionId,
      checkoutUrl: `https://checkout.stripe.com/c/pay/${sessionId}?price=${priceId}&client_reference_id=${input.workspaceId}`,
    };
  }

  async createCustomerPortal(input: PortalInput): Promise<PortalResult> {
    this.requireKey();
    return {
      provider: "stripe",
      portalUrl: `https://billing.stripe.com/p/session/${input.customerId}?return=${encodeURIComponent(input.returnUrl)}`,
    };
  }

  async verifyAndParseWebhook(
    payload: string,
    signature: string | null,
  ): Promise<NormalizedBillingEvent> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("STRIPE_WEBHOOK_SECRET não configurada.");
    }
    if (!signature) {
      throw new Error("Assinatura Stripe ausente.");
    }

    const data = JSON.parse(payload) as {
      id: string;
      type: string;
      data?: { object?: Record<string, unknown> };
    };

    const obj = (data.data?.object ?? {}) as Record<string, unknown>;
    const metadata = (obj.metadata ?? {}) as Record<string, unknown>;
    const typeMap: Record<string, NormalizedBillingEvent["type"]> = {
      "checkout.session.completed": "checkout.completed",
      "customer.subscription.created": "subscription.created",
      "customer.subscription.updated": "subscription.updated",
      "customer.subscription.deleted": "subscription.canceled",
      "invoice.created": "invoice.created",
      "invoice.paid": "invoice.paid",
      "invoice.payment_failed": "payment.failed",
      "charge.refunded": "refund",
      "charge.dispute.created": "chargeback",
    };

    return {
      id: data.id,
      type: typeMap[data.type] ?? "unknown",
      provider: "stripe",
      workspaceId: String(obj.client_reference_id ?? metadata.workspaceId ?? ""),
      customerId: String(obj.customer ?? ""),
      subscriptionId: String(obj.subscription ?? obj.id ?? ""),
      planId: (metadata.planId as PlanId | undefined) ?? undefined,
      status: String(obj.status ?? ""),
      amountCents: Number(obj.amount_total ?? obj.amount_paid ?? 0) || undefined,
      raw: data,
      occurredAt: new Date().toISOString(),
    };
  }
}

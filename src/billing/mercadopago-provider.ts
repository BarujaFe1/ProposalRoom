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
 * Mercado Pago / Pagar.me style adapter.
 * Uses MERCADOPAGO_* or PAGARME_* env vars depending on BILLING_PROVIDER.
 */
export class MercadoPagoBillingProvider implements BillingProvider {
  name: "mercadopago" | "pagarme";

  constructor(name: "mercadopago" | "pagarme" = "mercadopago") {
    this.name = name;
  }

  private requireToken() {
    const token =
      this.name === "pagarme"
        ? process.env.PAGARME_API_KEY
        : process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        `${this.name} credentials missing. Use BILLING_PROVIDER=mock until configured.`,
      );
    }
    return token;
  }

  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    this.requireToken();
    const sessionId = `${this.name}_pref_${nanoid(10)}`;
    return {
      provider: this.name,
      sessionId,
      checkoutUrl: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${sessionId}&external_reference=${input.workspaceId}&plan=${input.planId}`,
    };
  }

  async createCustomerPortal(input: PortalInput): Promise<PortalResult> {
    this.requireToken();
    return {
      provider: this.name,
      portalUrl: `${input.returnUrl}?portal=${this.name}&customer=${input.customerId}`,
    };
  }

  async verifyAndParseWebhook(
    payload: string,
    signature: string | null,
  ): Promise<NormalizedBillingEvent> {
    const secret =
      this.name === "pagarme"
        ? process.env.PAGARME_WEBHOOK_SECRET
        : process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error(`${this.name} webhook secret missing.`);
    }
    if (!signature) {
      throw new Error("Assinatura de webhook ausente.");
    }

    const data = JSON.parse(payload) as {
      id?: string;
      type?: string;
      action?: string;
      data?: Record<string, unknown>;
      external_reference?: string;
    };

    const action = data.type ?? data.action ?? "unknown";
    const typeMap: Record<string, NormalizedBillingEvent["type"]> = {
      payment: "payment.succeeded",
      "payment.created": "payment.succeeded",
      "payment.updated": "payment.succeeded",
      subscription_authorized: "subscription.created",
      subscription_cancelled: "subscription.canceled",
      invoice: "invoice.created",
    };

    return {
      id: String(data.id ?? `${this.name}_evt_${nanoid(8)}`),
      type: typeMap[action] ?? "unknown",
      provider: this.name,
      workspaceId: String(data.external_reference ?? data.data?.external_reference ?? ""),
      customerId: String(data.data?.payer_id ?? ""),
      subscriptionId: String(data.data?.id ?? ""),
      planId: data.data?.plan_id as PlanId | undefined,
      status: String(data.data?.status ?? ""),
      amountCents: Number(data.data?.transaction_amount ?? 0) * 100 || undefined,
      raw: data,
      occurredAt: new Date().toISOString(),
    };
  }
}

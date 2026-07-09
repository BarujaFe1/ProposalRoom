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

export class MockBillingProvider implements BillingProvider {
  name = "mock" as const;

  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    const sessionId = `mock_cs_${nanoid(10)}`;
    const url = new URL(input.successUrl);
    url.searchParams.set("session_id", sessionId);
    url.searchParams.set("plan", input.planId);
    url.searchParams.set("workspace", input.workspaceId);
    url.searchParams.set("mock", "1");
    return {
      provider: "mock",
      checkoutUrl: url.toString(),
      sessionId,
    };
  }

  async createCustomerPortal(input: PortalInput): Promise<PortalResult> {
    const url = new URL(input.returnUrl);
    url.searchParams.set("portal", "mock");
    url.searchParams.set("customer", input.customerId);
    return {
      provider: "mock",
      portalUrl: url.toString(),
    };
  }

  async verifyAndParseWebhook(
    payload: string,
    signature: string | null,
  ): Promise<NormalizedBillingEvent> {
    void signature;
    const data = JSON.parse(payload) as {
      id?: string;
      type?: NormalizedBillingEvent["type"];
      workspaceId?: string;
      customerId?: string;
      subscriptionId?: string;
      planId?: PlanId;
      status?: string;
      amountCents?: number;
    };

    return {
      id: data.id ?? `mock_evt_${nanoid(10)}`,
      type: data.type ?? "unknown",
      provider: "mock",
      workspaceId: data.workspaceId,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      planId: data.planId,
      status: data.status,
      amountCents: data.amountCents,
      raw: data,
      occurredAt: new Date().toISOString(),
    };
  }
}

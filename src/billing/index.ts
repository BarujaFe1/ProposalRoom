import type { BillingProvider, BillingProviderName } from "./billing-provider";
import { MercadoPagoBillingProvider } from "./mercadopago-provider";
import { MockBillingProvider } from "./mock-provider";
import { StripeBillingProvider } from "./stripe-provider";

let cached: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (cached) return cached;

  const name = (process.env.BILLING_PROVIDER ?? "mock") as BillingProviderName;

  switch (name) {
    case "stripe":
      cached = new StripeBillingProvider();
      break;
    case "mercadopago":
      cached = new MercadoPagoBillingProvider("mercadopago");
      break;
    case "pagarme":
      cached = new MercadoPagoBillingProvider("pagarme");
      break;
    case "mock":
    default:
      cached = new MockBillingProvider();
      break;
  }

  return cached;
}

export function resetBillingProviderCache() {
  cached = null;
}

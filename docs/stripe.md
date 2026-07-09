# Ativar Stripe

1. Crie produtos/preços Starter, Pro e Business no Stripe.
2. Defina:
   - `BILLING_PROVIDER=stripe`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_STARTER|PRO|BUSINESS`
3. Webhook endpoint: `/api/webhooks/billing`
4. Eventos: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`, `charge.refunded`, `charge.dispute.created`
5. Teste com Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/billing`

O adapter em `src/billing/stripe-provider.ts` já normaliza esses eventos.

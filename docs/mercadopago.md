# Ativar Mercado Pago / Pagar.me

## Mercado Pago
1. `BILLING_PROVIDER=mercadopago`
2. `MERCADOPAGO_ACCESS_TOKEN`
3. `MERCADOPAGO_WEBHOOK_SECRET`
4. Webhook → `/api/webhooks/billing`

## Pagar.me
1. `BILLING_PROVIDER=pagarme`
2. `PAGARME_API_KEY`
3. `PAGARME_WEBHOOK_SECRET`

Ambos usam `MercadoPagoBillingProvider` com normalização de eventos e persistência em `subscription_events`.

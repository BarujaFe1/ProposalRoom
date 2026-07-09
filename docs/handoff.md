# Handoff final

## Feito
- MVP Next.js com landing, pricing, auth, onboarding, dashboard, CRUD de propostas
- Sala pública protegida com aceite e CTA de pagamento
- Billing adapters (mock/stripe/mercadopago/pagarme), plans, entitlements, webhook idempotente
- Seed demo, export CSV, docs de deploy/billing/Supabase
- Testes unitários de entitlements e webhook

## Falta para produção real
- Trocar demo DB por Supabase client real
- Ligar Stripe/MP SDKs com credenciais
- Resend para lembretes reais
- Screenshots reais no README (`assets/screenshots`)
- CI GitHub Actions (opcional)

## Ativar cobrança real
1. Escolher provider em `BILLING_PROVIDER`
2. Preencher secrets no Vercel
3. Configurar webhook para `/api/webhooks/billing`
4. Validar checkout → evento → plano atualizado no workspace

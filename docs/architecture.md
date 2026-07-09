# Arquitetura ProposalRoom

```mermaid
flowchart TB
  subgraph Client
    LP[Landing / Pricing]
    Auth[Login / Signup / Onboarding]
    App[App Dashboard]
    Public[Sala do Cliente /p/slug]
  end

  subgraph NextApp[Next.js App Router]
    API[Route Handlers]
    Billing[billing adapters]
    Domain[proposals + entitlements]
    DemoDB[(In-memory demo DB)]
  end

  subgraph External
    Supabase[(Supabase Auth + Postgres + RLS)]
    Stripe[Stripe]
    MP[Mercado Pago / Pagar.me]
    AI[OpenAI / xAI via AI SDK]
    Email[Resend / SMTP]
  end

  LP --> Auth --> App
  App --> API
  Public --> API
  API --> Domain
  API --> Billing
  Domain --> DemoDB
  Domain -.prod.-> Supabase
  Billing --> Stripe
  Billing --> MP
  API --> AI
  API --> Email
```

## Camadas

1. **UI** — landing editorial, app shell, sala pública.
2. **API** — Zod validation, auth session, gating de plano.
3. **Billing** — provider adapter (`mock|stripe|mercadopago|pagarme`) + webhook idempotente.
4. **Domain** — briefs, propostas, aceite, lembretes, export CSV.
5. **Data** — demo in-memory agora; schema Supabase pronto em `supabase/schema.sql`.

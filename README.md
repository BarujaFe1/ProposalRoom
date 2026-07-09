<div align="center">
  <img src="./assets/icon.svg" alt="ProposalRoom Logo" width="120" height="120" />

  <h1>ProposalRoom</h1>

  <p><strong>Gerador de propostas comerciais com sala do cliente, aceite digital, follow-up e cobranÃ§a pronta.</strong></p>
  <p><strong>Commercial proposal generator with client room, digital acceptance, follow-up and billing-ready SaaS.</strong></p>

  <p>
    <a href="#1-visÃ£o-geral--overview">PT-BR / English Overview</a> â€¢
    <a href="#-product-preview">Preview</a> â€¢
    <a href="#-screenshots">Screenshots</a> â€¢
    <a href="#ï¸-stack--tecnologias">Stack</a> â€¢
    <a href="#-arquitetura--architecture">Architecture</a> â€¢
    <a href="#-quick-start--inÃ­cio-rÃ¡pido">Quick Start</a> â€¢
    <a href="#-autor--author">Author</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Ready-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img alt="Stripe" src="https://img.shields.io/badge/Billing-Stripe%20%2F%20Mercado%20Pago-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-Unit%20Tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
    <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.svg" alt="ProposalRoom product overview" width="100%" />
</p>

---

## 1. VisÃ£o Geral / Overview

O **ProposalRoom** Ã© um SaaS para transformar um brief em uma proposta comercial elegante, com sala do cliente, aceite digital, lembretes e cobranÃ§a preparada para produÃ§Ã£o.

Ele foi desenhado para prestadores de serviÃ§o, designers, agÃªncias, arquitetos, assistÃªncia tÃ©cnica e consultorias que precisam fechar propostas com clareza, evidÃªncia e fluxo real â€” sem dashboard decorativo.

O projeto foi desenvolvido por **Felipe Alirio Baruja** como peÃ§a de portfÃ³lio premium, pronta para publicaÃ§Ã£o e evoluÃ§Ã£o para produto pago.

> **Product Notice**  
> O MVP roda com demo DB in-memory e `BILLING_PROVIDER=mock` para funcionar sem credenciais. Schema Supabase, adapters Stripe/Mercado Pago e webhooks idempotentes jÃ¡ estÃ£o no repositÃ³rio.

---

## âœ¨ Product Preview

<p align="center">
  <img src="./assets/screenshots/01-dashboard.svg" alt="ProposalRoom Dashboard" width="100%" />
</p>

O ProposalRoom apresenta uma experiÃªncia editorial e luxuosa: proposta como landing page, workspace real, limites por plano e upgrade com billing preparado.

---

## 2. Por que este projeto importa? / Why this project matters

* **Propostas ainda sÃ£o PDF estÃ¡tico:** o cliente precisa de uma sala clara para ler, aceitar e pagar.
* **Times enxutos precisam de velocidade:** do brief Ã  proposta em minutos, com IA e templates.
* **CobranÃ§a nÃ£o pode ser afterthought:** entitlements, webhooks e portal do cliente jÃ¡ fazem parte do MVP.
* **PortfÃ³lio defensÃ¡vel:** arquitetura limpa, testes, docs de deploy e caminho para produÃ§Ã£o.

---

## ðŸ§  O diferencial do ProposalRoom / What makes ProposalRoom different

### PortuguÃªs
NÃ£o Ã© um gerador de texto solto. Ã‰ um fluxo comercial completo:
- brief â†’ seÃ§Ãµes editoriais;
- pÃ¡gina pÃºblica protegida por token;
- aceite + CTA de pagamento;
- status, lembretes e exportaÃ§Ã£o;
- gating por plano no backend e na UI.

### English
Not just a text generator. It is a full commercial flow:
- brief â†’ editorial sections;
- token-protected public page;
- acceptance + payment CTA;
- status, reminders and export;
- plan gating on backend and UI.

---

## ðŸŽ¯ Problema que resolve / The problem it solves

Em operaÃ§Ãµes reais de serviÃ§o:
- propostas demoram para sair;
- o cliente nÃ£o sabe onde aceitar;
- follow-up some no WhatsApp;
- cobranÃ§a fica desconectada do documento;
- limites de plano nÃ£o existem atÃ© o caos.

O **ProposalRoom** organiza brief, proposta, sala do cliente, aceite e billing em um Ãºnico produto.

---

## ðŸ§© Proposta / Product Pipeline

```txt
Brief do cliente
  â†“
GeraÃ§Ã£o de proposta (IA / gerador local demo)
  â†“
EdiÃ§Ã£o e envio
  â†“
Sala pÃºblica protegida
  â†“
Aceite digital
  â†“
CTA de pagamento
  â†“
Status + lembretes + export CSV
  â†“
Upgrade / Billing (mock â†’ Stripe / Mercado Pago)
```

---

## ðŸ“¸ Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/01-dashboard.svg" alt="Dashboard" />
      <br />
      <sub><strong>Dashboard</strong> â€” propostas ativas, plano, uso de IA e lista operacional.</sub>
    </td>
    <td width="50%">
      <img src="./assets/screenshots/02-client-room.svg" alt="Client Room" />
      <br />
      <sub><strong>Sala do cliente</strong> â€” proposta editorial, aceite e CTA de pagamento.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/03-upgrade-billing.svg" alt="Upgrade and Billing" />
      <br />
      <sub><strong>Upgrade & Billing</strong> â€” limites, planos Pro/Business e portal do cliente.</sub>
    </td>
    <td width="50%">
      <img src="./assets/architecture-pipeline.svg" alt="Architecture" />
      <br />
      <sub><strong>Architecture</strong> â€” Next.js, billing adapters, Supabase-ready schema.</sub>
    </td>
  </tr>
</table>

---

## ðŸ“Œ Estudo de Caso / Case Study

### ðŸ“Œ Estudo de Caso: Atelier Norte
O seed demo simula o workspace **Atelier Norte** com 3 propostas ativas no plano Starter, template editorial e cliente realista (Casa Aurora, Studio Lume, Oficina Verde). Ao tentar a 4Âª proposta, o gating exige upgrade â€” exatamente o momento de monetizaÃ§Ã£o.

### ðŸ“Œ Case Study: Atelier Norte
The demo seed simulates the **Atelier Norte** workspace with 3 active Starter proposals, an editorial template and realistic clients. Creating a 4th proposal triggers upgrade gating â€” the monetization moment.

---

## ðŸ§­ Visual Story / Jornada do Produto

```txt
1. Abrir landing e entender a proposta de valor
2. Entrar com demo@proposalroom.app / demo1234
3. Ver dashboard com seed realista
4. Criar proposta a partir de um brief
5. Enviar e abrir a sala pÃºblica
6. Aceitar e seguir para pagamento
7. Atingir limite Starter e ir para /app/upgrade
8. Simular checkout mock e portal de billing
```

---

## âš™ï¸ Funcionalidades Principais / Core Features

### Brief â†’ Proposta
Gera seÃ§Ãµes editoriais a partir do brief, com validaÃ§Ã£o Zod e contagem de uso de IA.

### Sala do Cliente
PÃ¡gina pÃºblica `/p/[slug]?token=...` com visual de apresentaÃ§Ã£o, aceite e CTA de pagamento.

### Billing Ready
Adapters `mock`, `stripe`, `mercadopago`, `pagarme`, plans, entitlements e webhook idempotente.

### Plan Guards
Limites de propostas ativas, templates, remoÃ§Ã£o de marca, analytics e automaÃ§Ãµes.

### Export
CSV simples das propostas do workspace.

---

## ðŸ› ï¸ Stack / Tecnologias

### Frontend
- **Framework:** Next.js 15 (App Router) & React 19
- **Linguagem:** TypeScript
- **EstilizaÃ§Ã£o:** Tailwind CSS v4
- **UI:** componentes prÃ³prios + Lucide
- **Motion:** Framer Motion (pontual)

### Backend / Platform
- **Auth demo:** JWT httpOnly (`jose`)
- **Data:** demo DB in-memory + schema Supabase Postgres/RLS
- **IA:** Vercel AI SDK adapters (`OPENAI_API_KEY`, `XAI_API_KEY`)
- **Billing:** Stripe / Mercado Pago / Pagar.me adapters
- **Testes:** Vitest + Playwright
- **Deploy:** Vercel

---

## ðŸ§± Arquitetura / Architecture

```text
ProposalRoom/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/                      # Landing, auth, app, public room, APIs
â”‚   â”œâ”€â”€ billing/                  # providers, plans, entitlements, webhooks
â”‚   â”œâ”€â”€ components/               # UI + app shell
â”‚   â””â”€â”€ lib/                      # auth, db demo, proposals, utils
â”œâ”€â”€ supabase/schema.sql           # Postgres + RLS
â”œâ”€â”€ docs/                         # deploy, stripe, supabase, handoff
â”œâ”€â”€ tests/                        # unit tests
â”œâ”€â”€ e2e/                          # Playwright critical flow
â”œâ”€â”€ assets/                       # icon, hero, screenshots placeholders
â””â”€â”€ README.md
```

Detalhes em [docs/architecture.md](./docs/architecture.md).

---

## ðŸ§± Visual Architecture

<p align="center">
  <img src="./assets/architecture-pipeline.svg" alt="ProposalRoom visual architecture" width="100%" />
</p>

---

## ðŸš€ Quick Start / InÃ­cio RÃ¡pido

### PrÃ©-requisitos
- **Node.js** v20+
- **Git**

### Setup

```bash
git clone https://github.com/BarujaFe1/ProposalRoom.git
cd ProposalRoom
cp .env.example .env.local
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Demo login:** `demo@proposalroom.app` / `demo1234`

---

## ðŸ§ª Scripts e Testes / Scripts and Testing

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run seed
```

---

## ðŸ’³ Planos

| Plano | PreÃ§o | Destaques |
|------|------|-----------|
| Starter | GrÃ¡tis | 3 propostas ativas, marca ProposalRoom |
| Pro | R$ 89/mÃªs | 30 propostas, remove marca, analytics |
| Business | R$ 249/mÃªs | ilimitado, domÃ­nio, automaÃ§Ãµes |

---

## ðŸ§­ Roadmap

* **MVP:** brief, proposta, sala pÃºblica, aceite, billing mock, docs
* **Fase 2:** Supabase real, Resend, domÃ­nio customizado, templates compartilhÃ¡veis, admin
* **Fora do MVP:** app nativo, marketplace, multi-idioma completo

---

## ðŸ’¼ Valor para PortfÃ³lio / Portfolio Value

- Produto SaaS monetizÃ¡vel com UX editorial
- Arquitetura de billing defensÃ¡vel
- Fluxo completo autenticado + pÃ¡gina pÃºblica
- DocumentaÃ§Ã£o de deploy e ativaÃ§Ã£o de cobranÃ§a

Guia: [docs/portfolio.md](./docs/portfolio.md) Â· Vendas: [docs/sell.md](./docs/sell.md)

---

## ðŸ“š DocumentaÃ§Ã£o Complementar

- [docs/architecture.md](./docs/architecture.md)
- [docs/deploy-vercel.md](./docs/deploy-vercel.md)
- [docs/supabase.md](./docs/supabase.md)
- [docs/stripe.md](./docs/stripe.md)
- [docs/mercadopago.md](./docs/mercadopago.md)
- [docs/launch-checklist.md](./docs/launch-checklist.md)
- [docs/handoff.md](./docs/handoff.md)

---

## ðŸ–¼ï¸ GitHub Social Preview

```txt
assets/social-preview.svg
```

DimensÃ£o recomendada para PNG final: 1280x640. Upload em Repository Settings â†’ Social Preview.

---

## ðŸ”– GitHub Repository Metadata

### About sugerido
```txt
Commercial proposal generator with client room, digital acceptance, follow-up and billing-ready SaaS.
```

### Topics sugeridos
```txt
nextjs
typescript
saas
billing
stripe
mercadopago
supabase
proposals
portfolio
vercel
tailwindcss
```

---

## ðŸ‘¤ Autor / Author

Desenvolvido por **Felipe Alirio Baruja**.

- **Portfolio:** [barujafe.vercel.app](https://barujafe.vercel.app/)
- **GitHub:** [@BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [Gustavo Felipe Alirio Baruja](https://www.linkedin.com/in/barujafe/)

---

## ðŸ“„ LicenÃ§a / License

MIT License. Copyright (c) 2026 Felipe Alirio Baruja.


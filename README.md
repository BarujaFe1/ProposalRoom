<div align="center">
  <img src="./assets/icon.svg" alt="ProposalRoom Logo" width="120" height="120" />

  <h1>ProposalRoom</h1>

  <p><strong>Gerador de propostas comerciais com sala do cliente, aceite digital, follow-up e cobrança pronta.</strong></p>
  <p><strong>Commercial proposal generator with client room, digital acceptance, follow-up and billing-ready SaaS.</strong></p>

  <p>
    <a href="https://proposalroom-lab.vercel.app"><strong>Abrir demo</strong></a> •
    <a href="#1-visão-geral--overview">PT-BR / English Overview</a> •
    <a href="#-product-preview">Preview</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#️-stack--tecnologias">Stack</a> •
    <a href="#-arquitetura--architecture">Architecture</a> •
    <a href="#-quick-start--início-rápido">Quick Start</a> •
    <a href="#-autor--author">Author</a>
  </p>

  <p>
    <a href="https://proposalroom-lab.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-proposalroom--lab.vercel.app-22C55E?style=for-the-badge" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Schema%20Ready-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img alt="Billing Mock" src="https://img.shields.io/badge/Billing-Mock%20Lab-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-Unit%20Tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
    <img alt="CI" src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
    <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.svg" alt="ProposalRoom product overview" width="100%" />
</p>

---

## Live Demo (Lab)

**URL estável:** [https://proposalroom-lab.vercel.app](https://proposalroom-lab.vercel.app)

| | |
|---|---|
| **Abrir demo** | [proposalroom-lab.vercel.app](https://proposalroom-lab.vercel.app) |
| **Login** | `demo@proposalroom.app` |
| **Senha** | `demo1234` |
| **Modo** | Lab only — billing mock, sem pagamento real |

> Portfolio lab: use o botão **Abrir demo** apenas com esta URL estável. Aceite digital e checkout são simulados.

---

## 1. Visão Geral / Overview

O **ProposalRoom** é um SaaS para transformar um brief em uma proposta comercial elegante, com sala do cliente, aceite digital, lembretes e cobrança preparada para produção.

Ele foi desenhado para prestadores de serviço, designers, agências, arquitetos, assistência técnica e consultorias que precisam fechar propostas com clareza, evidência e fluxo real — sem dashboard decorativo.

O projeto foi desenvolvido por **Felipe Alirio Baruja** como peça de portfólio premium (lab), pronta para publicação e evolução para produto pago.

> **Product Notice**  
> O MVP roda com demo DB in-memory e `BILLING_PROVIDER=mock` para funcionar sem credenciais. Schema Supabase, adapters Stripe/Mercado Pago e webhooks idempotentes já estão no repositório.

---

## ✨ Product Preview

<p align="center">
  <img src="./assets/screenshots/01-dashboard.svg" alt="ProposalRoom Dashboard" width="100%" />
</p>

O ProposalRoom apresenta uma experiência editorial e luxuosa: proposta como landing page, workspace real, limites por plano e upgrade com billing preparado (mock no lab).

---

## 2. Por que este projeto importa? / Why this project matters

* **Propostas ainda são PDF estático:** o cliente precisa de uma sala clara para ler, aceitar e pagar.
* **Times enxutos precisam de velocidade:** do brief à proposta em minutos, com IA e templates.
* **Cobrança não pode ser afterthought:** entitlements, webhooks e portal do cliente já fazem parte do MVP.
* **Portfólio defensável:** arquitetura limpa, testes, docs de deploy e caminho para produção.

---

## 🧠 O diferencial do ProposalRoom / What makes ProposalRoom different

### Português
Não é um gerador de texto solto. É um fluxo comercial completo:
- brief → seções editoriais;
- página pública protegida por token;
- aceite + CTA de pagamento;
- status, lembretes e exportação;
- gating por plano no backend e na UI.

### English
Not just a text generator. It is a full commercial flow:
- brief → editorial sections;
- token-protected public page;
- acceptance + payment CTA;
- status, reminders and export;
- plan gating on backend and UI.

---

## 🎯 Problema que resolve / The problem it solves

Em operações reais de serviço:
- propostas demoram para sair;
- o cliente não sabe onde aceitar;
- follow-up some no WhatsApp;
- cobrança fica desconectada do documento;
- limites de plano não existem até o caos.

O **ProposalRoom** organiza brief, proposta, sala do cliente, aceite e billing em um único produto.

---

## 🧩 Proposta / Product Pipeline

```txt
Brief do cliente
  ↓
Geração de proposta (gerador local no lab · adapters de IA preparados)
  ↓
Edição e envio
  ↓
Sala pública protegida
  ↓
Aceite digital
  ↓
CTA de pagamento (mock no lab)
  ↓
Status + lembretes + export CSV
  ↓
Upgrade / Billing (mock → Stripe / Mercado Pago)
```

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/01-dashboard.svg" alt="Dashboard" />
      <br />
      <sub><strong>Dashboard</strong> — propostas ativas, plano, uso de IA e lista operacional.</sub>
    </td>
    <td width="50%">
      <img src="./assets/screenshots/02-client-room.svg" alt="Client Room" />
      <br />
      <sub><strong>Sala do cliente</strong> — proposta editorial, aceite e CTA de pagamento.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/03-upgrade-billing.svg" alt="Upgrade and Billing" />
      <br />
      <sub><strong>Upgrade & Billing</strong> — limites, planos Pro/Business e portal do cliente.</sub>
    </td>
    <td width="50%">
      <img src="./assets/architecture-pipeline.svg" alt="Architecture" />
      <br />
      <sub><strong>Architecture</strong> — Next.js, billing adapters, Supabase-ready schema.</sub>
    </td>
  </tr>
</table>

---

## 📌 Estudo de Caso / Case Study

### 📌 Estudo de Caso: Atelier Norte
O seed demo simula o workspace **Atelier Norte** com 3 propostas ativas no plano Starter, template editorial e clientes realistas (Casa Aurora, Studio Lume, Oficina Verde). Ao tentar a 4ª proposta, o gating exige upgrade — exatamente o momento de monetização.

### 📌 Case Study: Atelier Norte
The demo seed simulates the **Atelier Norte** workspace with 3 active Starter proposals, an editorial template and realistic clients. Creating a 4th proposal triggers upgrade gating — the monetization moment.

---

## 🧭 Visual Story / Jornada do Produto

```txt
1. Abrir https://proposalroom-lab.vercel.app
2. Entrar com demo@proposalroom.app / demo1234
3. Ver dashboard com seed realista
4. Criar proposta a partir de um brief
5. Enviar e abrir a sala pública
6. Aceitar e **simular pagamento (lab)** na própria sala
7. Atingir limite Starter e ir para /app/upgrade
8. Simular checkout mock e portal de billing
```

---

## O que este projeto demonstra

- Domínio comercial completo (não só UI): brief → proposta → aceite → status → upgrade
- Entitlements e limites de plano no backend
- Webhooks de billing idempotentes (padrão de SaaS)
- Auth com senha hasheada (scrypt) + JWT verificado no middleware
- Demo pública estável sem cobrança real
- Documentação de arquitetura, decisões, testes e deploy

## Como eu apresentaria em entrevista

1. **Problema:** proposta em PDF + WhatsApp = aceite e cobrança desconectados  
2. **Solução:** sala do cliente com aceite digital e fluxo de pagamento (mock no lab)  
3. **Momento SaaS:** 4ª proposta no Starter força upgrade — monetização explícita  
4. **Arquitetura:** adapters de billing + entitlements + webhook router  
5. **Honestidade de lab:** in-memory DB, gerador local, billing mock — schema Supabase e Stripe/MP prontos para evolução  

---

## ⚙️ Funcionalidades Principais / Core Features

### Brief → Proposta
Gera seções editoriais a partir do brief (gerador local no lab), com validação Zod e contagem de uso.

### Sala do Cliente
Página pública `/r/[token]` (token opaco no path). Links legados `/p/[slug]?token=` redirecionam. Aceite digital e **pagamento simulado in-app**.

### Persistência
SQLite (libsql) em arquivo local; Turso opcional para demo multi-instância na Vercel.

### Billing Ready (Lab = mock)
Adapters `mock`, `stripe`, `mercadopago`, `pagarme`, plans, entitlements e webhook idempotente. No lab público: apenas mock.

### Plan Guards
Limites de propostas ativas, templates, remoção de marca, analytics e automações.

### Export
CSV simples das propostas do workspace.

---

## Trade-offs

| Escolha | Ganho | Custo |
|---------|-------|-------|
| SQLite file (libsql) | Persiste entre restarts locais | Sem Turso, instâncias Vercel não compartilham DB |
| Mock billing | Zero risco de cobrança | Checkout real exige SDK |
| Gerador local | Demo determinística | Não é LLM ao vivo no lab |
| Token opaco no path `/r/…` | Menos vazamento via query/Referer | Continua sendo bearer secret na URL |

Detalhes: [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

---

## Status atual

**Lab / Live Demo** em Vercel (`proposalroom-lab`). Persistência SQLite local + E2E na CI. Billing mock. Redeploy necessário após merge desta branch para o demo público refletir SQLite/links `/r/…`.

---

## Variáveis de ambiente

Veja [`.env.example`](./.env.example). Mínimo para lab:

```bash
DEMO_MODE=true
BILLING_PROVIDER=mock
AI_PROVIDER=mock
EMAIL_PROVIDER=mock
AUTH_SECRET=<32+ chars>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ProposalRoom
# opcional: SQLITE_PATH=.data/proposalroom.db
# opcional (Vercel multi-instância): TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
```

---

## 🛠️ Stack / Tecnologias

### Frontend
- **Framework:** Next.js 15 (App Router) & React 19
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **UI:** componentes próprios + Lucide

### Backend / Platform
- **Auth demo:** JWT httpOnly (`jose`) + scrypt password hashes
- **Data:** SQLite via libsql (arquivo local / Turso opcional) + schema Supabase documentado para evolução
- **Geração:** local no lab; adapters de IA documentados
- **Billing:** Stripe / Mercado Pago / Pagar.me adapters (mock no lab)
- **Testes:** Vitest + Playwright (E2E na CI)
- **CI:** GitHub Actions (lint, typecheck, test, build, e2e)
- **Deploy:** Vercel (`proposalroom-lab`)

---

## 🧱 Arquitetura / Architecture

```text
ProposalRoom/
├── src/
│   ├── app/                      # Landing, auth, app, public room, APIs
│   ├── billing/                  # providers, plans, entitlements, webhooks
│   ├── components/               # UI + app shell
│   └── lib/                      # auth, db demo, proposals, utils
├── supabase/schema.sql           # Postgres + RLS
├── docs/                         # audit, architecture, testing, deploy, handoff
├── tests/                        # unit tests
├── e2e/                          # Playwright critical flow
├── .github/workflows/ci.yml
├── assets/                       # icon, hero, screenshots placeholders
└── README.md
```

Detalhes em [docs/architecture.md](./docs/architecture.md).

---

## 🧱 Visual Architecture

<p align="center">
  <img src="./assets/architecture-pipeline.svg" alt="ProposalRoom visual architecture" width="100%" />
</p>

---

## 🚀 Quick Start / Início Rápido

### Live Demo (recomendado)
Abra [https://proposalroom-lab.vercel.app](https://proposalroom-lab.vercel.app)  
Login: `demo@proposalroom.app` / `demo1234`

### Local

```bash
git clone https://github.com/BarujaFe1/ProposalRoom.git
cd ProposalRoom
cp .env.example .env.local
# defina AUTH_SECRET com 32+ caracteres
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## 🧪 Scripts e Testes / Scripts and Testing

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run seed
# opcional:
# npm install -D @playwright/test && npx playwright install chromium
# npm run test:e2e
```

Guia: [docs/TESTING.md](./docs/TESTING.md)

---

## 💳 Planos

| Plano | Preço | Destaques |
|------|------|-----------|
| Starter | Grátis | 3 propostas ativas, marca ProposalRoom |
| Pro | R$ 89/mês | 30 propostas, remove marca, analytics |
| Business | R$ 249/mês | ilimitado, domínio, automações |

No lab público a cobrança permanece **mock**.

---

## 🧭 Roadmap

* **MVP / Lab:** brief, proposta, sala pública, aceite, billing mock, docs, live demo, CI
* **Fase 2:** Supabase real, Resend, domínio customizado, templates compartilháveis, admin
* **Fora do MVP:** app nativo, marketplace, multi-idioma completo

---

## 💼 Valor para Portfólio / Portfolio Value

- Produto SaaS monetizável com UX editorial
- Arquitetura de billing defensável
- Fluxo completo autenticado + página pública
- Live demo estável para recrutadores

Guia: [docs/portfolio.md](./docs/portfolio.md) · Vendas: [docs/sell.md](./docs/sell.md)

---

## 📚 Documentação Complementar

- [docs/AUDIT_REPORT.md](./docs/AUDIT_REPORT.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)
- [docs/TESTING.md](./docs/TESTING.md)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- [docs/deploy-vercel.md](./docs/deploy-vercel.md)
- [docs/supabase.md](./docs/supabase.md)
- [docs/stripe.md](./docs/stripe.md)
- [docs/mercadopago.md](./docs/mercadopago.md)
- [docs/launch-checklist.md](./docs/launch-checklist.md)
- [docs/HANDOFF.md](./docs/HANDOFF.md)

---

## 🖼️ GitHub Social Preview

```txt
assets/social-preview.svg
```

---

## 🔖 GitHub Repository Metadata

### About sugerido
```txt
Commercial proposal generator with client room, digital acceptance, follow-up and billing-ready SaaS.
```

### Homepage
```txt
https://proposalroom-lab.vercel.app
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

## 👤 Autor / Author

Desenvolvido por **Felipe Alirio Baruja**.

- **Portfolio:** [barujafe.vercel.app](https://barujafe.vercel.app/)
- **GitHub:** [@BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [Gustavo Felipe Alirio Baruja](https://www.linkedin.com/in/barujafe/)

---

## 📄 Licença / License

MIT License. Copyright (c) 2026 Felipe Alirio Baruja.

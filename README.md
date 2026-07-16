<div align="center">
  <img src="./assets/icon.svg" alt="ProposalRoom Logo" width="120" height="120" />

  <h1>ProposalRoom</h1>

  <p><strong>Gerador de propostas comerciais com sala do cliente, aceite digital, follow-up e billing-ready SaaS.</strong></p>
  <p><strong>Commercial proposal generator with client room, digital acceptance, follow-up and billing-ready SaaS.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#en">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack--tecnologias">Stack</a> ·
    <a href="#arquitetura--architecture">Architecture</a> ·
    <a href="#quick-start--início-rápido">Quick Start</a> ·
    <a href="#autor--author">Author</a>
  </p>

  <p>
    <a href="https://proposalroom-lab.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-proposalroom--lab.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20demo-2563EB?style=for-the-badge" />
    <img alt="MIT" src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" />
  </p>

  <p>
    <a href="https://proposalroom-lab.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/ProposalRoom"><strong>Repositório</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfólio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.svg" alt="ProposalRoom overview" width="100%" />
</p>

---

<a id="pt-br"></a>

## PT-BR

## Visão geral

**ProposalRoom** gera propostas comerciais com sala do cliente, aceite digital, follow-up e base billing-ready. Lab SaaS — use DEMO_MODE=true localmente.

> **Aviso de lab:** demo de portfólio com dados sintéticos/amostra. Não é produto em produção com SLA, integrações reais de clientes ou garantia operacional.

---

## Problema

Propostas vivem em PDF solto: sem sala do cliente, sem aceite rastreável e sem caminho claro para billing.

---

## Para quem

- Freelancers e agências comerciais
- Closers que precisam de aceite digital
- Builders de micro-SaaS B2B

---

## Funcionalidades

- Geração de proposta
- Sala do cliente
- Aceite digital
- Follow-up
- Billing adapters (mock/Stripe/MP)
- Seed script e testes Vitest

---

## Escopo e limites

- **É:** lab SaaS de propostas + aceite.
- **Não é:** CRM completo, ERP, assinatura ICP-Brasil, gateway de pagamento real na demo pública.

---

<a id="en"></a>

## English

## Overview

**ProposalRoom** generates commercial proposals with a client room, digital acceptance, follow-up and billing-ready foundations. SaaS lab — use DEMO_MODE=true locally.

> **Lab notice:** portfolio demo with synthetic/sample data. Not a production product with SLA, real customer integrations, or operational guarantees.

---

## Problem

Proposals live as loose PDFs: no client room, no traceable acceptance and no clear path to billing.

---

## Who it is for

- Freelancers and commercial agencies
- Closers who need digital acceptance
- B2B micro-SaaS builders

---

## Features

- Proposal generation
- Client room
- Digital acceptance
- Follow-up
- Billing adapters (mock/Stripe/MP)
- Seed script and Vitest tests

---

## Scope and limits

- **Is:** proposals + acceptance SaaS lab.
- **Is not:** full CRM, ERP, ICP-Brasil signature, real payment gateway on the public demo.

---

<a id="live-demo"></a>

## Live Demo

**URL:** [https://proposalroom-lab.vercel.app](https://proposalroom-lab.vercel.app)

Demo hospedada para avaliação de portfólio / Hosted for portfolio review.

> Lab demo — synthetic / sample data unless noted. Not a production SLA product.

---

<a id="stack--tecnologias"></a>

## Stack / Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Next.js 15.5 / React 19 / TypeScript | App |
| Tailwind CSS 4 / Lucide | UI |
| Zod / jose / nanoid | Validação, JWT demo, IDs |
| Vitest / Playwright (e2e) | Testes |
| Supabase schema (opcional) | Persistência |

---

<a id="arquitetura--architecture"></a>

## Arquitetura / Architecture

App Next.js com src/app, src/billing, src/components, src/lib, schema Supabase e docs de deploy.

`	xt
ProposalRoom/
├── src/
│   ├── app/
│   ├── billing/
│   ├── components/
│   └── lib/
├── supabase/schema.sql
├── scripts/seed.ts
├── tests/
├── e2e/
├── assets/
├── docs/
├── .env.example
└── vercel.json
`

---

<a id="quick-start--início-rápido"></a>

## Quick Start / Início rápido

### Pré-requisitos / Requirements

- Node.js 20+
- npm
- (Opcional) Supabase local/remoto

### Clonar / Clone

`ash
git clone https://github.com/BarujaFe1/ProposalRoom.git
cd ProposalRoom
`

### Setup

`ash
cp .env.example .env.local
# DEMO_MODE=true e BILLING_PROVIDER=mock para lab sem secrets
npm install
npm run dev
`

Abra http://localhost:3000

`ash
npm run seed   # dados de demonstração
npm run test
npm run typecheck
`


---

## Technical decisions / Decisões técnicas

- **Sala do cliente + aceite** como núcleo, não só PDF.
- **Billing-ready** com provider mock na demo.
- **Sem secrets** no repositório — só .env.example.

---

## Roadmap

### Implementado
- Proposta, sala, aceite, follow-up, billing mock, demo lab URL

### Planejado
- Mais templates comerciais
- Assinatura visual aprimorada
- Relatórios de conversão

---

<a id="autor--author"></a>

## Autor / Author

Developed by **Felipe Alirio Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)
- **Repository:** [github.com/BarujaFe1/ProposalRoom](https://github.com/BarujaFe1/ProposalRoom)

---

## License / Licença

MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p><strong>ProposalRoom</strong></p>
  <p>Propostas com sala do cliente e aceite digital.</p>
  <p><em>Proposals with a client room and digital acceptance.</em></p>
</div>

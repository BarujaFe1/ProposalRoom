# Deployment

## Live Demo (lab)

**Stable URL:** https://proposalroom-lab.vercel.app  

Do **not** use `proposalroom.vercel.app` (legacy / empty).

| | |
|---|---|
| Login | `demo@proposalroom.app` |
| Password | `demo1234` |
| Mode | `DEMO_MODE=true`, `BILLING_PROVIDER=mock` |

## Vercel

1. Link GitHub repo `BarujaFe1/ProposalRoom`
2. Framework: Next.js
3. Set production env (names):

```
NEXT_PUBLIC_APP_URL=https://proposalroom-lab.vercel.app
NEXT_PUBLIC_APP_NAME=ProposalRoom
DEMO_MODE=true
AUTH_SECRET=<random 32+ chars>
BILLING_PROVIDER=mock
AI_PROVIDER=mock
EMAIL_PROVIDER=mock
```

4. Deployment Protection / SSO: **OFF** for public portfolio access
5. Deploy production from `main` (or promote a preview)

More detail: [deploy-vercel.md](./deploy-vercel.md)

## Local

```bash
cp .env.example .env.local
# set AUTH_SECRET to any 32+ char string
npm install
npm run dev
```

Open http://localhost:3000

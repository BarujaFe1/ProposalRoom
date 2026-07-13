# Handoff — portfolio quality pass

## What we found

- Strong commercial flow and billing/entitlements architecture for a lab SaaS.
- Trust gaps: plaintext passwords, cookie presence-only middleware, dead payment URLs, no CI, AI/Supabase overclaim risk, no mobile app nav.
- `test:e2e` referenced Playwright without guaranteeing the dependency on clean installs.

## What we fixed

- scrypt password hashing (seed + signup + login)
- Middleware JWT verification, invalid cookie clear, `/onboarding` auth gate
- In-app mock payment (`POST /api/public/pay`) — no external dead checkout
- Mobile drawer navigation
- Localized proposal status labels
- Public room uses workspace `brandColor`
- Honest landing/copy for local generator + mock billing
- Webhook signature default only for mock provider
- Unit tests: `tests/auth-proposals.test.ts`
- CI: `.github/workflows/ci.yml`
- Docs: `AUDIT_REPORT.md`, `TECHNICAL_DECISIONS.md`, `TESTING.md`, this handoff

## What we improved

- Portfolio narrative honesty (lab / mock / local generator)
- DX: env helper (`src/lib/env.ts`), clearer testing docs
- UX for phone demos and client payment simulation

## Commands run

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

(Re-run after this pass before merge.)

## Tests executed

- Vitest: entitlements, webhook-router, auth-proposals
- Next production build (all routes)

## Still missing (honest backlog)

- Persist to Supabase (schema exists, client not wired)
- Real Stripe/MP HMAC + SDK checkout
- Real email reminders
- Playwright in CI with cached browsers
- Real product screenshots (SVG placeholders remain)
- Rate limiting / CSRF on public accept/pay

## Remaining risks

- Serverless in-memory DB resets (lab only)
- Public tokens in query strings
- Non-mock billing adapters still stubs if credentials are set without SDK wiring

## Next steps

1. Merge `chore/portfolio-quality-pass` after CI green
2. Smoke Live Demo: login → proposals → client room → accept → simulate pay
3. Optionally add `@playwright/test` and run `npm run test:e2e`
4. Keep portfolio card pointing at `https://proposalroom-lab.vercel.app`

## Portfolio suggestions

- Interview story: “PDF estático → sala com aceite + entitlements”
- Show entitlements + webhook idempotency as the senior slice
- Explicitly say lab = mock billing, local generator, in-memory DB

## Suggested commit message

```
chore: improve portfolio quality, docs, tests and stability
```

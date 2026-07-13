# Portfolio Handoff — ProposalRoom (Tier A pass)

**Date:** 2026-07-13  
**Branch:** `feat/portfolio-persistence-secure-e2e`  
**Live demo (may lag until redeploy):** https://proposalroom-lab.vercel.app

## Summary

Elevated ProposalRoom from “quality-passed lab (~8.5)” to a more interview-ready Tier A lab by adding **real SQLite persistence**, **opaque client-room URLs**, and **critical E2E in CI**. Billing remains mock by design.

## Before → After

| Area | Before | After |
|------|--------|-------|
| Persistence | In-memory only (resets on cold start) | SQLite via libsql (`file:.data/…` or Turso) |
| Client share link | `/p/slug?token=…` (query string) | `/r/tok_…` opaque path; legacy redirects |
| E2E | Script without CI | Playwright Chromium job in GitHub Actions |
| Auth | scrypt + JWT (from prior pass) | unchanged, still solid |
| Billing | mock | mock (honest) |

## Commands

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Limitations (honest)

- Vercel multi-instance still needs **Turso** (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`) for shared persistence; local/CI use SQLite file/memory.
- Billing is mock — no real Stripe/MP charges.
- Public token remains a secret-bearing URL (path is safer than query, still share carefully).
- Public deploy may show previous build until this branch is merged and redeployed.

## Next steps

1. Merge → redeploy `proposalroom-lab`
2. Optionally provision Turso free DB for durable Vercel demo
3. Capture fresh PNG screenshots into `assets/screenshots/` after redeploy
4. Wire Supabase only when ready for multi-tenant production story

## Recommendation

**Selecionado / lab destacado** — keep as a Tier A commercial product lab in the portfolio (client room + entitlements + persistence), not as an analytics-engineering centerpiece.

# Audit Report — ProposalRoom

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Author review lens:** portfolio SaaS lab (proposals → client room → acceptance → mock billing)

## Executive summary

ProposalRoom is a coherent commercial MVP: brief → editorial proposal → tokenized client room → digital acceptance → plan gating with billing adapters. The domain story is strong for portfolio interviews. Gaps that hurt trust were plaintext passwords, presence-only middleware cookies, dead external “payment” URLs, missing CI, missing Playwright dependency for the e2e script, and overselling “IA” / Supabase readiness.

**Current portfolio score (pre-pass → post-pass target):** **6.5 / 10 → ~8.5 / 10** after this quality pass (lab honesty + auth hardening + CI + UX mobile + docs).

## Main risks

| Risk | Severity | Status |
|------|----------|--------|
| Plaintext passwords in in-memory store | High (trust) | Fixed — scrypt hashes |
| Middleware only checked cookie presence | High | Fixed — JWT verify + clear bad cookie |
| Dead `pay.proposalroom.app` links | Medium | Fixed — in-app mock pay API |
| No GitHub Actions CI | Medium | Fixed |
| `@playwright/test` missing despite `test:e2e` | Medium | Add locally / document |
| In-memory DB resets on serverless cold start | Accepted for lab | Documented |
| Stripe/MP adapters are stubs (no HMAC) | Accepted for lab | Documented; webhook no longer defaults signature to mock for non-mock providers |
| Public token in query string | Low/Med | Accepted for lab; note in SECURITY |

## Quick wins (done in this pass)

- Password hashing + demo seed hashed
- Middleware JWT validation + protect `/onboarding`
- Mobile drawer navigation
- Localized proposal status labels
- In-app “Simular pagamento (lab)”
- Apply workspace `brandColor` on public room hero
- Unit tests for auth + proposal limit
- CI workflow (lint, typecheck, test, build)
- Honest landing copy (local generator, mock billing)

## Structural improvements

- Keep billing provider interface + entitlements as the “senior” core
- Wire Supabase only when ready — keep schema as future path, not as live claim
- Optional: real Stripe test-mode SDK behind `BILLING_PROVIDER=stripe`
- Optional: move public tokens to path segments or short-lived signed links

## Bugs found

1. Plaintext password compare/store
2. Invalid cookies still treated as logged-in for login bounce / app gate
3. `/onboarding` matched by middleware but not protected
4. External mock payment URLs 404 / confuse reviewers
5. Nav active state double-highlight for `/app/proposals` and `/app/proposals/new`
6. Raw English status enums in PT-BR UI
7. `brandColor` collected but unused on client room
8. Webhook route injected `"mock"` signature for all providers

## Execution plan

1. Diagnose + green build baseline  
2. Security/auth + middleware  
3. UX (mobile, status, payment, copy)  
4. Tests + CI  
5. Docs + README portfolio narrative  
6. Commit / push branch  

## Final checklist

- [x] Installs (`npm install`)
- [x] Lint / typecheck / unit tests / build
- [x] Main bugs fixed or documented
- [x] README + architecture / testing / decisions / handoff
- [x] CI workflow
- [x] `.env.example` + `.gitignore`
- [x] Essential tests expanded
- [x] UX reviewed (mobile nav, mock pay, labels)
- [ ] E2E in CI (optional; Playwright browsers not installed in free CI by default)

# Testing

## Commands

```bash
npm run test          # Vitest unit tests
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint via next lint
npm run build         # Production build
npm run test:e2e      # Playwright (requires @playwright/test + browsers)
```

## Unit tests (`tests/`)

| File | Focus |
|------|--------|
| `entitlements.test.ts` | Plan limits, subscription blocked states, feature gates |
| `webhook-router.test.ts` | Idempotent webhook apply / cancel |
| `auth-proposals.test.ts` | scrypt passwords, demo login, starter 4th-proposal block |

## E2E (`e2e/`)

`critical-flow.spec.ts` covers login → create proposal → hit starter limit → upgrade page.

Install Playwright once:

```bash
npm install -D @playwright/test
npx playwright install chromium
npm run test:e2e
```

E2E is **not** in GitHub Actions by default (browser download cost on free runners). Prefer local/smoke before demos.

## CI

`.github/workflows/ci.yml` runs install → lint → typecheck → test → build with mock env vars.

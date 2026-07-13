# Technical Decisions

## In-memory database for the lab

**Decision (superseded 2026-07-13):** Replaced process-global memory with **SQLite via libsql**.  
**Why now:** Interviewers correctly flag cold-start data loss on Vercel/local restart.  
**How:** Write-through cache + `file:.data/proposalroom.db` locally; optional `TURSO_*` for multi-instance.  
**Trade-off:** Without Turso, serverless instances do not share one DB. Documented honestly.

## Opaque client-room tokens

**Decision:** Share links use `/r/{publicToken}` instead of `/p/{slug}?token=`.  
**Why:** Query-string tokens leak via Referer/logs more easily.  
**Trade-off:** Token is still a bearer secret in the URL path — acceptable for lab, not for regulated data.

## Mock billing by default

**Decision:** `BILLING_PROVIDER=mock` with Stripe/MercadoPago adapter *shapes* ready.  
**Why:** Portfolio must never charge real cards; entitlements and webhooks still demonstrate SaaS architecture.  
**Trade-off:** Checkout for non-mock providers returns placeholder URLs until SDKs are wired.  
**Lab UX:** Client payment is simulated in-app via `/api/public/pay`.

## Local proposal generator (not a live LLM)

**Decision:** `generateProposalSections` builds editorial sections from the brief without calling OpenAI/xAI in the lab.  
**Why:** Deterministic demos, no API keys, no surprise costs. Entitlement counters still model “generation” limits.  
**Trade-off:** Do not market the lab as a live AI product. Adapters remain documented for production.

## Password hashing with scrypt

**Decision:** Store `scrypt$salt$hash` even in the demo DB.  
**Why:** Plaintext passwords destroy portfolio trust in a security-aware interview.  
**Trade-off:** Slightly slower seed; demo credentials remain `demo@proposalroom.app` / `demo1234`.

## JWT session cookies

**Decision:** HS256 JWT in `pr_session` httpOnly cookie; middleware verifies signature.  
**Why:** Edge-compatible with `jose`; invalid cookies are cleared.  
**Trade-off:** Middleware cannot load user from DB; page layouts still call `getCurrentUser`.

## Public proposal token in query string

**Decision:** `/p/[slug]?token=…` for shareable client links.  
**Why:** Simple demo sharing.  
**Trade-off:** Tokens may leak via Referer; fine for lab, not for regulated production without signed short links.

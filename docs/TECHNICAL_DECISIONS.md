# Technical Decisions

## In-memory database for the lab

**Decision:** Use a process-global in-memory store (`src/lib/db.ts`) with a seeded demo workspace.  
**Why:** Zero credentials to run the Live Demo; fastest path for portfolio reviewers.  
**Trade-off:** State does not survive cold starts or multi-instance serverless. Acceptable for `DEMO_MODE=true`.  
**Next:** Wire `supabase/schema.sql` with `@supabase/ssr` when persistence is required.

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

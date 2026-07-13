# Changelog — portfolio Tier A improvements

## 2026-07-13

### Added
- SQLite persistence via `@libsql/client` (local file `.data/proposalroom.db`, optional Turso)
- Opaque client-room routes `/r/[token]`
- E2E job in GitHub Actions (Playwright Chromium)
- Docs: `PORTFOLIO_HANDOFF.md`, `SCREENSHOTS.md`, technical decision updates

### Changed
- Legacy `/p/[slug]?token=` redirects to `/r/[token]`
- Public accept/pay APIs take `{ token }` only
- Share links no longer use query-string secrets

### Fixed
- Demo state loss across local restarts (file DB)
- Referer leakage risk from `?token=` query params

### Notes
- Billing remains mock
- Redeploy required for live demo to pick up changes

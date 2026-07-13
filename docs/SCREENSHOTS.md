# Screenshot capture guide

## Demo credentials (synthetic)

- Email: `demo@proposalroom.app`
- Password: `demo1234`
- No real PII — seed clients are fictional.

## Shots to capture (desktop 1440×900 + mobile 390×844)

1. **Landing** `/` — brand + Lab only note  
2. **Dashboard** `/app` — Atelier Norte metrics  
3. **Proposals list** `/app/proposals` — localized statuses  
4. **Client room** `/r/tok_casa_aurora_demo` — accept CTA  
5. **Upgrade** `/app/upgrade` — plan cards  

## Commands

```bash
npm run build && npm run start
# then use browser DevTools or Playwright:
npx playwright screenshot http://127.0.0.1:3000/login assets/screenshots/00-login.png
```

Replace SVG placeholders under `assets/screenshots/` when PNGs are ready. Keep filenames stable for README.

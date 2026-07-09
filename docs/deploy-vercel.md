# Deploy na Vercel

1. Importe o repositório `BarujaFe1/ProposalRoom` na Vercel.
2. Framework preset: **Next.js**.
3. Configure as env vars de `.env.example` (mínimo: `NEXT_PUBLIC_APP_URL`, `AUTH_SECRET`, `BILLING_PROVIDER=mock`).
4. Deploy.
5. Após o domínio ficar ativo, atualize `NEXT_PUBLIC_APP_URL`.
6. Para billing real, troque `BILLING_PROVIDER` e adicione secrets do provider.
7. Aponte o webhook do provider para `https://SEU_DOMINIO/api/webhooks/billing`.

## Checklist pós-deploy

- [ ] `/` carrega
- [ ] `/login` com demo funciona
- [ ] criar proposta
- [ ] abrir sala pública
- [ ] aceite + CTA pagamento
- [ ] `/app/billing` e `/app/upgrade`
- [ ] webhook de teste responde 200

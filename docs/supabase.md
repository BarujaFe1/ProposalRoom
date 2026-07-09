# Guia Supabase

1. Crie um projeto Supabase.
2. Rode `supabase/schema.sql` no SQL Editor.
3. Ative Auth (e-mail/senha).
4. Copie URL, anon key e service role para `.env`.
5. Confirme RLS nas tabelas de workspace/propostas.
6. (Opcional) Crie bucket Storage `proposal-attachments`.

No MVP atual, a app roda com **demo DB in-memory** para portfólio e E2E sem credenciais. O schema e as env vars já estão preparados para a troca.

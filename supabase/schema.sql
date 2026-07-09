-- ProposalRoom schema (Supabase Postgres)
-- Apply via Supabase SQL editor or migration tooling.

create extension if not exists "pgcrypto";

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null,
  plan_id text not null default 'starter',
  subscription_status text not null default 'active',
  billing_customer_id text,
  brand_color text not null default '#1F3A2E',
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price_monthly_cents integer not null,
  limits jsonb not null
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null,
  provider text not null,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_events (
  id text primary key,
  provider text not null,
  event_type text not null,
  workspace_id uuid,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null,
  provider_customer_id text not null,
  email text not null,
  unique (provider, provider_customer_id)
);

create table if not exists public.usage_counters (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  active_proposals integer not null default 0,
  templates integer not null default 0,
  ai_generations_this_month integer not null default 0,
  month_key text not null
);

create table if not exists public.feature_entitlements (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default false,
  primary key (workspace_id, feature_key)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  amount_cents integer not null,
  status text not null,
  provider_invoice_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid,
  action text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  client_name text not null,
  client_email text not null,
  brief text not null,
  status text not null,
  amount_cents integer not null,
  public_slug text not null,
  public_token text not null,
  sections jsonb not null default '[]',
  reminder_count integer not null default 0,
  payment_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (public_slug, public_token)
);

-- RLS
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.proposals enable row level security;
alter table public.audit_logs enable row level security;
alter table public.usage_counters enable row level security;

create or replace function public.is_workspace_member(ws uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

create policy workspaces_select on public.workspaces
  for select using (public.is_workspace_member(id));

create policy members_select on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));

create policy proposals_all on public.proposals
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy audit_select on public.audit_logs
  for select using (public.is_workspace_member(workspace_id));

create policy usage_select on public.usage_counters
  for select using (public.is_workspace_member(workspace_id));

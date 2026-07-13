import { nanoid } from "nanoid";
import type {
  AppDatabase,
  AuditLog,
  Proposal,
  Template,
  UsageCounters,
  User,
  Workspace,
  WorkspaceMember,
} from "@/lib/types";
import { hashPassword } from "@/lib/password";
import { getSqlClient, migrateSql, resetSqlClientForTests } from "./sqlite";

const cache = globalThis as unknown as {
  __proposalRoomCache?: AppDatabase;
  __proposalRoomReady?: Promise<void>;
};

function monthKey(d = new Date()) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function emptyDb(): AppDatabase {
  return {
    users: [],
    workspaces: [],
    members: [],
    proposals: [],
    templates: [],
    auditLogs: [],
    usage: [],
    subscriptionEvents: [],
  };
}

export function buildSeedDatabase(): AppDatabase {
  const now = new Date().toISOString();
  const ownerId = "user_demo_owner";
  const workspaceId = "ws_atelier_norte";
  const memberId = "mem_demo_owner";

  const owner: User = {
    id: ownerId,
    email: "demo@proposalroom.app",
    name: "Ana Ribeiro",
    password: hashPassword("demo1234"),
    createdAt: now,
  };

  const workspace: Workspace = {
    id: workspaceId,
    name: "Atelier Norte",
    slug: "atelier-norte",
    ownerId,
    planId: "starter",
    subscriptionStatus: "active",
    billingCustomerId: "cus_mock_atelier",
    brandColor: "#1F3A2E",
    createdAt: now,
  };

  const member: WorkspaceMember = {
    id: memberId,
    workspaceId,
    userId: ownerId,
    role: "owner",
  };

  const template: Template = {
    id: "tpl_editorial",
    workspaceId,
    name: "Proposta Editorial",
    description: "Estrutura clara para projetos de design e consultoria.",
    sections: [
      { title: "Contexto", body: "Entendemos o momento do negócio e o resultado esperado.", order: 1 },
      { title: "Escopo", body: "Entregáveis claros, prazos e responsabilidades.", order: 2 },
      { title: "Investimento", body: "Valores transparentes com opções de pagamento.", order: 3 },
    ],
    createdAt: now,
  };

  const proposals: Proposal[] = [
    {
      id: "prop_casa_aurora",
      workspaceId,
      title: "Identidade visual — Casa Aurora",
      clientName: "Marina Costa",
      clientEmail: "marina@casaaurora.com.br",
      brief: "Rebrand completo para café boutique: logo, tipografia, packaging e guidelines.",
      status: "sent",
      currency: "BRL",
      amountCents: 1850000,
      publicSlug: "casa-aurora-identidade",
      publicToken: "tok_casa_aurora_demo",
      sections: [
        { id: "sec1", title: "Visão", body: "Uma identidade editorial que traduz hospitalidade contemporânea e calor artesanal.", order: 1 },
        { id: "sec2", title: "Entregáveis", body: "Logo principal e variações, tipografia, paleta, mockups de embalagem e brand book PDF.", order: 2 },
        { id: "sec3", title: "Cronograma", body: "4 semanas: discovery → conceitos → refinamentos → entrega final.", order: 3 },
        { id: "sec4", title: "Investimento", body: "R$ 18.500 com 40% na assinatura e 60% na entrega.", order: 4 },
      ],
      templateId: template.id,
      sentAt: now,
      reminderCount: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prop_studio_lume",
      workspaceId,
      title: "Consultoria de posicionamento — Studio Lume",
      clientName: "Pedro Almeida",
      clientEmail: "pedro@studiolume.co",
      brief: "Workshop de posicionamento + playbook comercial para estúdio de arquitetura.",
      status: "viewed",
      currency: "BRL",
      amountCents: 920000,
      publicSlug: "studio-lume-posicionamento",
      publicToken: "tok_studio_lume_demo",
      sections: [
        { id: "s1", title: "Diagnóstico", body: "Mapeamento de proposta de valor, ICP e narrativa comercial.", order: 1 },
        { id: "s2", title: "Workshop", body: "Sessão presencial de 1 dia com stakeholders.", order: 2 },
        { id: "s3", title: "Playbook", body: "Documento operacional com scripts, ofertas e funil.", order: 3 },
      ],
      viewedAt: now,
      sentAt: now,
      reminderCount: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prop_oficina_verde",
      workspaceId,
      title: "Site institucional — Oficina Verde",
      clientName: "Luciana Mendes",
      clientEmail: "contato@oficinaverde.eco",
      brief: "Landing + CMS leve para assistência técnica sustentável.",
      status: "draft",
      currency: "BRL",
      amountCents: 640000,
      publicSlug: "oficina-verde-site",
      publicToken: "tok_oficina_verde_demo",
      sections: [
        { id: "o1", title: "Objetivo", body: "Converter visitas em orçamentos qualificados.", order: 1 },
        { id: "o2", title: "Escopo", body: "Home, serviços, cases, contato e painel simples.", order: 2 },
      ],
      reminderCount: 0,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const usage: UsageCounters = {
    workspaceId,
    activeProposals: proposals.filter((p) =>
      ["draft", "sent", "viewed"].includes(p.status),
    ).length,
    templates: 1,
    aiGenerationsThisMonth: 2,
    monthKey: monthKey(),
  };

  return {
    users: [owner],
    workspaces: [workspace],
    members: [member],
    proposals,
    templates: [template],
    auditLogs: [
      {
        id: nanoid(8),
        workspaceId,
        actorId: ownerId,
        action: "workspace.seeded",
        meta: { source: "demo" },
        createdAt: now,
      },
    ],
    usage: [usage],
    subscriptionEvents: [],
  };
}

async function loadFromSql(): Promise<AppDatabase | null> {
  const client = getSqlClient();
  await migrateSql(client);
  const users = await client.execute("SELECT COUNT(*) AS c FROM users");
  const count = Number(users.rows[0]?.c ?? 0);
  if (!count) return null;

  const data = emptyDb();

  for (const row of (await client.execute("SELECT * FROM users")).rows) {
    data.users.push({
      id: String(row.id),
      email: String(row.email),
      name: String(row.name),
      password: String(row.password),
      createdAt: String(row.created_at),
    });
  }
  for (const row of (await client.execute("SELECT * FROM workspaces")).rows) {
    data.workspaces.push({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      ownerId: String(row.owner_id),
      planId: String(row.plan_id) as Workspace["planId"],
      subscriptionStatus: String(row.subscription_status) as Workspace["subscriptionStatus"],
      billingCustomerId: row.billing_customer_id ? String(row.billing_customer_id) : undefined,
      brandColor: String(row.brand_color),
      createdAt: String(row.created_at),
    });
  }
  for (const row of (await client.execute("SELECT * FROM workspace_members")).rows) {
    data.members.push({
      id: String(row.id),
      workspaceId: String(row.workspace_id),
      userId: String(row.user_id),
      role: String(row.role) as WorkspaceMember["role"],
    });
  }
  for (const row of (await client.execute("SELECT * FROM templates")).rows) {
    data.templates.push({
      id: String(row.id),
      workspaceId: String(row.workspace_id),
      name: String(row.name),
      description: String(row.description),
      sections: JSON.parse(String(row.sections_json)),
      createdAt: String(row.created_at),
    });
  }
  for (const row of (await client.execute("SELECT * FROM proposals")).rows) {
    data.proposals.push({
      id: String(row.id),
      workspaceId: String(row.workspace_id),
      title: String(row.title),
      clientName: String(row.client_name),
      clientEmail: String(row.client_email),
      brief: String(row.brief),
      status: String(row.status) as Proposal["status"],
      currency: "BRL",
      amountCents: Number(row.amount_cents),
      publicSlug: String(row.public_slug),
      publicToken: String(row.public_token),
      sections: JSON.parse(String(row.sections_json)),
      templateId: row.template_id ? String(row.template_id) : undefined,
      acceptedAt: row.accepted_at ? String(row.accepted_at) : undefined,
      viewedAt: row.viewed_at ? String(row.viewed_at) : undefined,
      sentAt: row.sent_at ? String(row.sent_at) : undefined,
      paymentUrl: row.payment_url ? String(row.payment_url) : undefined,
      reminderCount: Number(row.reminder_count ?? 0),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    });
  }
  for (const row of (await client.execute("SELECT * FROM usage_counters")).rows) {
    data.usage.push({
      workspaceId: String(row.workspace_id),
      activeProposals: Number(row.active_proposals),
      templates: Number(row.templates),
      aiGenerationsThisMonth: Number(row.ai_generations_this_month),
      monthKey: String(row.month_key),
    });
  }
  for (const row of (await client.execute("SELECT * FROM audit_logs")).rows) {
    data.auditLogs.push({
      id: String(row.id),
      workspaceId: String(row.workspace_id),
      actorId: row.actor_id ? String(row.actor_id) : undefined,
      action: String(row.action),
      meta: row.meta_json ? JSON.parse(String(row.meta_json)) : undefined,
      createdAt: String(row.created_at),
    });
  }
  for (const row of (await client.execute("SELECT * FROM subscription_events")).rows) {
    data.subscriptionEvents.push({
      id: String(row.id),
      provider: String(row.provider),
      type: String(row.type),
      payload: JSON.parse(String(row.payload_json)),
      createdAt: String(row.created_at),
    });
  }
  return data;
}

export async function persistDb(data: AppDatabase = cache.__proposalRoomCache!) {
  if (!data) return;
  const client = getSqlClient();
  await migrateSql(client);

  await client.executeMultiple(`
    DELETE FROM subscription_events;
    DELETE FROM audit_logs;
    DELETE FROM usage_counters;
    DELETE FROM proposals;
    DELETE FROM templates;
    DELETE FROM workspace_members;
    DELETE FROM workspaces;
    DELETE FROM users;
  `);

  for (const u of data.users) {
    await client.execute({
      sql: `INSERT INTO users (id, email, name, password, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [u.id, u.email, u.name, u.password, u.createdAt],
    });
  }
  for (const w of data.workspaces) {
    await client.execute({
      sql: `INSERT INTO workspaces (id, name, slug, owner_id, plan_id, subscription_status, billing_customer_id, brand_color, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        w.id,
        w.name,
        w.slug,
        w.ownerId,
        w.planId,
        w.subscriptionStatus,
        w.billingCustomerId ?? null,
        w.brandColor,
        w.createdAt,
      ],
    });
  }
  for (const m of data.members) {
    await client.execute({
      sql: `INSERT INTO workspace_members (id, workspace_id, user_id, role) VALUES (?, ?, ?, ?)`,
      args: [m.id, m.workspaceId, m.userId, m.role],
    });
  }
  for (const t of data.templates) {
    await client.execute({
      sql: `INSERT INTO templates (id, workspace_id, name, description, sections_json, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [t.id, t.workspaceId, t.name, t.description, JSON.stringify(t.sections), t.createdAt],
    });
  }
  for (const p of data.proposals) {
    await client.execute({
      sql: `INSERT INTO proposals (
        id, workspace_id, title, client_name, client_email, brief, status, currency, amount_cents,
        public_slug, public_token, sections_json, template_id, accepted_at, viewed_at, sent_at,
        payment_url, reminder_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id,
        p.workspaceId,
        p.title,
        p.clientName,
        p.clientEmail,
        p.brief,
        p.status,
        p.currency,
        p.amountCents,
        p.publicSlug,
        p.publicToken,
        JSON.stringify(p.sections),
        p.templateId ?? null,
        p.acceptedAt ?? null,
        p.viewedAt ?? null,
        p.sentAt ?? null,
        p.paymentUrl ?? null,
        p.reminderCount,
        p.createdAt,
        p.updatedAt,
      ],
    });
  }
  for (const u of data.usage) {
    await client.execute({
      sql: `INSERT INTO usage_counters (workspace_id, active_proposals, templates, ai_generations_this_month, month_key)
            VALUES (?, ?, ?, ?, ?)`,
      args: [u.workspaceId, u.activeProposals, u.templates, u.aiGenerationsThisMonth, u.monthKey],
    });
  }
  for (const a of data.auditLogs) {
    await client.execute({
      sql: `INSERT INTO audit_logs (id, workspace_id, actor_id, action, meta_json, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [a.id, a.workspaceId, a.actorId ?? null, a.action, a.meta ? JSON.stringify(a.meta) : null, a.createdAt],
    });
  }
  for (const e of data.subscriptionEvents) {
    await client.execute({
      sql: `INSERT INTO subscription_events (id, provider, type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [e.id, e.provider, e.type, JSON.stringify(e.payload), e.createdAt],
    });
  }

  await client.execute(
    `INSERT INTO meta (key, value) VALUES ('schema_version', '1')
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  );
}

async function ensureReady() {
  if (cache.__proposalRoomCache) return;
  if (!cache.__proposalRoomReady) {
    cache.__proposalRoomReady = (async () => {
      const loaded = await loadFromSql();
      if (loaded) {
        cache.__proposalRoomCache = loaded;
      } else {
        cache.__proposalRoomCache = buildSeedDatabase();
        await persistDb(cache.__proposalRoomCache);
      }
    })();
  }
  await cache.__proposalRoomReady;
}

/** Sync accessor — call `await ensureDb()` once per request first when possible. */
export function db(): AppDatabase {
  if (!cache.__proposalRoomCache) {
    // Sync bootstrap for tests / first hit: seed in memory, persist async.
    cache.__proposalRoomCache = buildSeedDatabase();
    void persistDb(cache.__proposalRoomCache);
  }
  return cache.__proposalRoomCache;
}

export async function ensureDb() {
  await ensureReady();
  return db();
}

export async function resetDatabase(seed = true) {
  resetSqlClientForTests();
  cache.__proposalRoomReady = undefined;
  const next = seed ? buildSeedDatabase() : emptyDb();
  cache.__proposalRoomCache = next;
  await persistDb(next);
  return next;
}

/** @deprecated alias — prefer buildSeedDatabase + persist */
export function seedDemoDatabase() {
  return buildSeedDatabase();
}

export function getUsage(workspaceId: string): UsageCounters {
  const data = db();
  let usage = data.usage.find((u) => u.workspaceId === workspaceId);
  if (!usage) {
    usage = {
      workspaceId,
      activeProposals: 0,
      templates: 0,
      aiGenerationsThisMonth: 0,
      monthKey: monthKey(),
    };
    data.usage.push(usage);
  }
  return usage;
}

export function recountActiveProposals(workspaceId: string) {
  const data = db();
  const usage = getUsage(workspaceId);
  usage.activeProposals = data.proposals.filter(
    (p) =>
      p.workspaceId === workspaceId &&
      ["draft", "sent", "viewed"].includes(p.status),
  ).length;
  usage.templates = data.templates.filter((t) => t.workspaceId === workspaceId).length;
  void persistDb(data);
  return usage;
}

export function findUserByEmail(email: string) {
  return db().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findWorkspaceForUser(userId: string) {
  const data = db();
  const membership = data.members.find((m) => m.userId === userId);
  if (!membership) return null;
  return data.workspaces.find((w) => w.id === membership.workspaceId) ?? null;
}

/** Legacy helper — prefers opaque token lookup. */
export function findProposalByPublic(slug: string, token: string) {
  return db().proposals.find((p) => p.publicSlug === slug && p.publicToken === token);
}

/** Secure share link: opaque access token only (no query string). */
export function findProposalByAccessToken(token: string) {
  return db().proposals.find((p) => p.publicToken === token);
}

export function saveDb() {
  return persistDb(db());
}

export type { AuditLog };

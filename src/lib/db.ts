import { nanoid } from "nanoid";
import type {
  AppDatabase,
  Proposal,
  Template,
  UsageCounters,
  User,
  Workspace,
  WorkspaceMember,
} from "./types";

const globalStore = globalThis as unknown as {
  __proposalRoomDb?: AppDatabase;
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

export function db(): AppDatabase {
  if (!globalStore.__proposalRoomDb) {
    globalStore.__proposalRoomDb = seedDemoDatabase();
  }
  return globalStore.__proposalRoomDb;
}

export function resetDatabase(seed = true) {
  globalStore.__proposalRoomDb = seed ? seedDemoDatabase() : emptyDb();
  return globalStore.__proposalRoomDb;
}

export function seedDemoDatabase(): AppDatabase {
  const now = new Date().toISOString();
  const ownerId = "user_demo_owner";
  const workspaceId = "ws_atelier_norte";
  const memberId = "mem_demo_owner";

  const owner: User = {
    id: ownerId,
    email: "demo@proposalroom.app",
    name: "Ana Ribeiro",
    password: "demo1234",
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
    description: "Estrutura luxuosa para projetos de design e consultoria.",
    sections: [
      {
        title: "Contexto",
        body: "Entendemos o momento do negócio e o resultado esperado.",
        order: 1,
      },
      {
        title: "Escopo",
        body: "Entregáveis claros, prazos e responsabilidades.",
        order: 2,
      },
      {
        title: "Investimento",
        body: "Valores transparentes com opções de pagamento.",
        order: 3,
      },
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
      brief:
        "Rebrand completo para café boutique: logo, tipografia, packaging e guidelines.",
      status: "sent",
      currency: "BRL",
      amountCents: 1850000,
      publicSlug: "casa-aurora-identidade",
      publicToken: "tok_casa_aurora_demo",
      sections: [
        {
          id: "sec1",
          title: "Visão",
          body: "Uma identidade editorial que traduz hospitalidade contemporânea e calor artesanal.",
          order: 1,
        },
        {
          id: "sec2",
          title: "Entregáveis",
          body: "Logo principal e variações, tipografia, paleta, mockups de embalagem e brand book PDF.",
          order: 2,
        },
        {
          id: "sec3",
          title: "Cronograma",
          body: "4 semanas: discovery → conceitos → refinamentos → entrega final.",
          order: 3,
        },
        {
          id: "sec4",
          title: "Investimento",
          body: "R$ 18.500 com 40% na assinatura e 60% na entrega.",
          order: 4,
        },
      ],
      templateId: template.id,
      sentAt: now,
      reminderCount: 1,
      paymentUrl: "https://pay.proposalroom.app/mock/casa-aurora",
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
        {
          id: "s1",
          title: "Diagnóstico",
          body: "Mapeamento de proposta de valor, ICP e narrativa comercial.",
          order: 1,
        },
        {
          id: "s2",
          title: "Workshop",
          body: "Sessão presencial de 1 dia com stakeholders.",
          order: 2,
        },
        {
          id: "s3",
          title: "Playbook",
          body: "Documento operacional com scripts, ofertas e funil.",
          order: 3,
        },
      ],
      viewedAt: now,
      sentAt: now,
      reminderCount: 0,
      paymentUrl: "https://pay.proposalroom.app/mock/studio-lume",
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
        {
          id: "o1",
          title: "Objetivo",
          body: "Converter visitas em orçamentos qualificados.",
          order: 1,
        },
        {
          id: "o2",
          title: "Escopo",
          body: "Home, serviços, cases, contato e painel simples.",
          order: 2,
        },
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

export function findProposalByPublic(slug: string, token: string) {
  return db().proposals.find((p) => p.publicSlug === slug && p.publicToken === token);
}

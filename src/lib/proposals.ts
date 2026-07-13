import { nanoid } from "nanoid";
import { z } from "zod";
import {
  checkActiveProposalLimit,
  checkAiGenerationLimit,
  type EntitlementContext,
} from "@/billing/entitlements";
import { db, getUsage, recountActiveProposals } from "./db";
import type { Proposal, ProposalSection, Workspace } from "./types";

export const briefSchema = z.object({
  title: z.string().min(3, "Título obrigatório."),
  clientName: z.string().min(2, "Nome do cliente obrigatório."),
  clientEmail: z.string().email("E-mail do cliente inválido."),
  brief: z.string().min(20, "Descreva o brief com mais detalhes."),
  amountCents: z.number().int().positive().optional(),
});

export function entitlementFromWorkspace(workspace: Workspace): EntitlementContext {
  const usage = getUsage(workspace.id);
  return {
    planId: workspace.planId,
    status: workspace.subscriptionStatus,
    usage: {
      activeProposals: usage.activeProposals,
      templates: usage.templates,
      aiGenerationsThisMonth: usage.aiGenerationsThisMonth,
    },
  };
}

export function generateProposalSections(brief: string, clientName: string): ProposalSection[] {
  const trimmed = brief.trim();
  return [
    {
      id: nanoid(6),
      title: "Contexto",
      body: `Olá ${clientName}, preparámos esta proposta a partir do seu brief: ${trimmed.slice(0, 280)}${trimmed.length > 280 ? "…" : ""}`,
      order: 1,
    },
    {
      id: nanoid(6),
      title: "Abordagem",
      body: "Vamos trabalhar em ciclos curtos com alinhamentos semanais, entregáveis revisáveis e uma sala do cliente para aceite e pagamento.",
      order: 2,
    },
    {
      id: nanoid(6),
      title: "Escopo",
      body: "Discovery, concepção, execução e handoff documentado. Itens fora do escopo serão orçados à parte antes de qualquer avanço.",
      order: 3,
    },
    {
      id: nanoid(6),
      title: "Investimento",
      body: "Valores transparentes, condições de pagamento e próximo passo claro para assinatura digital.",
      order: 4,
    },
  ];
}

export function createProposalFromBrief(
  workspace: Workspace,
  input: z.infer<typeof briefSchema>,
) {
  const ctx = entitlementFromWorkspace(workspace);
  const limit = checkActiveProposalLimit(ctx);
  if (!limit.ok) {
    return { ok: false as const, error: limit.message, upgradeRequired: true as const };
  }

  const aiLimit = checkAiGenerationLimit(ctx);
  if (!aiLimit.ok) {
    return { ok: false as const, error: aiLimit.message, upgradeRequired: true as const };
  }

  const now = new Date().toISOString();
  const slugBase = input.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  const proposal: Proposal = {
    id: `prop_${nanoid(8)}`,
    workspaceId: workspace.id,
    title: input.title,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    brief: input.brief,
    status: "draft",
    currency: "BRL",
    amountCents: input.amountCents ?? 500000,
    publicSlug: `${slugBase || "proposta"}-${nanoid(4)}`,
    publicToken: `tok_${nanoid(12)}`,
    sections: generateProposalSections(input.brief, input.clientName),
    reminderCount: 0,
    paymentUrl: undefined, // mock checkout stays in-app (see AcceptForm)
    createdAt: now,
    updatedAt: now,
  };

  db().proposals.unshift(proposal);
  const usage = getUsage(workspace.id);
  usage.aiGenerationsThisMonth += 1;
  recountActiveProposals(workspace.id);

  db().auditLogs.unshift({
    id: nanoid(8),
    workspaceId: workspace.id,
    action: "proposal.created",
    meta: { proposalId: proposal.id },
    createdAt: now,
  });

  return { ok: true as const, proposal };
}

export function listProposals(workspaceId: string) {
  return db()
    .proposals.filter((p) => p.workspaceId === workspaceId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProposal(workspaceId: string, id: string) {
  return db().proposals.find((p) => p.workspaceId === workspaceId && p.id === id);
}

export function updateProposalStatus(
  proposal: Proposal,
  status: Proposal["status"],
  extra: Partial<Proposal> = {},
) {
  Object.assign(proposal, extra, { status, updatedAt: new Date().toISOString() });
  recountActiveProposals(proposal.workspaceId);
  return proposal;
}

export function exportProposalsCsv(workspaceId: string) {
  const rows = listProposals(workspaceId);
  const header = ["id", "title", "client", "status", "amount_brl", "updated_at"];
  const lines = rows.map((p) =>
    [
      p.id,
      JSON.stringify(p.title),
      JSON.stringify(p.clientName),
      p.status,
      (p.amountCents / 100).toFixed(2),
      p.updatedAt,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

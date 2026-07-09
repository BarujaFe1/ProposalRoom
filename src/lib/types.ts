export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  planId: "starter" | "pro" | "business";
  subscriptionStatus: "trialing" | "active" | "past_due" | "canceled" | "inactive" | "unpaid";
  billingCustomerId?: string;
  brandColor: string;
  createdAt: string;
};

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member";
};

export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "expired"
  | "paid";

export type ProposalSection = {
  id: string;
  title: string;
  body: string;
  order: number;
};

export type Proposal = {
  id: string;
  workspaceId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  brief: string;
  status: ProposalStatus;
  currency: "BRL";
  amountCents: number;
  publicSlug: string;
  publicToken: string;
  sections: ProposalSection[];
  templateId?: string;
  acceptedAt?: string;
  viewedAt?: string;
  sentAt?: string;
  paymentUrl?: string;
  reminderCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Template = {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  sections: Omit<ProposalSection, "id">[];
  createdAt: string;
};

export type AuditLog = {
  id: string;
  workspaceId: string;
  actorId?: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
};

export type UsageCounters = {
  workspaceId: string;
  activeProposals: number;
  templates: number;
  aiGenerationsThisMonth: number;
  monthKey: string;
};

export type AppDatabase = {
  users: User[];
  workspaces: Workspace[];
  members: WorkspaceMember[];
  proposals: Proposal[];
  templates: Template[];
  auditLogs: AuditLog[];
  usage: UsageCounters[];
  subscriptionEvents: Array<{
    id: string;
    provider: string;
    type: string;
    payload: unknown;
    createdAt: string;
  }>;
};

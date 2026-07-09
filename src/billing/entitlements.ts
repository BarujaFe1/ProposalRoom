import { getPlan, type PlanId, type PlanLimits } from "./plans";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "inactive"
  | "unpaid";

export type EntitlementContext = {
  planId: PlanId | string;
  status: SubscriptionStatus;
  usage: {
    activeProposals: number;
    templates: number;
    aiGenerationsThisMonth: number;
  };
};

export type FeatureKey = keyof PlanLimits;

const BLOCKED_STATUSES: SubscriptionStatus[] = [
  "inactive",
  "past_due",
  "canceled",
  "unpaid",
];

export function isSubscriptionUsable(status: SubscriptionStatus) {
  return status === "active" || status === "trialing";
}

export function resolveEffectivePlan(ctx: EntitlementContext) {
  if (BLOCKED_STATUSES.includes(ctx.status)) {
    return getPlan("starter");
  }
  return getPlan(ctx.planId);
}

export function canUseFeature(ctx: EntitlementContext, feature: FeatureKey) {
  const plan = resolveEffectivePlan(ctx);
  const value = plan.limits[feature];
  if (typeof value === "boolean") return value;
  return true;
}

export type LimitCheck =
  | { ok: true; remaining: number; limit: number; planId: PlanId }
  | {
      ok: false;
      reason: "limit_reached" | "subscription_blocked";
      remaining: number;
      limit: number;
      planId: PlanId;
      upgradeRequired: true;
      message: string;
    };

export function checkActiveProposalLimit(ctx: EntitlementContext): LimitCheck {
  if (BLOCKED_STATUSES.includes(ctx.status) && ctx.planId !== "starter") {
    const starter = getPlan("starter");
    return {
      ok: false,
      reason: "subscription_blocked",
      remaining: 0,
      limit: starter.limits.activeProposals,
      planId: starter.id,
      upgradeRequired: true,
      message:
        "Sua assinatura está inativa ou com pagamento pendente. Regularize em Billing ou faça upgrade.",
    };
  }

  const plan = resolveEffectivePlan(ctx);
  const limit = plan.limits.activeProposals;
  const used = ctx.usage.activeProposals;
  const remaining = Math.max(0, limit - used);

  if (used >= limit) {
    return {
      ok: false,
      reason: "limit_reached",
      remaining: 0,
      limit,
      planId: plan.id,
      upgradeRequired: true,
      message: `Você atingiu o limite de ${limit} propostas ativas no plano ${plan.name}.`,
    };
  }

  return { ok: true, remaining, limit, planId: plan.id };
}

export function checkTemplateLimit(ctx: EntitlementContext): LimitCheck {
  const plan = resolveEffectivePlan(ctx);
  const limit = plan.limits.templates;
  const used = ctx.usage.templates;
  const remaining = Math.max(0, limit - used);
  if (used >= limit) {
    return {
      ok: false,
      reason: "limit_reached",
      remaining: 0,
      limit,
      planId: plan.id,
      upgradeRequired: true,
      message: `Limite de ${limit} modelo(s) atingido no plano ${plan.name}.`,
    };
  }
  return { ok: true, remaining, limit, planId: plan.id };
}

export function checkAiGenerationLimit(ctx: EntitlementContext): LimitCheck {
  const plan = resolveEffectivePlan(ctx);
  const limit = plan.limits.aiGenerationsPerMonth;
  const used = ctx.usage.aiGenerationsThisMonth;
  const remaining = Math.max(0, limit - used);
  if (used >= limit) {
    return {
      ok: false,
      reason: "limit_reached",
      remaining: 0,
      limit,
      planId: plan.id,
      upgradeRequired: true,
      message: `Limite mensal de ${limit} gerações com IA atingido.`,
    };
  }
  return { ok: true, remaining, limit, planId: plan.id };
}

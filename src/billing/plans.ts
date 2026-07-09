export type PlanId = "starter" | "pro" | "business";

export type PlanLimits = {
  activeProposals: number;
  templates: number;
  removeBranding: boolean;
  publicPages: boolean;
  customDomain: boolean;
  analytics: boolean;
  automations: boolean;
  aiGenerationsPerMonth: number;
};

export type PlanDefinition = {
  id: PlanId;
  name: string;
  description: string;
  priceMonthlyCents: number;
  highlight?: boolean;
  cta: string;
  features: string[];
  limits: PlanLimits;
};

export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "Para freelancers validarem o fluxo com marca ProposalRoom.",
    priceMonthlyCents: 0,
    cta: "Começar grátis",
    features: [
      "Até 3 propostas ativas",
      "1 modelo",
      "Página pública com marca",
      "Aceite digital",
      "Lembretes básicos",
    ],
    limits: {
      activeProposals: 3,
      templates: 1,
      removeBranding: false,
      publicPages: true,
      customDomain: false,
      analytics: false,
      automations: false,
      aiGenerationsPerMonth: 10,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para agências e consultorias que fecham propostas toda semana.",
    priceMonthlyCents: 8900,
    highlight: true,
    cta: "Assinar Pro",
    features: [
      "Até 30 propostas ativas",
      "10 modelos",
      "Remoção de marca",
      "Analytics de visualização",
      "Lembretes automáticos",
      "100 gerações IA / mês",
    ],
    limits: {
      activeProposals: 30,
      templates: 10,
      removeBranding: true,
      publicPages: true,
      customDomain: false,
      analytics: true,
      automations: true,
      aiGenerationsPerMonth: 100,
    },
  },
  business: {
    id: "business",
    name: "Business",
    description: "Para times com domínio próprio, volume e operação séria.",
    priceMonthlyCents: 24900,
    cta: "Assinar Business",
    features: [
      "Propostas ilimitadas",
      "Modelos ilimitados",
      "Domínio customizado",
      "Analytics avançado",
      "Automações e follow-up",
      "500 gerações IA / mês",
      "Suporte prioritário",
    ],
    limits: {
      activeProposals: 9999,
      templates: 9999,
      removeBranding: true,
      publicPages: true,
      customDomain: true,
      analytics: true,
      automations: true,
      aiGenerationsPerMonth: 500,
    },
  },
};

export const PLAN_LIST = Object.values(PLANS);

export function getPlan(planId: PlanId | string | null | undefined): PlanDefinition {
  if (planId && planId in PLANS) return PLANS[planId as PlanId];
  return PLANS.starter;
}

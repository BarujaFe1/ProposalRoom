import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { getPlan, PLAN_LIST } from "@/billing/plans";
import { checkActiveProposalLimit } from "@/billing/entitlements";
import { entitlementFromWorkspace } from "@/lib/proposals";
import { Card, PageHeader } from "@/components/ui";
import { formatBRL } from "@/lib/utils";
import { UpgradeCheckout } from "./upgrade-checkout";

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  const params = await searchParams;
  const reason = typeof params.reason === "string" ? params.reason : null;
  const selected =
    typeof params.plan === "string" && ["pro", "business"].includes(params.plan)
      ? params.plan
      : "pro";

  const limit = checkActiveProposalLimit(entitlementFromWorkspace(session.workspace));
  const current = getPlan(session.workspace.planId);

  return (
    <div>
      <PageHeader
        title="Upgrade"
        description="Você atingiu um limite do plano atual ou quer desbloquear recursos premium."
      />
      {!limit.ok || reason ? (
        <div className="mb-6 rounded-xl border border-amber-800/20 bg-amber-50 p-4 text-sm text-amber-950">
          {limit.ok
            ? "Faça upgrade para remover marca, aumentar limites e ativar automações."
            : limit.message}
        </div>
      ) : null}

      <p className="mb-4 text-sm text-[var(--muted-strong)]">
        Plano atual: <strong>{current.name}</strong>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {PLAN_LIST.filter((p) => p.id !== "starter").map((plan) => (
          <Card
            key={plan.id}
            className={selected === plan.id ? "border-[var(--accent)]" : undefined}
          >
            <h2 className="font-display text-3xl">{plan.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted-strong)]">{plan.description}</p>
            <p className="mt-4 font-display text-4xl">{formatBRL(plan.priceMonthlyCents)}</p>
            <ul className="mt-4 space-y-1 text-sm text-[var(--muted-strong)]">
              {plan.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <div className="mt-6">
              <UpgradeCheckout planId={plan.id} />
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-sm">
        <Link href="/app/billing" className="text-[var(--accent)]">
          Voltar para billing
        </Link>
      </p>
    </div>
  );
}

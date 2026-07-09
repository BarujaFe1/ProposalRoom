import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { getPlan, PLAN_LIST } from "@/billing/plans";
import { getUsage } from "@/lib/db";
import { Button, Card, PageHeader } from "@/components/ui";
import { formatBRL } from "@/lib/utils";
import { BillingActions } from "./billing-actions";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  const params = await searchParams;
  const plan = getPlan(session.workspace.planId);
  const usage = getUsage(session.workspace.id);
  const mockOk = params.mock === "1";

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Assinatura, portal do cliente e uso do plano atual."
      />
      {mockOk ? (
        <div className="mb-4 rounded-md border border-emerald-800/20 bg-emerald-50 p-3 text-sm text-emerald-900">
          Checkout mock concluído. Em produção, o webhook confirma a assinatura.
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Plano atual</p>
          <h2 className="mt-2 font-display text-3xl">{plan.name}</h2>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">
            {formatBRL(plan.priceMonthlyCents)} / mês · status{" "}
            {session.workspace.subscriptionStatus}
          </p>
          <ul className="mt-4 space-y-1 text-sm text-[var(--muted-strong)]">
            <li>
              Propostas ativas: {usage.activeProposals}/{plan.limits.activeProposals}
            </li>
            <li>
              Modelos: {usage.templates}/{plan.limits.templates}
            </li>
            <li>
              IA: {usage.aiGenerationsThisMonth}/{plan.limits.aiGenerationsPerMonth}
            </li>
          </ul>
          <div className="mt-6">
            <BillingActions
              currentPlan={plan.id}
              customerId={session.workspace.billingCustomerId ?? "cus_mock"}
            />
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-2xl">Trocar de plano</h3>
          <div className="mt-4 space-y-3">
            {PLAN_LIST.filter((p) => p.id !== plan.id).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-[var(--muted)]">{formatBRL(p.priceMonthlyCents)}/mês</p>
                </div>
                <Link href={`/app/upgrade?plan=${p.id}`}>
                  <Button size="sm" variant="secondary">
                    Selecionar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

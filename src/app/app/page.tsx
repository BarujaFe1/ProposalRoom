import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { listProposals } from "@/lib/proposals";
import { getUsage } from "@/lib/db";
import { getPlan } from "@/billing/plans";
import { checkActiveProposalLimit } from "@/billing/entitlements";
import { entitlementFromWorkspace } from "@/lib/proposals";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { formatBRL, formatProposalStatus } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSessionContext();
  if (!session) redirect("/login");

  const proposals = listProposals(session.workspace.id);
  const usage = getUsage(session.workspace.id);
  const plan = getPlan(session.workspace.planId);
  const limit = checkActiveProposalLimit(entitlementFromWorkspace(session.workspace));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Acompanhe propostas, aceite e limites do plano em um só lugar."
        actions={
          <Link href="/app/proposals/new">
            <Button>Nova proposta</Button>
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Propostas ativas</p>
          <p className="mt-2 font-display text-4xl">
            {usage.activeProposals}
            <span className="text-lg text-[var(--muted)]">/{limit.limit}</span>
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Plano</p>
          <p className="mt-2 font-display text-4xl">{plan.name}</p>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">
            Status: {session.workspace.subscriptionStatus}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Gerações (mês)</p>
          <p className="mt-2 font-display text-4xl">
            {usage.aiGenerationsThisMonth}
            <span className="text-lg text-[var(--muted)]">
              /{plan.limits.aiGenerationsPerMonth}
            </span>
          </p>
        </Card>
      </div>

      {!limit.ok ? (
        <div className="mb-6 rounded-xl border border-amber-800/30 bg-amber-50 p-4 text-sm text-amber-950">
          {limit.message}{" "}
          <Link href="/app/upgrade" className="font-medium underline">
            Ver upgrade
          </Link>
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Propostas recentes</h2>
        <Link href="/api/export/proposals" className="text-sm text-[var(--accent)]">
          Exportar CSV
        </Link>
      </div>

      {proposals.length === 0 ? (
        <EmptyState
          title="Nenhuma proposta ainda"
          description="Crie a primeira a partir de um brief. Em minutos você terá uma página pública pronta para o cliente."
          action={
            <Link href="/app/proposals/new">
              <Button>Criar proposta</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {proposals.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              href={`/app/proposals/${p.id}`}
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-[var(--muted-strong)]">
                  {p.clientName} · {formatBRL(p.amountCents)}
                </p>
              </div>
              <Badge
                tone={
                  p.status === "accepted" || p.status === "paid"
                    ? "success"
                    : p.status === "sent" || p.status === "viewed"
                      ? "accent"
                      : "neutral"
                }
              >
                {formatProposalStatus(p.status)}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { getPlan } from "@/billing/plans";
import { Card, PageHeader } from "@/components/ui";

export default async function SettingsPage() {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  const plan = getPlan(session.workspace.planId);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Workspace, plano e preferências básicas do MVP."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl">Workspace</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Nome</dt>
              <dd>{session.workspace.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Slug</dt>
              <dd>{session.workspace.slug}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Cor</dt>
              <dd className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full border border-[var(--border)]"
                  style={{ background: session.workspace.brandColor }}
                />
                {session.workspace.brandColor}
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="font-display text-2xl">Conta</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Usuário</dt>
              <dd>{session.user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">E-mail</dt>
              <dd>{session.user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Plano</dt>
              <dd>{plan.name}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

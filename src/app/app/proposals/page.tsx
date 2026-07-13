import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { listProposals } from "@/lib/proposals";
import { Badge, Button, EmptyState, PageHeader } from "@/components/ui";
import { formatBRL, formatProposalStatus } from "@/lib/utils";

export default async function ProposalsPage() {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  const proposals = listProposals(session.workspace.id);

  return (
    <div>
      <PageHeader
        title="Propostas"
        description="CRUD do domínio: brief, geração, envio, aceite e status."
        actions={
          <Link href="/app/proposals/new">
            <Button>Nova proposta</Button>
          </Link>
        }
      />
      {proposals.length === 0 ? (
        <EmptyState
          title="Sala vazia"
          description="Quando você criar a primeira proposta, ela aparece aqui com status e link público."
          action={
            <Link href="/app/proposals/new">
              <Button>Começar</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--muted-strong)]">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Cliente</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Valor</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/app/proposals/${p.id}`} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">{p.clientName}</td>
                  <td className="px-4 py-3">
                    <Badge>{formatProposalStatus(p.status)}</Badge>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{formatBRL(p.amountCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { getProposal } from "@/lib/proposals";
import { absoluteUrl, formatBRL, formatProposalStatus } from "@/lib/utils";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { ProposalActions } from "./actions";

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  const { id } = await params;
  const proposal = getProposal(session.workspace.id, id);
  if (!proposal) notFound();

  const publicUrl = absoluteUrl(`/p/${proposal.publicSlug}?token=${proposal.publicToken}`);

  return (
    <div>
      <PageHeader
        title={proposal.title}
        description={`${proposal.clientName} · ${proposal.clientEmail}`}
        actions={
          <div className="flex gap-2">
            <Link href={publicUrl} target="_blank">
              <Button variant="secondary">Abrir sala do cliente</Button>
            </Link>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge tone="accent">{formatProposalStatus(proposal.status)}</Badge>
        <span className="text-sm text-[var(--muted-strong)]">
          {formatBRL(proposal.amountCents)}
        </span>
        <span className="text-sm text-[var(--muted)]">
          Lembretes: {proposal.reminderCount}
        </span>
      </div>

      <ProposalActions proposalId={proposal.id} status={proposal.status} />

      <Card className="mt-6">
        <h2 className="font-display text-2xl">Brief</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted-strong)]">
          {proposal.brief}
        </p>
      </Card>

      <div className="mt-6 space-y-4">
        {proposal.sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <Card key={section.id}>
              <h3 className="font-display text-xl">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">
                {section.body}
              </p>
            </Card>
          ))}
      </div>

      <Card className="mt-6">
        <h3 className="font-medium">Link público protegido</h3>
        <p className="mt-2 break-all text-sm text-[var(--muted-strong)]">{publicUrl}</p>
      </Card>
    </div>
  );
}

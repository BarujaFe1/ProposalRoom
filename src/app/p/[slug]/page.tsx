import { notFound } from "next/navigation";
import { findProposalByPublic, db } from "@/lib/db";
import { updateProposalStatus } from "@/lib/proposals";
import { formatBRL } from "@/lib/utils";
import { AcceptForm } from "./accept-form";
import { getPlan } from "@/billing/plans";

export default async function PublicProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const proposal = findProposalByPublic(slug, token);
  if (!proposal) notFound();

  if (proposal.status === "sent") {
    updateProposalStatus(proposal, "viewed", { viewedAt: new Date().toISOString() });
  }

  const workspace = db().workspaces.find((w) => w.id === proposal.workspaceId);
  const plan = getPlan(workspace?.planId);
  const showBrand = !plan.limits.removeBranding;

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--cream)]">
      <div className="hero-wash mx-auto min-h-[42vh] max-w-5xl px-6 py-16 sm:px-10">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
          Sala do cliente
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
          {proposal.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Preparado para {proposal.clientName} · {formatBRL(proposal.amountCents)}
        </p>
        {showBrand ? (
          <p className="mt-8 text-xs text-white/40">Powered by ProposalRoom</p>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12 sm:px-10">
        {proposal.sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <section key={section.id} className="border-b border-white/10 pb-6">
              <h2 className="font-display text-3xl">{section.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-white/75">{section.body}</p>
            </section>
          ))}

        <AcceptForm
          slug={proposal.publicSlug}
          token={proposal.publicToken}
          status={proposal.status}
          paymentUrl={proposal.paymentUrl}
        />
      </div>
    </div>
  );
}

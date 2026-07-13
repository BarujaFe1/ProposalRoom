import { redirect, notFound } from "next/navigation";
import { ensureDb, findProposalByPublic } from "@/lib/db";
import { createPublicProposalPath } from "@/lib/share-link";

/**
 * Legacy public URL (`/p/[slug]?token=…`) → redirect to opaque `/r/[token]`.
 */
export default async function LegacyPublicProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await ensureDb();
  const { slug } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  if (!token) notFound();
  const proposal = findProposalByPublic(slug, token);
  if (!proposal) notFound();
  redirect(createPublicProposalPath(proposal.publicToken));
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureDb, findProposalByAccessToken } from "@/lib/db";
import { updateProposalStatus } from "@/lib/proposals";

const schema = z.object({
  token: z.string().min(8),
});

export async function POST(req: Request) {
  await ensureDb();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }

  const proposal = findProposalByAccessToken(parsed.data.token);
  if (!proposal) {
    return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
  }

  updateProposalStatus(proposal, "accepted", {
    acceptedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, status: proposal.status });
}

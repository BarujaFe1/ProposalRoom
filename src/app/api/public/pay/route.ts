import { NextResponse } from "next/server";
import { z } from "zod";
import { findProposalByPublic } from "@/lib/db";
import { updateProposalStatus } from "@/lib/proposals";

const schema = z.object({
  slug: z.string().min(1),
  token: z.string().min(1),
});

/** Lab-only mock payment — never charges a real provider. */
export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const proposal = findProposalByPublic(body.slug, body.token);
    if (!proposal) {
      return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
    }
    if (proposal.status !== "accepted" && proposal.status !== "paid") {
      return NextResponse.json(
        { error: "Aceite a proposta antes de simular o pagamento." },
        { status: 400 },
      );
    }
    if (proposal.status === "paid") {
      return NextResponse.json({ ok: true, status: "paid", alreadyPaid: true });
    }

    updateProposalStatus(proposal, "paid");
    return NextResponse.json({ ok: true, status: "paid" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pagamento inválido." },
      { status: 400 },
    );
  }
}

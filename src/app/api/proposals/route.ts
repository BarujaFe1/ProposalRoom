import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { briefSchema, createProposalFromBrief, listProposals } from "@/lib/proposals";

export async function GET() {
  const session = await getSessionContext();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  return NextResponse.json({ proposals: listProposals(session.workspace.id) });
}

export async function POST(req: Request) {
  const session = await getSessionContext();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const parsed = briefSchema.safeParse({
    ...body,
    amountCents:
      typeof body.amountCents === "number" ? body.amountCents : Number(body.amountCents),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const result = createProposalFromBrief(session.workspace, parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, upgradeRequired: result.upgradeRequired },
      { status: 402 },
    );
  }
  return NextResponse.json({ proposal: result.proposal });
}

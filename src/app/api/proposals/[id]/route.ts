import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { getProposal, updateProposalStatus } from "@/lib/proposals";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSessionContext();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { id } = await ctx.params;
  const proposal = getProposal(session.workspace.id, id);
  if (!proposal) return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });

  const body = await req.json();
  const action = String(body.action ?? "");

  if (action === "send") {
    updateProposalStatus(proposal, "sent", { sentAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, message: "Proposta enviada ao cliente." });
  }
  if (action === "remind") {
    proposal.reminderCount += 1;
    proposal.updatedAt = new Date().toISOString();
    db().auditLogs.unshift({
      id: nanoid(8),
      workspaceId: session.workspace.id,
      action: "proposal.reminder",
      meta: { proposalId: proposal.id },
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({
      ok: true,
      message: `Lembrete #${proposal.reminderCount} registrado (e-mail mock).`,
    });
  }
  if (action === "archive") {
    updateProposalStatus(proposal, "expired");
    return NextResponse.json({ ok: true, message: "Proposta arquivada." });
  }

  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}

import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { exportProposalsCsv } from "@/lib/proposals";

export async function GET() {
  const session = await getSessionContext();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const csv = exportProposalsCsv(session.workspace.id);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="proposals-${session.workspace.slug}.csv"`,
    },
  });
}

import { NextResponse } from "next/server";
import { createWorkspaceForUser, getCurrentUser, onboardingSchema } from "@/lib/auth";
import { findWorkspaceForUser } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (findWorkspaceForUser(user.id)) {
    return NextResponse.json({ ok: true, alreadyExists: true });
  }

  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const workspace = createWorkspaceForUser(
    user,
    parsed.data.workspaceName,
    parsed.data.brandColor,
  );
  return NextResponse.json({ ok: true, workspace });
}

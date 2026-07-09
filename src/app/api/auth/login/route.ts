import { NextResponse } from "next/server";
import { authenticate, loginSchema, setSessionCookie } from "@/lib/auth";
import { findWorkspaceForUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }
    const result = authenticate(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    await setSessionCookie(result.user.id);
    const workspace = findWorkspaceForUser(result.user.id);
    return NextResponse.json({
      ok: true,
      redirectTo: workspace ? "/app" : "/onboarding",
    });
  } catch {
    return NextResponse.json({ error: "Erro inesperado no login." }, { status: 500 });
  }
}

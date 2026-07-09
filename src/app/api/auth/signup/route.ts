import { NextResponse } from "next/server";
import { registerUser, setSessionCookie, signupSchema } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }
    const result = registerUser(parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    await setSessionCookie(result.user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro inesperado no cadastro." }, { status: 500 });
  }
}

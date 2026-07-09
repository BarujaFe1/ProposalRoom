import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { getBillingProvider } from "@/billing";
import { absoluteUrl } from "@/lib/utils";

const schema = z.object({
  customerId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getSessionContext();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "customerId obrigatório." }, { status: 400 });
  }

  try {
    const provider = getBillingProvider();
    const result = await provider.createCustomerPortal({
      workspaceId: session.workspace.id,
      customerId: parsed.data.customerId,
      returnUrl: absoluteUrl("/app/billing"),
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Portal indisponível." },
      { status: 500 },
    );
  }
}

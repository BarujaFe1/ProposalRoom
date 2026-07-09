import Link from "next/link";
import { PLAN_LIST } from "@/billing/plans";
import { Button } from "@/components/ui";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl">
            ProposalRoom
          </Link>
          <Link href="/signup">
            <Button size="sm">Começar</Button>
          </Link>
        </div>
        <h1 className="font-display text-5xl">Pricing</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-strong)]">
          Comece grátis com marca. Escalone para Pro ou Business quando o volume e a
          remoção de marca fizerem sentido.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLAN_LIST.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-[var(--accent)] bg-[var(--ink)] text-[var(--cream)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <h2 className="font-display text-3xl">{plan.name}</h2>
              <p className="mt-2 text-sm opacity-80">{plan.description}</p>
              <p className="mt-6 font-display text-5xl">
                {plan.priceMonthlyCents === 0 ? "R$ 0" : formatBRL(plan.priceMonthlyCents)}
              </p>
              <p className="text-sm opacity-70">por mês</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Link href="/signup" className="mt-8">
                <Button
                  className="w-full"
                  variant={plan.highlight ? "primary" : "secondary"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          Taxa opcional por proposta premium ou domínio customizado no Business.
        </p>
      </div>
    </div>
  );
}

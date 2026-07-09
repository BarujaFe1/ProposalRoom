import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSignature, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui";
import { PLAN_LIST } from "@/billing/plans";
import { formatBRL } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="font-display text-2xl tracking-wide text-[var(--ink)]">ProposalRoom</div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/pricing" className="hidden text-[var(--muted-strong)] sm:inline">
            Pricing
          </Link>
          <Link href="/login" className="text-[var(--muted-strong)]">
            Entrar
          </Link>
          <Link href="/signup">
            <Button size="sm">Começar</Button>
          </Link>
        </nav>
      </header>

      <section className="hero-wash relative mx-auto mt-2 max-w-6xl overflow-hidden rounded-[28px] px-6 py-16 text-[var(--cream)] sm:px-10 sm:py-24">
        <div className="editorial-grid absolute inset-0 opacity-40" />
        <div className="relative max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
            Proposta como experiência
          </p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-7xl">
            ProposalRoom
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            Do brief à proposta elegante, sala do cliente, aceite digital e pagamento —
            em minutos, com cara de produto premium.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button size="lg">
                Abrir demo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="border-white/20 bg-white/5 text-white">
                Criar conta
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/50">
            Lab only — mock billing. Demo: demo@proposalroom.app / demo1234
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3 sm:px-6">
        {[
          {
            icon: Sparkles,
            title: "Brief → proposta com IA",
            body: "Transforme um brief em seções editoriais prontas para apresentar.",
          },
          {
            icon: FileSignature,
            title: "Sala do cliente",
            body: "Página pública protegida com aceite, status e CTA de pagamento.",
          },
          {
            icon: Wallet,
            title: "Billing preparado",
            body: "Planos, entitlements e webhooks idempotentes com Stripe/MP adapters.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <item.icon className="mb-4 h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-display text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl">Planos claros</h2>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              Free com marca. Pro e Business para quem vende de verdade.
            </p>
          </div>
          <Link href="/pricing" className="text-sm text-[var(--accent)]">
            Ver pricing completo
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PLAN_LIST.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-[var(--accent)] bg-[var(--ink)] text-[var(--cream)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl">{plan.name}</h3>
                {plan.highlight ? (
                  <span className="text-xs uppercase tracking-wider text-[var(--gold)]">Popular</span>
                ) : null}
              </div>
              <p className="mt-3 font-display text-4xl">
                {plan.priceMonthlyCents === 0 ? "Grátis" : formatBRL(plan.priceMonthlyCents)}
                {plan.priceMonthlyCents > 0 ? (
                  <span className="text-base opacity-70">/mês</span>
                ) : null}
              </p>
              <ul className="mt-5 space-y-2 text-sm opacity-90">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)] sm:px-6">
        ProposalRoom · Felipe Alirio Baruja · MIT
      </footer>
    </div>
  );
}

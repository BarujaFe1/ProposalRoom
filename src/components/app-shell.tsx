"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/proposals", label: "Propostas", icon: FileText, exact: false },
  { href: "/app/proposals/new", label: "Nova proposta", icon: Sparkles, exact: true },
  { href: "/app/billing", label: "Billing", icon: CreditCard, exact: true },
  { href: "/app/settings", label: "Settings", icon: Settings, exact: true },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/app") return pathname === href;
  if (href === "/app/proposals") {
    return pathname === "/app/proposals" || /^\/app\/proposals\/[^/]+$/.test(pathname);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActive(pathname, link.href, link.exact);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
              active
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function AppSidebar({
  workspaceName,
  planName,
}: {
  workspaceName: string;
  planName: string;
}) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--ink)] text-[var(--cream)]">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/app" className="font-display text-xl tracking-wide">
          ProposalRoom
        </Link>
        <p className="mt-2 text-xs text-white/60">
          {workspaceName} · {planName}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavLinks />
      </nav>
      <form action="/api/auth/logout" method="post" className="border-t border-white/10 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </form>
    </aside>
  );
}

export function AppTopbar({
  userName,
  breadcrumb,
  workspaceName,
  planName,
}: {
  userName: string;
  breadcrumb?: string;
  workspaceName: string;
  planName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] p-2 text-[var(--foreground)] md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="text-sm text-[var(--muted-strong)]">
            {breadcrumb ?? "Workspace"}
          </div>
        </div>
        <div className="text-sm font-medium text-[var(--foreground)]">{userName}</div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-[var(--ink)] text-[var(--cream)] shadow-xl">
            <div className="border-b border-white/10 px-5 py-5">
              <p className="font-display text-xl">ProposalRoom</p>
              <p className="mt-2 text-xs text-white/60">
                {workspaceName} · {planName}
              </p>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>
            <form
              action="/api/auth/logout"
              method="post"
              className="border-t border-white/10 p-3"
            >
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

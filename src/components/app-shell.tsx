"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/proposals", label: "Propostas", icon: FileText },
  { href: "/app/proposals/new", label: "Nova proposta", icon: Sparkles },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({
  workspaceName,
  planName,
}: {
  workspaceName: string;
  planName: string;
}) {
  const pathname = usePathname();

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
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== "/app" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
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
}: {
  userName: string;
  breadcrumb?: string;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur sm:px-6">
      <div className="text-sm text-[var(--muted-strong)]">
        {breadcrumb ?? "Workspace"}
      </div>
      <div className="text-sm font-medium text-[var(--foreground)]">{userName}</div>
    </header>
  );
}

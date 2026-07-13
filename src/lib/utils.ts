import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createPublicProposalPath } from "./share-link";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  sent: "Enviada",
  viewed: "Visualizada",
  accepted: "Aceita",
  declined: "Recusada",
  expired: "Expirada",
  paid: "Paga",
};

export function formatProposalStatus(status: string) {
  return STATUS_LABELS[status] ?? status;
}

export function publicProposalUrl(publicToken: string) {
  return absoluteUrl(createPublicProposalPath(publicToken));
}

export { createPublicProposalPath };

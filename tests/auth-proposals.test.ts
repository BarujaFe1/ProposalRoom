import { describe, expect, it, beforeEach } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";
import { formatProposalStatus } from "@/lib/utils";
import { resetDatabase, findUserByEmail } from "@/lib/db";
import { authenticate, registerUser } from "@/lib/auth";
import { createProposalFromBrief } from "@/lib/proposals";
import { findWorkspaceForUser } from "@/lib/db";

describe("password hashing", () => {
  it("hashes and verifies with scrypt", () => {
    const stored = hashPassword("demo1234");
    expect(stored.startsWith("scrypt$")).toBe(true);
    expect(verifyPassword("demo1234", stored)).toBe(true);
    expect(verifyPassword("wrong", stored)).toBe(false);
    expect(verifyPassword("demo1234", "plaintext")).toBe(false);
  });
});

describe("formatProposalStatus", () => {
  it("localizes known statuses", () => {
    expect(formatProposalStatus("draft")).toBe("Rascunho");
    expect(formatProposalStatus("accepted")).toBe("Aceita");
    expect(formatProposalStatus("paid")).toBe("Paga");
  });
});

describe("auth + proposals domain", () => {
  beforeEach(() => {
    resetDatabase(true);
  });

  it("authenticates seeded demo user with hashed password", () => {
    const result = authenticate("demo@proposalroom.app", "demo1234");
    expect(result.ok).toBe(true);
    const user = findUserByEmail("demo@proposalroom.app");
    expect(user?.password.startsWith("scrypt$")).toBe(true);
  });

  it("registers with hashed password", () => {
    const result = registerUser({
      name: "Nova Conta",
      email: "nova@example.com",
      password: "secret12",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.password.startsWith("scrypt$")).toBe(true);
      expect(authenticate("nova@example.com", "secret12").ok).toBe(true);
    }
  });

  it("blocks fourth active proposal on starter plan", () => {
    const user = findUserByEmail("demo@proposalroom.app");
    expect(user).toBeTruthy();
    const workspace = findWorkspaceForUser(user!.id);
    expect(workspace).toBeTruthy();
    const result = createProposalFromBrief(workspace!, {
      title: "Quarta proposta",
      clientName: "Cliente Limite",
      clientEmail: "limite@example.com",
      brief: "Brief longo o suficiente para passar na validação Zod do domínio.",
      amountCents: 100000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.upgradeRequired).toBe(true);
  });
});

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import { db, findUserByEmail, findWorkspaceForUser } from "./db";
import type { User, Workspace } from "./types";
import { nanoid } from "nanoid";

const SESSION_COOKIE = "pr_session";

function secretKey() {
  const secret = process.env.AUTH_SECRET ?? "proposalroom-dev-secret-change-me-32b";
  return new TextEncoder().encode(secret);
}

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Senha com pelo menos 6 caracteres."),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Senha com pelo menos 6 caracteres."),
});

export const onboardingSchema = z.object({
  workspaceName: z.string().min(2, "Nome do workspace obrigatório."),
  brandColor: z.string().optional(),
});

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretKey());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  return String(payload.sub ?? "");
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const userId = await verifySessionToken(token);
    return db().users.find((u) => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

export async function getSessionContext(): Promise<{
  user: User;
  workspace: Workspace;
} | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const workspace = findWorkspaceForUser(user.id);
  if (!workspace) return null;
  return { user, workspace };
}

export function authenticate(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { ok: false as const, error: "E-mail ou senha inválidos." };
  }
  return { ok: true as const, user };
}

export function registerUser(input: z.infer<typeof signupSchema>) {
  if (findUserByEmail(input.email)) {
    return { ok: false as const, error: "Já existe uma conta com este e-mail." };
  }
  const user: User = {
    id: `user_${nanoid(8)}`,
    email: input.email.toLowerCase(),
    name: input.name,
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  db().users.push(user);
  return { ok: true as const, user };
}

export function createWorkspaceForUser(
  user: User,
  workspaceName: string,
  brandColor = "#1F3A2E",
) {
  const data = db();
  const slug = workspaceName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const workspace: Workspace = {
    id: `ws_${nanoid(8)}`,
    name: workspaceName,
    slug: slug || `ws-${nanoid(4)}`,
    ownerId: user.id,
    planId: "starter",
    subscriptionStatus: "active",
    brandColor,
    createdAt: new Date().toISOString(),
  };

  data.workspaces.push(workspace);
  data.members.push({
    id: `mem_${nanoid(8)}`,
    workspaceId: workspace.id,
    userId: user.id,
    role: "owner",
  });
  data.usage.push({
    workspaceId: workspace.id,
    activeProposals: 0,
    templates: 0,
    aiGenerationsThisMonth: 0,
    monthKey: new Date().toISOString().slice(0, 7),
  });
  data.templates.push({
    id: `tpl_${nanoid(6)}`,
    workspaceId: workspace.id,
    name: "Modelo inicial",
    description: "Estrutura padrão para propostas comerciais.",
    sections: [
      { title: "Contexto", body: "Resumo do desafio e do objetivo.", order: 1 },
      { title: "Escopo", body: "O que está incluso nesta proposta.", order: 2 },
      { title: "Investimento", body: "Valores e condições.", order: 3 },
    ],
    createdAt: new Date().toISOString(),
  });

  return workspace;
}

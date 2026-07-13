/**
 * SQLite persistence via libsql (local file or optional Turso).
 * Lab default: file:.data/proposalroom.db — survives restarts; not multi-region HA.
 */
import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";

const globalStore = globalThis as unknown as {
  __proposalRoomSql?: Client;
};

export function getSqlitePath() {
  return (
    process.env.SQLITE_PATH ??
    path.join(process.cwd(), ".data", "proposalroom.db")
  );
}

export function getSqlClient(): Client {
  if (globalStore.__proposalRoomSql) return globalStore.__proposalRoomSql;

  const remote =
    process.env.TURSO_DATABASE_URL ??
    (process.env.DATABASE_URL?.startsWith("libsql://") ||
    process.env.DATABASE_URL?.startsWith("https://")
      ? process.env.DATABASE_URL
      : undefined);

  if (remote) {
    globalStore.__proposalRoomSql = createClient({
      url: remote,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return globalStore.__proposalRoomSql;
  }

  if (process.env.SQLITE_URL === ":memory:" || process.env.VITEST) {
    globalStore.__proposalRoomSql = createClient({ url: ":memory:" });
    return globalStore.__proposalRoomSql;
  }

  const file = getSqlitePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // libsql file URLs need forward slashes on Windows
  const url = `file:${file.replace(/\\/g, "/")}`;
  globalStore.__proposalRoomSql = createClient({ url });
  return globalStore.__proposalRoomSql;
}

export async function migrateSql(client = getSqlClient()) {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      owner_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      subscription_status TEXT NOT NULL,
      billing_customer_id TEXT,
      brand_color TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workspace_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      UNIQUE(workspace_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      sections_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      brief TEXT NOT NULL,
      status TEXT NOT NULL,
      currency TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      public_slug TEXT NOT NULL,
      public_token TEXT NOT NULL UNIQUE,
      sections_json TEXT NOT NULL,
      template_id TEXT,
      accepted_at TEXT,
      viewed_at TEXT,
      sent_at TEXT,
      payment_url TEXT,
      reminder_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS usage_counters (
      workspace_id TEXT PRIMARY KEY,
      active_proposals INTEGER NOT NULL,
      templates INTEGER NOT NULL,
      ai_generations_this_month INTEGER NOT NULL,
      month_key TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      actor_id TEXT,
      action TEXT NOT NULL,
      meta_json TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subscription_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_proposals_workspace ON proposals(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_members_user ON workspace_members(user_id);
  `);
}

export function resetSqlClientForTests() {
  globalStore.__proposalRoomSql = undefined;
}

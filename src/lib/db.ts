/**
 * Data access facade — SQLite-backed (libsql file or Turso).
 * Domain code keeps an in-process cache that write-through persists.
 */
export {
  db,
  ensureDb,
  resetDatabase,
  seedDemoDatabase,
  buildSeedDatabase,
  getUsage,
  recountActiveProposals,
  findUserByEmail,
  findWorkspaceForUser,
  findProposalByPublic,
  findProposalByAccessToken,
  saveDb,
  persistDb,
} from "./store/repo";

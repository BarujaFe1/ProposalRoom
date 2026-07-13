/** Lab / portfolio demo mode — mock billing, in-memory DB, no real payments. */
export function isDemoMode() {
  return (process.env.DEMO_MODE ?? "true").toLowerCase() !== "false";
}

export function getAuthSecretBytes() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" && !isDemoMode()) {
      throw new Error("AUTH_SECRET is required when DEMO_MODE=false in production.");
    }
    // Dev / lab fallback only — never use for a real production tenant.
    return new TextEncoder().encode("proposalroom-dev-secret-change-me-32b");
  }
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

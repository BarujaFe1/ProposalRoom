/** Opaque client-room access path — token is not passed as a query string. */
export function createPublicProposalPath(publicToken: string) {
  return `/r/${encodeURIComponent(publicToken)}`;
}

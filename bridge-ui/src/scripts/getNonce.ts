/**
 * Helper function to get the nonce from headers
 * This is used in layout.tsx to add nonces to scripts
 */
export function getNonce(headers: Headers): string {
  return headers.get("x-nonce") || "";
}

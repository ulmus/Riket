// Shared helpers for the character-vault API (Cloudflare Pages Functions).
// Underscore-prefixed dirs are excluded from routing but importable by routes.

export const SESSION_COOKIE = "irt_session";
export const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days, seconds

const enc = new TextEncoder();

/** JSON response with the right content type. */
export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

/** `{ error }` JSON response with a status code. */
export function error(status, message) {
  return json({ error: message }, { status });
}

/** Parse a JSON request body, returning null for anything that isn't an object. */
export async function readJson(request) {
  try {
    const data = await request.json();
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export function b64urlEncode(bytes) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** SHA-256 of a string, as lowercase hex. */
export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function hmacSign(secret, data) {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

/** Constant-time HMAC verification (SubtleCrypto.verify). */
export async function hmacVerify(secret, data, signature) {
  let sigBytes;
  try {
    sigBytes = b64urlDecode(signature);
  } catch {
    return false;
  }
  return crypto.subtle.verify("HMAC", await hmacKey(secret), sigBytes, enc.encode(data));
}

/** Cryptographically random URL-safe token. */
export function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return b64urlEncode(arr);
}

export function nowSec() {
  return Math.floor(Date.now() / 1000);
}

import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "auth";

// Sessions end 60 minutes after login; the passcode is asked again.
export const SESSION_SECONDS = 60 * 60;

function secret(): string {
  const s = process.env.APP_PASSCODE;
  if (!s) throw new Error("APP_PASSCODE is not set");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

// The payload is the login time (ms). Signing it means expiry is enforced
// server-side too — an old cookie value fails even if the browser kept it.
export function makeAuthCookieValue(): string {
  const payload = String(Date.now());
  return `${payload}.${sign(payload)}`;
}

export function verifyAuthCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, mac] = value.split(".");
  if (!payload || !mac) return false;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const issuedAt = Number(payload);
  if (!Number.isFinite(issuedAt)) return false;
  const ageMs = Date.now() - issuedAt;
  return ageMs >= 0 && ageMs < SESSION_SECONDS * 1000;
}

export function verifyPasscode(input: string): boolean {
  const expected = secret();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

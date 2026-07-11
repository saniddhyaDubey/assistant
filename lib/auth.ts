import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "auth";

function secret(): string {
  const s = process.env.APP_PASSCODE;
  if (!s) throw new Error("APP_PASSCODE is not set");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function makeAuthCookieValue(): string {
  const payload = "ok";
  return `${payload}.${sign(payload)}`;
}

export function verifyAuthCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, mac] = value.split(".");
  if (!payload || !mac) return false;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b) && payload === "ok";
}

export function verifyPasscode(input: string): boolean {
  const expected = secret();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

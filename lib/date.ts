const TZ = "Asia/Kolkata";

export function todayKey(): string {
  return dateToKey(new Date());
}

export function dateToKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function shiftKey(key: string, days: number): string {
  const d = keyToDate(key);
  d.setUTCDate(d.getUTCDate() + days);
  return dateToKey(d);
}

export function formatKeyLong(key: string): string {
  const d = keyToDate(key);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatKeyShort(key: string): string {
  const d = keyToDate(key);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function isToday(key: string): boolean {
  return key === todayKey();
}

export function isFutureKey(key: string): boolean {
  return key > todayKey();
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  let k = todayKey();
  for (let i = 0; i < n; i++) {
    out.push(k);
    k = shiftKey(k, -1);
  }
  return out.reverse();
}

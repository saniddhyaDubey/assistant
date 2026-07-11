const TZ = "America/New_York";

// Formats the current instant as a YYYY-MM-DD key in the user's timezone.
// Only "now" goes through TZ; all key arithmetic below stays in UTC, because
// keys are calendar dates, not instants.
export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Formats an instant as HH:mm in the user's timezone (for capture timestamps).
export function formatTime(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function utcDateToKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftKey(key: string, days: number): string {
  const d = keyToDate(key);
  d.setUTCDate(d.getUTCDate() + days);
  return utcDateToKey(d);
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

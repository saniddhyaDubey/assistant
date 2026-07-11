import Link from "next/link";
import { formatKeyLong, formatKeyShort, isFutureKey, isToday, shiftKey } from "@/lib/date";

export function DateNav({ date }: { date: string }) {
  const prev = shiftKey(date, -1);
  const next = shiftKey(date, 1);
  const nextDisabled = isFutureKey(next);

  return (
    <div className="mb-8 text-center">
      {!isToday(date) && (
        <Link href="/" className="text-sm text-accent hover:underline">
          ↩ back to today
        </Link>
      )}
      <h1 className="mt-2 text-xl font-bold">{formatKeyLong(date)}</h1>
      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/day/${prev}`}
          className="border border-border px-3 py-1.5 text-sm hover:border-foreground transition-colors"
        >
          ← {formatKeyShort(prev)}
        </Link>
        {nextDisabled ? (
          <span className="border border-border px-3 py-1.5 text-sm text-muted opacity-40">→</span>
        ) : (
          <Link
            href={`/day/${next}`}
            className="border border-border px-3 py-1.5 text-sm hover:border-foreground transition-colors"
          >
            {formatKeyShort(next)} →
          </Link>
        )}
      </div>
    </div>
  );
}

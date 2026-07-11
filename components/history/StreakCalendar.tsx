import Link from "next/link";
import { LogSummary } from "@/app/actions/daily-log";
import { isToday, keyToDate } from "@/lib/date";

function intensityClass(summary: LogSummary | undefined): string {
  if (!summary || summary.totalCount === 0) return "bg-transparent border-border";
  const ratio = summary.completedCount / summary.totalCount;
  if (ratio === 0) return "bg-transparent border-border";
  if (ratio < 0.34) return "bg-accent/25 border-accent/25";
  if (ratio < 0.67) return "bg-accent/55 border-accent/55";
  return "bg-accent border-accent";
}

export function StreakCalendar({ days, byDate }: { days: string[]; byDate: Map<string, LogSummary> }) {
  const firstDow = keyToDate(days[0]).getUTCDay();
  const leadingBlanks = Array.from({ length: firstDow });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((date) => {
          const summary = byDate.get(date);
          const today = isToday(date);
          return (
            <Link
              key={date}
              href={today ? "/" : `/day/${date}`}
              title={`${date}${summary ? ` — ${summary.completedCount}/${summary.totalCount}` : ""}`}
              className={`aspect-square w-full border transition-colors hover:border-foreground ${intensityClass(
                summary
              )} ${today ? "ring-1 ring-foreground" : ""}`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted">
        <span>less</span>
        <div className="h-3 w-3 border border-border" />
        <div className="h-3 w-3 border border-accent/25 bg-accent/25" />
        <div className="h-3 w-3 border border-accent/55 bg-accent/55" />
        <div className="h-3 w-3 border border-accent bg-accent" />
        <span>more</span>
      </div>
    </div>
  );
}

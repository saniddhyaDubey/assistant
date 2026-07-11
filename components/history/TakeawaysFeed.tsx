import Link from "next/link";
import { LogSummary } from "@/app/actions/daily-log";
import { formatKeyLong, isToday } from "@/lib/date";

export function TakeawaysFeed({ logs }: { logs: LogSummary[] }) {
  const withContent = logs
    .filter((l) => l.takeaways.trim() || l.mits.length > 0)
    .slice()
    .reverse();

  if (withContent.length === 0) {
    return <p className="text-sm text-muted">Nothing logged yet — entries will show up here as you go.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {withContent.map((log) => (
        <li key={log.date} className="border border-border p-4">
          <Link
            href={isToday(log.date) ? "/" : `/day/${log.date}`}
            className="text-sm font-bold hover:text-accent transition-colors"
          >
            {formatKeyLong(log.date)}
          </Link>
          {log.mits.length > 0 && (
            <ul className="mt-2 flex flex-col gap-0.5 text-sm text-muted">
              {log.mits.map((m, i) => (
                <li key={i} className={m.done ? "line-through" : ""}>
                  {m.done ? "☑" : "☐"} {m.text}
                </li>
              ))}
            </ul>
          )}
          {log.takeaways.trim() && (
            <p className="mt-2 whitespace-pre-wrap text-sm">{log.takeaways}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

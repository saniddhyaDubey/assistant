import { listLogsInRange } from "@/app/actions/daily-log";
import { lastNDays } from "@/lib/date";
import { StreakCalendar } from "@/components/history/StreakCalendar";
import { TakeawaysFeed } from "@/components/history/TakeawaysFeed";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default async function HistoryPage() {
  const days = lastNDays(90);
  const logs = await listLogsInRange(days[0], days[days.length - 1]);
  const byDate = new Map(logs.map((l) => [l.date, l]));

  return (
    <div>
      <h1 className="mb-8 text-xl font-bold">
        <span className="text-accent">// </span>history
      </h1>

      <div className="mb-10">
        <SectionHeader>last 90 days</SectionHeader>
        <StreakCalendar days={days} byDate={byDate} />
      </div>

      <div>
        <SectionHeader>takeaways</SectionHeader>
        <TakeawaysFeed logs={logs} />
      </div>
    </div>
  );
}

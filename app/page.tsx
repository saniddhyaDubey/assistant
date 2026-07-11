import { DailyView } from "@/components/daily/DailyView";
import { todayKey } from "@/lib/date";

// Render per-request: "today" changes daily and the log is live data.
export const dynamic = "force-dynamic";

export default function Home() {
  return <DailyView date={todayKey()} isTodayView />;
}

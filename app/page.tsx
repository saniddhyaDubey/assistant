import { DailyView } from "@/components/daily/DailyView";
import { todayKey } from "@/lib/date";

export default function Home() {
  return <DailyView date={todayKey()} isTodayView />;
}

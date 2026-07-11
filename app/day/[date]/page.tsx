import { redirect, notFound } from "next/navigation";
import { DailyView } from "@/components/daily/DailyView";
import { isFutureKey, isToday, todayKey } from "@/lib/date";

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  if (!DATE_KEY_RE.test(date)) notFound();
  if (isToday(date)) redirect("/");
  if (isFutureKey(date)) redirect(`/day/${todayKey()}`);

  return <DailyView date={date} />;
}

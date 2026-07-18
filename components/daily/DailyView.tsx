import { getOrCreateLog } from "@/app/actions/daily-log";
import { listUnsortedToday, sweepStaleInbox } from "@/app/actions/inbox";
import { QuickCapture } from "./QuickCapture";
import { InboxList } from "./InboxList";
import { MitList } from "./MitList";
import { Checklist } from "./Checklist";
import { FreeTextSection } from "./FreeTextSection";
import { DateNav } from "@/components/ui/DateNav";
import { formatTime } from "@/lib/date";

export async function DailyView({ date, isTodayView = false }: { date: string; isTodayView?: boolean }) {
  if (isTodayView) await sweepStaleInbox();
  const log = await getOrCreateLog(date);
  const inboxItems = isTodayView
    ? (await listUnsortedToday()).map((item) => ({
        id: item.id,
        text: item.text,
        time: formatTime(item.createdAt),
      }))
    : [];

  return (
    <div>
      {isTodayView ? (
        <h1 className="mb-8 text-xl font-bold">
          <span className="text-accent">// </span>today
        </h1>
      ) : (
        <DateNav date={date} />
      )}

      {isTodayView && <QuickCapture />}
      {isTodayView && <InboxList items={inboxItems} />}

      <MitList date={date} initialItems={log.mits} />
      <Checklist title="routine" date={date} field="routineChecklist" initialItems={log.routineChecklist} />
      <Checklist title="diet" date={date} field="dietChecklist" initialItems={log.dietChecklist} />
      <FreeTextSection
        title="diet notes"
        date={date}
        field="dietNotes"
        initialValue={log.dietNotes}
        placeholder="anything about food today — cravings, skipped meals, what worked..."
        rows={2}
      />
      <FreeTextSection
        title="brain dump"
        date={date}
        field="brainDump"
        initialValue={log.brainDump}
        placeholder="whatever's on your mind..."
      />
      <FreeTextSection
        title="side quests"
        date={date}
        field="sideQuests"
        initialValue={log.sideQuests}
        placeholder="side project ideas, things to try..."
        rows={3}
      />
      <FreeTextSection
        title="work notes"
        date={date}
        field="workNotes"
        initialValue={log.workNotes}
        placeholder="internship todos, thoughts..."
        rows={3}
      />
      <FreeTextSection
        title="top 3 takeaways"
        date={date}
        field="takeaways"
        initialValue={log.takeaways}
        placeholder="what did you learn today?"
        rows={3}
      />
    </div>
  );
}

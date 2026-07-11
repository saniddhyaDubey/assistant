import { getOrCreateLog } from "@/app/actions/daily-log";
import { listUnsortedToday } from "@/app/actions/inbox";
import { QuickCapture } from "./QuickCapture";
import { InboxList } from "./InboxList";
import { MitList } from "./MitList";
import { Checklist } from "./Checklist";
import { FreeTextSection } from "./FreeTextSection";
import { DateNav } from "@/components/ui/DateNav";

export async function DailyView({ date, isTodayView = false }: { date: string; isTodayView?: boolean }) {
  const log = await getOrCreateLog(date);
  const inboxItems = isTodayView ? await listUnsortedToday() : [];

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

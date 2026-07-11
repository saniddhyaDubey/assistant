"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_DIET_CHECKLIST, DEFAULT_ROUTINE_CHECKLIST, ChecklistItem, MitItem } from "@/lib/defaults";
import { isFutureKey, todayKey } from "@/lib/date";

export type DailyLogData = {
  date: string;
  mits: MitItem[];
  routineChecklist: ChecklistItem[];
  dietChecklist: ChecklistItem[];
  brainDump: string;
  sideQuests: string;
  workNotes: string;
  takeaways: string;
};

export async function getOrCreateLog(date: string): Promise<DailyLogData> {
  const existing = await prisma.dailyLog.findUnique({ where: { date } });

  if (existing) {
    return {
      date: existing.date,
      mits: (existing.mits as MitItem[]) ?? [],
      routineChecklist: (existing.routineChecklist as ChecklistItem[]) ?? [],
      dietChecklist: (existing.dietChecklist as ChecklistItem[]) ?? [],
      brainDump: existing.brainDump ?? "",
      sideQuests: existing.sideQuests ?? "",
      workNotes: existing.workNotes ?? "",
      takeaways: existing.takeaways ?? "",
    };
  }

  return {
    date,
    mits: [],
    routineChecklist: DEFAULT_ROUTINE_CHECKLIST,
    dietChecklist: DEFAULT_DIET_CHECKLIST,
    brainDump: "",
    sideQuests: "",
    workNotes: "",
    takeaways: "",
  };
}

async function ensureLog(date: string) {
  if (isFutureKey(date)) throw new Error("Cannot edit a future date");

  await prisma.dailyLog.upsert({
    where: { date },
    update: {},
    create: {
      date,
      mits: [],
      routineChecklist: DEFAULT_ROUTINE_CHECKLIST,
      dietChecklist: DEFAULT_DIET_CHECKLIST,
    },
  });
}

export async function updateLogField(
  date: string,
  field: "brainDump" | "sideQuests" | "workNotes" | "takeaways",
  value: string
) {
  await ensureLog(date);
  await prisma.dailyLog.update({ where: { date }, data: { [field]: value } });
  revalidatePath(date === todayKey() ? "/" : `/day/${date}`);
}

export async function updateMits(date: string, mits: MitItem[]) {
  await ensureLog(date);
  await prisma.dailyLog.update({ where: { date }, data: { mits } });
}

export async function updateChecklist(
  date: string,
  field: "routineChecklist" | "dietChecklist",
  items: ChecklistItem[]
) {
  await ensureLog(date);
  await prisma.dailyLog.update({ where: { date }, data: { [field]: items } });
}

export type LogSummary = {
  date: string;
  completedCount: number;
  totalCount: number;
  takeaways: string;
  mits: MitItem[];
};

export async function listLogsInRange(fromDate: string, toDate: string): Promise<LogSummary[]> {
  const logs = await prisma.dailyLog.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
    orderBy: { date: "asc" },
  });

  return logs.map((log) => {
    const routine = (log.routineChecklist as ChecklistItem[]) ?? [];
    const diet = (log.dietChecklist as ChecklistItem[]) ?? [];
    const mits = (log.mits as MitItem[]) ?? [];
    const all = [...routine, ...diet, ...mits.map((m) => ({ done: m.done }))];

    return {
      date: log.date,
      completedCount: all.filter((i) => i.done).length,
      totalCount: all.length,
      takeaways: log.takeaways ?? "",
      mits,
    };
  });
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/date";
import { DEFAULT_DIET_CHECKLIST, DEFAULT_ROUTINE_CHECKLIST } from "@/lib/defaults";

export async function addInboxItem(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  await prisma.inboxItem.create({
    data: { text: trimmed, date: todayKey() },
  });
  revalidatePath("/");
}

export async function listUnsortedToday() {
  return prisma.inboxItem.findMany({
    where: { date: todayKey(), sorted: false },
    orderBy: { createdAt: "asc" },
  });
}

// Moves an inbox item into one of today's free-text sections (appended as a
// bullet line), then clears it from the inbox.
export async function sortInboxItemTo(
  id: string,
  field: "brainDump" | "sideQuests" | "workNotes"
) {
  const item = await prisma.inboxItem.findUnique({ where: { id } });
  if (!item) return;

  const date = todayKey();
  const log = await prisma.dailyLog.upsert({
    where: { date },
    update: {},
    create: {
      date,
      mits: [],
      routineChecklist: DEFAULT_ROUTINE_CHECKLIST,
      dietChecklist: DEFAULT_DIET_CHECKLIST,
    },
  });

  const existing = log[field] ?? "";
  const line = `- ${item.text}`;
  const next = existing.trim() ? `${existing.replace(/\s+$/, "")}\n${line}` : line;

  await prisma.$transaction([
    prisma.dailyLog.update({ where: { date }, data: { [field]: next } }),
    prisma.inboxItem.update({ where: { id }, data: { sorted: true } }),
  ]);
  revalidatePath("/");
}

export async function deleteInboxItem(id: string) {
  await prisma.inboxItem.delete({ where: { id } });
  revalidatePath("/");
}

// End-of-day safety net: any capture left unsorted when its day ended gets
// moved into that day's brain dump, so thoughts never silently vanish at the
// day boundary. Runs on each load of the today view; no-op when nothing is
// stale.
export async function sweepStaleInbox() {
  const stale = await prisma.inboxItem.findMany({
    where: { sorted: false, date: { lt: todayKey() } },
    orderBy: { createdAt: "asc" },
  });
  if (stale.length === 0) return;

  const byDate = new Map<string, typeof stale>();
  for (const item of stale) {
    byDate.set(item.date, [...(byDate.get(item.date) ?? []), item]);
  }

  for (const [date, items] of byDate) {
    const log = await prisma.dailyLog.upsert({
      where: { date },
      update: {},
      create: {
        date,
        mits: [],
        routineChecklist: DEFAULT_ROUTINE_CHECKLIST,
        dietChecklist: DEFAULT_DIET_CHECKLIST,
      },
    });

    const lines = items.map((i) => `- ${i.text}`).join("\n");
    const existing = log.brainDump ?? "";
    const next = existing.trim() ? `${existing.replace(/\s+$/, "")}\n${lines}` : lines;

    await prisma.$transaction([
      prisma.dailyLog.update({ where: { date }, data: { brainDump: next } }),
      prisma.inboxItem.updateMany({
        where: { id: { in: items.map((i) => i.id) } },
        data: { sorted: true },
      }),
    ]);
  }
}

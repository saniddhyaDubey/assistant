"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/date";

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

export async function markSorted(id: string) {
  await prisma.inboxItem.update({ where: { id }, data: { sorted: true } });
  revalidatePath("/");
}

export async function deleteInboxItem(id: string) {
  await prisma.inboxItem.delete({ where: { id } });
  revalidatePath("/");
}

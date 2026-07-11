"use client";

import { useTransition } from "react";
import { deleteInboxItem, markSorted } from "@/app/actions/inbox";
import { SectionHeader } from "@/components/ui/SectionHeader";

type InboxItemData = { id: string; text: string };

export function InboxList({ items }: { items: InboxItemData[] }) {
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <SectionHeader>inbox ({items.length})</SectionHeader>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 border border-border px-3 py-2 text-sm"
          >
            <span>{item.text}</span>
            <div className="flex shrink-0 gap-3 text-xs text-muted">
              <button
                disabled={isPending}
                onClick={() => startTransition(() => markSorted(item.id))}
                className="hover:text-accent transition-colors"
              >
                → sort
              </button>
              <button
                disabled={isPending}
                onClick={() => startTransition(() => deleteInboxItem(item.id))}
                className="hover:text-accent transition-colors"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

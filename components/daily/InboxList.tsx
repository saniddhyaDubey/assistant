"use client";

import { useState, useTransition } from "react";
import { deleteInboxItem, sortInboxItemTo } from "@/app/actions/inbox";
import { SectionHeader } from "@/components/ui/SectionHeader";

type InboxItemData = { id: string; text: string; time: string };

const DESTINATIONS = [
  { label: "dump", field: "brainDump" },
  { label: "quest", field: "sideQuests" },
  { label: "work", field: "workNotes" },
] as const;

export function InboxList({ items }: { items: InboxItemData[] }) {
  const [, startTransition] = useTransition();
  // Optimistically hide items on click so the UI responds instantly; unhide
  // if the server action fails.
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  function run(id: string, action: () => Promise<void>) {
    setHiddenIds((ids) => [...ids, id]);
    startTransition(async () => {
      try {
        await action();
      } catch {
        setHiddenIds((ids) => ids.filter((x) => x !== id));
      }
    });
  }

  const visible = items.filter((item) => !hiddenIds.includes(item.id));
  if (visible.length === 0) return null;

  return (
    <div className="mb-8">
      <SectionHeader>inbox ({visible.length})</SectionHeader>
      <ul className="flex flex-col gap-1.5">
        {visible.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border border-border px-3 py-2 text-sm"
          >
            <span>
              <span className="mr-2 text-xs text-muted tabular-nums">{item.time}</span>
              {item.text}
            </span>
            <div className="flex shrink-0 gap-3 text-xs text-muted">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.field}
                  onClick={() => run(item.id, () => sortInboxItemTo(item.id, dest.field))}
                  className="hover:text-accent transition-colors"
                >
                  → {dest.label}
                </button>
              ))}
              <button
                onClick={() => run(item.id, () => deleteInboxItem(item.id))}
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

"use client";

import { useState, useTransition } from "react";
import { updateMits } from "@/app/actions/daily-log";
import { MitItem } from "@/lib/defaults";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function MitList({ date, initialItems }: { date: string; initialItems: MitItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState("");
  const [, startTransition] = useTransition();

  function persist(next: MitItem[]) {
    setItems(next);
    startTransition(() => updateMits(date, next));
  }

  function add() {
    const text = draft.trim();
    if (!text || items.length >= 3) return;
    setDraft("");
    persist([...items, { text, done: false }]);
  }

  function toggle(i: number) {
    persist(items.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)));
  }

  function remove(i: number) {
    persist(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="mb-8">
      <SectionHeader>most important (top 3)</SectionHeader>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 border border-border px-3 py-2 text-sm">
            <button
              onClick={() => toggle(i)}
              className={item.done ? "text-accent" : "text-muted hover:text-foreground"}
            >
              {item.done ? "☑" : "☐"}
            </button>
            <span className={item.done ? "flex-1 text-muted line-through" : "flex-1"}>{item.text}</span>
            <button onClick={() => remove(i)} className="text-xs text-muted hover:text-accent">
              ×
            </button>
          </li>
        ))}
      </ul>
      {items.length < 3 && (
        <div className="mt-1.5 flex border border-border focus-within:border-foreground transition-colors">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="add a top task..."
            className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted"
          />
        </div>
      )}
    </div>
  );
}

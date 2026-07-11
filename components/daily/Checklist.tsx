"use client";

import { useState, useTransition } from "react";
import { updateChecklist } from "@/app/actions/daily-log";
import { ChecklistItem } from "@/lib/defaults";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Checklist({
  title,
  date,
  field,
  initialItems,
}: {
  title: string;
  date: string;
  field: "routineChecklist" | "dietChecklist";
  initialItems: ChecklistItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState("");
  const [, startTransition] = useTransition();

  function save(next: ChecklistItem[]) {
    setItems(next);
    startTransition(() => updateChecklist(date, field, next));
  }

  function toggle(index: number) {
    save(items.map((item, i) => (i === index ? { ...item, done: !item.done } : item)));
  }

  function remove(index: number) {
    save(items.filter((_, i) => i !== index));
  }

  function add() {
    const label = draft.trim();
    if (!label || items.some((i) => i.label.toLowerCase() === label.toLowerCase())) return;
    setDraft("");
    save([...items, { label, done: false }]);
  }

  return (
    <div className="mb-8">
      <SectionHeader>{title}</SectionHeader>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <span
            key={item.label}
            className={`group flex items-center border text-sm transition-colors ${
              item.done
                ? "border-accent text-accent"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            <button onClick={() => toggle(i)} className="px-3 py-1.5">
              {item.done ? "✓ " : ""}
              {item.label}
            </button>
            <button
              onClick={() => remove(i)}
              aria-label={`remove ${item.label}`}
              className="pr-2 text-xs opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          onBlur={() => draft.trim() && add()}
          placeholder="+ add"
          className="w-20 bg-transparent px-1 py-1.5 text-sm text-muted outline-none placeholder:text-muted focus:w-40 focus:text-foreground transition-all"
        />
      </div>
    </div>
  );
}

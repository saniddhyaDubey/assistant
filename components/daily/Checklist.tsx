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
  const [, startTransition] = useTransition();

  function toggle(index: number) {
    const next = items.map((item, i) => (i === index ? { ...item, done: !item.done } : item));
    setItems(next);
    startTransition(() => updateChecklist(date, field, next));
  }

  return (
    <div className="mb-8">
      <SectionHeader>{title}</SectionHeader>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => toggle(i)}
            className={`border px-3 py-1.5 text-sm transition-colors ${
              item.done
                ? "border-accent text-accent"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {item.done ? "✓ " : ""}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

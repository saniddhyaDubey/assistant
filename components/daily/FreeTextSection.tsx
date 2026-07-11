"use client";

import { useEffect, useRef, useState } from "react";
import { updateLogField } from "@/app/actions/daily-log";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Field = "brainDump" | "sideQuests" | "workNotes" | "takeaways";

export function FreeTextSection({
  title,
  date,
  field,
  initialValue,
  placeholder,
  rows = 4,
}: {
  title: string;
  date: string;
  field: Field;
  initialValue: string;
  placeholder?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function onChange(next: string) {
    setValue(next);
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateLogField(date, field, next);
      setStatus("saved");
      timer.current = setTimeout(() => setStatus("idle"), 1200);
    }, 700);
  }

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <SectionHeader>{title}</SectionHeader>
        <span className="text-xs text-muted">
          {status === "saving" ? "saving..." : status === "saved" ? "saved" : ""}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-foreground"
      />
    </div>
  );
}

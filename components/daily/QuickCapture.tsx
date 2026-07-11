"use client";

import { useRef, useState, useTransition } from "react";
import { addInboxItem } from "@/app/actions/inbox";

export function QuickCapture() {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const text = value.trim();
    if (!text) return;
    setValue("");
    startTransition(async () => {
      await addInboxItem(text);
      inputRef.current?.focus();
    });
  }

  return (
    <div className="mb-8 flex border border-border focus-within:border-foreground transition-colors">
      <span className="flex items-center pl-3 text-accent">›</span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="capture a thought, todo, idea..."
        className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-muted"
      />
      {isPending && <span className="flex items-center pr-3 text-xs text-muted">...</span>}
    </div>
  );
}

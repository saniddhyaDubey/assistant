"use client";

import { useEffect, useRef, useState } from "react";
import { updateLogField, type FreeTextField } from "@/app/actions/daily-log";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
  field: FreeTextField;
  initialValue: string;
  placeholder?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastServer = useRef(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fit height to content — grows as text comes in (typed or sorted from the
  // inbox), shrinks when text is deleted. `rows` stays the minimum.
  function fit() {
    const el = textareaRef.current;
    if (!el || el.clientWidth === 0) return; // layout not settled — don't measure
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`; // +2 for the 1px borders
  }

  useEffect(fit, [value]);

  // Width changes (layout settling, window resize) change how text wraps, so
  // the fitted height is only valid for the width it was measured at.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    let lastWidth = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== lastWidth) {
        lastWidth = el.clientWidth;
        fit();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // The server can change this field behind our back (inbox "→ sort" appends
  // to it). Sync those changes in — but never re-apply echoes of our own
  // saves, and never an echo older than what we've already sent.
  useEffect(() => {
    if (initialValue === lastServer.current) return;
    const prev = lastServer.current;
    if (prev.startsWith(initialValue)) return; // stale echo of an older save
    lastServer.current = initialValue;
    setValue((current) => {
      if (current === initialValue) return current; // already in sync
      if (current === prev) return initialValue; // no local edits — adopt server value
      if (initialValue.startsWith(prev)) {
        // Local edits in flight; graft the server-side addition onto them.
        const appended = initialValue.slice(prev.length).replace(/^\n+/, "");
        const base = current.replace(/\s+$/, "");
        return base ? `${base}\n${appended}` : appended;
      }
      return current; // diverged some other way — keep what the user sees
    });
  }, [initialValue]);

  function onChange(next: string) {
    setValue(next);
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      // Record what we sent so the revalidation echo of this save is
      // recognized as our own text, not as a server-side change.
      lastServer.current = next;
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
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none overflow-hidden border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-foreground"
      />
    </div>
  );
}

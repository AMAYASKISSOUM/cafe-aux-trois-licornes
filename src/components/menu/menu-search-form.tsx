"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

export function MenuSearchForm({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder: string;
  defaultValue?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    <form ref={formRef} role="search" className="relative w-full max-w-sm">
      <label htmlFor="menu-search" className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        aria-hidden
      />
      <input
        id="menu-search"
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-[var(--radius-sm)] border border-line bg-paper pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus-visible:border-ink"
        onChange={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => formRef.current?.requestSubmit(), 300);
        }}
      />
    </form>
  );
}

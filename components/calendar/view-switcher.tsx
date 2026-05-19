"use client";

import { cn } from "@/lib/utils";
import { CalendarView } from "@/lib/dates";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "two-month", label: "2M" },
  { value: "three-month", label: "3M" },
  { value: "year", label: "Year" },
];

export function ViewSwitcher({
  value,
  onChange,
}: {
  value: CalendarView;
  onChange: (v: CalendarView) => void;
}) {
  return (
    <div className="flex w-full rounded-2xl border border-border/60 bg-card/60 p-1">
      {VIEWS.map((v) => {
        const active = v.value === value;
        return (
          <button
            key={v.value}
            type="button"
            onClick={() => onChange(v.value)}
            className={cn(
              "flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition",
              active
                ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

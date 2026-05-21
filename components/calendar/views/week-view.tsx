"use client";

import { addDays, format, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { isoDate } from "@/lib/dates";
import { CalendarCell } from "../calendar-cell";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function WeekView({
  anchor,
  pnlByDate,
  tradeCountByDate,
}: {
  anchor: Date;
  pnlByDate: Map<string, number>;
  tradeCountByDate: Map<string, number>;
}) {
  const today = startOfDay(new Date());
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(start, i));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <div className="grid grid-cols-5 gap-1 pb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/80 sm:gap-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pl-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {days.map((d) => {
          const iso = isoDate(d);
          return (
            <div key={iso} className="aspect-square">
              <CalendarCell
                date={iso}
                isToday={isSameDay(d, today)}
                pnl={pnlByDate.get(iso) ?? null}
                tradeCount={tradeCountByDate.get(iso) ?? 0}
                size="md"
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-center text-[10px] text-muted-foreground">
        {format(start, "d MMM")} – {format(addDays(start, 4), "d MMM yyyy")}
      </div>
    </div>
  );
}

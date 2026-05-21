"use client";

import { gridDaysForMonth, isoDate, isWeekday } from "@/lib/dates";
import { isSameDay, isSameMonth, startOfDay } from "date-fns";
import { CalendarCell } from "../calendar-cell";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function MonthView({
  anchor,
  pnlByDate,
  tradeCountByDate,
}: {
  anchor: Date;
  pnlByDate: Map<string, number>;
  tradeCountByDate: Map<string, number>;
}) {
  const today = startOfDay(new Date());
  const days = gridDaysForMonth(anchor).filter(isWeekday);

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
          const pnl = pnlByDate.get(iso) ?? null;
          return (
            <div key={iso} className="aspect-square">
              <CalendarCell
                date={iso}
                isCurrentMonth={isSameMonth(d, anchor)}
                isToday={isSameDay(d, today)}
                pnl={pnl}
                tradeCount={tradeCountByDate.get(iso) ?? 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

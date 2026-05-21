"use client";

import { subMonths } from "date-fns";
import { formatMonthLabel, gridDaysForMonth, isoDate, isWeekday } from "@/lib/dates";
import { isSameDay, isSameMonth, startOfDay } from "date-fns";
import { CalendarCell } from "../calendar-cell";

const WEEKDAYS = ["M", "T", "W", "T", "F"];

export function MultiMonthView({
  anchor,
  count,
  pnlByDate,
  tradeCountByDate,
}: {
  anchor: Date;
  count: 2 | 3;
  pnlByDate: Map<string, number>;
  tradeCountByDate: Map<string, number>;
}) {
  const today = startOfDay(new Date());
  const months = Array.from({ length: count }, (_, i) => subMonths(anchor, count - 1 - i));

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
      {months.map((m) => {
        const days = gridDaysForMonth(m).filter(isWeekday);
        return (
          <div key={m.toISOString()} className="flex flex-col">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {formatMonthLabel(m)}
            </div>
            <div className="grid grid-cols-5 gap-1 pb-1 text-center text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {WEEKDAYS.map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {days.map((d) => {
                const iso = isoDate(d);
                return (
                  <div key={iso} className="aspect-square">
                    <CalendarCell
                      date={iso}
                      isCurrentMonth={isSameMonth(d, m)}
                      isToday={isSameDay(d, today)}
                      pnl={pnlByDate.get(iso) ?? null}
                      tradeCount={tradeCountByDate.get(iso) ?? 0}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

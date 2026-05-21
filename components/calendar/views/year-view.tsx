"use client";

import { useRouter } from "next/navigation";
import { addMonths, format, startOfMonth, startOfYear } from "date-fns";
import { isoDate, isWeekday } from "@/lib/dates";
import { gridDaysForMonth } from "@/lib/dates";
import { isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";

export function YearView({
  anchor,
  pnlByDate,
}: {
  anchor: Date;
  pnlByDate: Map<string, number>;
}) {
  const router = useRouter();
  const yearStart = startOfYear(anchor);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  // Find max absolute pnl for intensity normalization
  let maxAbs = 1;
  for (const v of pnlByDate.values()) {
    if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v);
  }

  return (
    <div className="grid h-full w-full grid-cols-3 gap-3 overflow-y-auto md:grid-cols-4">
      {months.map((m) => {
        const monthStart = startOfMonth(m);
        const days = gridDaysForMonth(m).filter(isWeekday);
        let monthPnl = 0;
        for (const d of days) {
          if (!isSameMonth(d, m)) continue;
          monthPnl += pnlByDate.get(isoDate(d)) ?? 0;
        }
        return (
          <button
            key={isoDate(monthStart)}
            type="button"
            onClick={() => router.push(`/trades/${isoDate(monthStart)}`)}
            className="flex flex-col rounded-xl border border-border/60 bg-card/60 p-2.5 text-left transition hover:border-border active:scale-[0.97]"
          >
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-xs font-semibold">{format(m, "MMM")}</span>
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums",
                  monthPnl > 0 && "text-win",
                  monthPnl < 0 && "text-loss",
                  monthPnl === 0 && "text-muted-foreground",
                )}
              >
                {monthPnl !== 0 ? (monthPnl > 0 ? "+" : "") + Math.round(monthPnl) + "€" : "—"}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-[2px]">
              {days.map((d) => {
                const iso = isoDate(d);
                const v = pnlByDate.get(iso) ?? 0;
                const inMonth = isSameMonth(d, m);
                const intensity = Math.min(1, Math.abs(v) / maxAbs);
                let bg = "transparent";
                if (v > 0)
                  bg = `color-mix(in oklab, var(--win) ${Math.round(intensity * 80 + 20)}%, transparent)`;
                else if (v < 0)
                  bg = `color-mix(in oklab, var(--loss) ${Math.round(intensity * 80 + 20)}%, transparent)`;
                return (
                  <div
                    key={iso}
                    className={cn(
                      "aspect-square rounded-[2px] border border-border/40",
                      !inMonth && "opacity-0 pointer-events-none",
                    )}
                    style={{ backgroundColor: bg }}
                    title={`${iso}: ${v}€`}
                  />
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

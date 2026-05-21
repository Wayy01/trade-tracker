"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, addWeeks, addYears, subMonths, subWeeks, subYears } from "date-fns";
import { api } from "@/convex/_generated/api";
import {
  CalendarView,
  formatMonthLabel,
  isoDate,
  rangeFor,
} from "@/lib/dates";
import { ViewSwitcher } from "./view-switcher";
import { MonthView } from "./views/month-view";
import { WeekView } from "./views/week-view";
import { MultiMonthView } from "./views/multi-month-view";
import { YearView } from "./views/year-view";
import { StatsStrip } from "@/components/stats/stats-strip";
import { BalanceCard } from "@/components/stats/balance-card";
import { GoalsCard } from "@/components/stats/goals-card";
import { SettingsMenu } from "@/components/ui/settings-menu";
import { format } from "date-fns";

export function TradeCalendar() {
  const router = useRouter();
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState<Date>(new Date());

  const { start, end } = useMemo(() => rangeFor(view, anchor), [view, anchor]);
  const fromDate = isoDate(start);
  const toDate = isoDate(end);

  const trades = useQuery(api.trades.listByRange, { fromDate, toDate });
  const summary = useQuery(api.stats.summary, { fromDate, toDate });
  const loading = trades === undefined || summary === undefined;

  const goalRange = useMemo(() => {
    const now = new Date();
    const week = rangeFor("week", now);
    const month = rangeFor("month", now);
    return {
      weekStart: isoDate(week.start),
      weekEnd: isoDate(week.end),
      monthStart: isoDate(month.start),
      monthEnd: isoDate(month.end),
    };
  }, []);
  const goals = useQuery(api.goals.summary, goalRange);

  const { pnlByDate, tradeCountByDate } = useMemo(() => {
    const pnl = new Map<string, number>();
    const count = new Map<string, number>();
    if (!trades) return { pnlByDate: pnl, tradeCountByDate: count };
    for (const t of trades) {
      const prev = pnl.get(t.date) ?? 0;
      pnl.set(t.date, prev + (t.type === "win" ? t.amount : -t.amount));
      count.set(t.date, (count.get(t.date) ?? 0) + 1);
    }
    return { pnlByDate: pnl, tradeCountByDate: count };
  }, [trades]);

  function shift(direction: -1 | 1) {
    setAnchor((d) => {
      switch (view) {
        case "week":
          return direction > 0 ? addWeeks(d, 1) : subWeeks(d, 1);
        case "month":
          return direction > 0 ? addMonths(d, 1) : subMonths(d, 1);
        case "two-month":
          return direction > 0 ? addMonths(d, 2) : subMonths(d, 2);
        case "three-month":
          return direction > 0 ? addMonths(d, 3) : subMonths(d, 3);
        case "year":
          return direction > 0 ? addYears(d, 1) : subYears(d, 1);
      }
    });
  }

  const headerLabel = useMemo(() => {
    switch (view) {
      case "week":
        return `Week of ${format(start, "d MMM yyyy")}`;
      case "month":
        return formatMonthLabel(anchor).toUpperCase();
      case "two-month":
        return `${format(start, "MMM")} – ${format(end, "MMM yyyy")}`;
      case "three-month":
        return `${format(start, "MMM")} – ${format(end, "MMM yyyy")}`;
      case "year":
        return format(anchor, "yyyy");
    }
  }, [view, anchor, start, end]);

  return (
    <main className="relative flex h-[100dvh] flex-col safe-pt safe-pb safe-px">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 ambient-glow"
      />
      <header className="flex items-center gap-2 px-4 pb-1 pt-1">
        <div className="flex h-9 flex-1 items-center gap-1 rounded-2xl border border-border/60 bg-card/60 px-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous"
            className="flex h-7 w-7 items-center justify-center rounded-xl text-foreground/70 transition hover:text-foreground active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAnchor(new Date())}
            className="flex-1 px-1 text-center text-sm font-semibold tabular-nums tracking-wider text-foreground/90"
            title="Reset to today"
          >
            {headerLabel}
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next"
            className="flex h-7 w-7 items-center justify-center rounded-xl text-foreground/70 transition hover:text-foreground active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <SettingsMenu className="h-9 w-9 rounded-2xl" />
      </header>

      <div className="flex flex-col gap-1.5 px-4 pt-0.5">
        <StatsStrip
          totalPnL={summary?.totalPnL ?? 0}
          winRate={summary?.winRate ?? 0}
          avgWin={summary?.avgWin ?? 0}
          avgLoss={summary?.avgLoss ?? 0}
          totalTrades={summary?.totalTrades ?? 0}
          loading={loading}
        />
        <BalanceCard
          balance={summary?.balance ?? 0}
          depositsTotal={summary?.depositsTotal ?? 0}
          withdrawalsTotal={summary?.withdrawalsTotal ?? 0}
          loading={loading}
        />
        <GoalsCard
          summary={goals}
          loading={goals === undefined}
          period={view === "week" ? "weekly" : "monthly"}
        />
        <ViewSwitcher value={view} onChange={setView} />
      </div>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 pt-1">
        {view === "month" && (
          <MonthView
            anchor={anchor}
            pnlByDate={pnlByDate}
            tradeCountByDate={tradeCountByDate}
          />
        )}
        {view === "week" && (
          <WeekView
            anchor={anchor}
            pnlByDate={pnlByDate}
            tradeCountByDate={tradeCountByDate}
          />
        )}
        {view === "two-month" && (
          <MultiMonthView
            anchor={anchor}
            count={2}
            pnlByDate={pnlByDate}
            tradeCountByDate={tradeCountByDate}
          />
        )}
        {view === "three-month" && (
          <MultiMonthView
            anchor={anchor}
            count={3}
            pnlByDate={pnlByDate}
            tradeCountByDate={tradeCountByDate}
          />
        )}
        {view === "year" && <YearView anchor={anchor} pnlByDate={pnlByDate} />}
      </section>

      <div className="px-4 pb-2 pt-1.5">
        <button
          type="button"
          onClick={() => router.push(`/trades/${isoDate(new Date())}`)}
          className="h-12 w-full rounded-2xl bg-primary text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.98]"
        >
          Add trades for today
        </button>
      </div>
    </main>
  );
}

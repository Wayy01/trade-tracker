"use client";

import { useState } from "react";
import { formatEUR } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { GoalsForm } from "@/components/stats/goals-form";

export type GoalsSummary = {
  weeklyTarget: number;
  monthlyTarget: number;
  weeklyPnL: number;
  monthlyPnL: number;
};

export function GoalsCard({
  summary,
  loading = false,
}: {
  summary: GoalsSummary | undefined;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const weeklyTarget = summary?.weeklyTarget ?? 0;
  const monthlyTarget = summary?.monthlyTarget ?? 0;
  const weeklyPnL = summary?.weeklyPnL ?? 0;
  const monthlyPnL = summary?.monthlyPnL ?? 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full flex-col gap-2.5 rounded-2xl border border-border/60 bg-card/60 p-3 text-left transition hover:bg-card/80 active:scale-[0.99]"
      >
        <GoalRow
          label="Weekly"
          pnl={weeklyPnL}
          target={weeklyTarget}
          loading={loading}
        />
        <div className="h-px bg-border/40" />
        <GoalRow
          label="Monthly"
          pnl={monthlyPnL}
          target={monthlyTarget}
          loading={loading}
        />
      </button>
      <GoalsForm
        open={open}
        onOpenChange={setOpen}
        weeklyTarget={weeklyTarget}
        monthlyTarget={monthlyTarget}
      />
    </>
  );
}

function GoalRow({
  label,
  pnl,
  target,
  loading,
}: {
  label: string;
  pnl: number;
  target: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="text-xs text-muted-foreground">—</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted" />
      </div>
    );
  }

  if (target === 0) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">Tap to set a target</span>
      </div>
    );
  }

  const isLoss = pnl < 0;
  const ratio = pnl / target;
  const percent = Math.round(ratio * 100);
  const fillWidth = Math.max(0, Math.min(100, Math.abs(ratio) * 100));
  const hitTarget = ratio >= 1;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "text-xs font-bold tabular-nums",
            isLoss && "text-loss",
            !isLoss && hitTarget && "text-win",
            !isLoss && !hitTarget && "text-foreground/70",
          )}
        >
          {percent}%
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums leading-none">
          <span
            className={cn(
              isLoss && "text-loss",
              !isLoss && hitTarget && "text-win",
              !isLoss && !hitTarget && "text-foreground",
            )}
          >
            {formatEUR(pnl)}
          </span>
          <span className="text-muted-foreground"> / {formatEUR(target)}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            isLoss ? "bg-loss" : "bg-win",
          )}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
    </div>
  );
}

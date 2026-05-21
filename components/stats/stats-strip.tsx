"use client";

import { formatEUR } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function StatsStrip({
  totalPnL,
  winRate,
  avgWin,
  avgLoss,
  totalTrades,
  loading = false,
}: {
  totalPnL: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  totalTrades: number;
  loading?: boolean;
}) {
  const positive = totalPnL > 0;
  const negative = totalPnL < 0;
  const hasTrades = !loading && totalTrades > 0;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Period P/L
          </div>
          <div
            className={cn(
              "text-3xl font-extrabold tabular-nums leading-tight",
              positive && "text-win",
              negative && "text-loss",
              totalPnL === 0 && "text-foreground",
            )}
          >
            {loading ? "—" : formatEUR(totalPnL, { signed: true })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Win rate
          </div>
          <div className="text-xl font-bold tabular-nums">
            {loading || totalTrades === 0 ? "—" : `${Math.round(winRate * 100)}%`}
          </div>
        </div>
      </div>
      {hasTrades && (
        <div className="text-[11px] tabular-nums text-muted-foreground">
          {totalTrades} {totalTrades === 1 ? "trade" : "trades"}
          <span className="mx-1.5 text-foreground/30">·</span>
          avg <span className="font-semibold text-win">{formatEUR(avgWin)}</span>
          <span className="mx-1 text-foreground/30">/</span>
          <span className="font-semibold text-loss">-{formatEUR(avgLoss)}</span>
        </div>
      )}
    </div>
  );
}

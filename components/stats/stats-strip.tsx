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
  return (
    <div className="flex flex-col gap-2">
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
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-card/60 p-2.5 text-xs">
        <Stat label="Trades" value={loading ? "—" : String(totalTrades)} />
        <Stat label="Avg win" value={loading ? "—" : formatEUR(avgWin)} tone="win" />
        <Stat label="Avg loss" value={loading ? "—" : formatEUR(avgLoss)} tone="loss" />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "win" | "loss";
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-bold tabular-nums",
          tone === "win" && "text-win",
          tone === "loss" && "text-loss",
        )}
      >
        {value}
      </span>
    </div>
  );
}

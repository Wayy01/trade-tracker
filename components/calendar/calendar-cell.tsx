"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatEUR } from "@/lib/currency";

export function CalendarCell({
  date,
  isCurrentMonth = true,
  isToday = false,
  pnl,
  tradeCount = 0,
  showLabel = true,
  size = "md",
}: {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  pnl: number | null;
  tradeCount?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const router = useRouter();
  const dayNum = Number(date.slice(8, 10));
  const hasPnl = pnl !== null && pnl !== 0;
  const positive = (pnl ?? 0) > 0;

  return (
    <button
      type="button"
      onClick={() => router.push(`/trades/${date}`)}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl border text-left transition active:scale-[0.97]",
        "border-border/60 bg-card/60",
        !isCurrentMonth && "opacity-30",
        isToday && "ring-1 ring-primary/70",
        hasPnl && positive && "cell-glow-win border-win/40",
        hasPnl && !positive && "cell-glow-loss border-loss/40",
        size === "sm" && "p-1",
        size === "md" && "p-1 sm:p-1.5",
        size === "lg" && "p-1.5 sm:p-2.5",
      )}
    >
      {showLabel && (
        <span
          className={cn(
            "self-end font-medium leading-none tabular-nums",
            size === "sm" ? "text-[10px]" : "text-xs",
            isToday
              ? "text-primary"
              : hasPnl
                ? "text-foreground/85"
                : "text-muted-foreground/80",
          )}
        >
          {dayNum}
        </span>
      )}
      {hasPnl && (
        <div className="mt-auto flex flex-col items-start gap-0.5">
          <span
            className={cn(
              "font-bold tabular-nums leading-tight whitespace-nowrap",
              size === "sm" && "text-[10px]",
              size === "md" && "text-[11px] sm:text-xs md:text-sm",
              size === "lg" && "text-sm sm:text-base",
              positive ? "text-win" : "text-loss",
            )}
          >
            {formatEUR(pnl ?? 0, { signed: true, compact: true })}
          </span>
          {tradeCount > 0 && size === "lg" && (
            <span
              className={cn(
                "text-[11px] leading-none tabular-nums whitespace-nowrap",
                positive ? "text-win/70" : "text-loss/70",
              )}
            >
              {tradeCount} {tradeCount === 1 ? "Trade" : "Trades"}
            </span>
          )}
          {tradeCount > 0 && size === "md" && (
            <span
              className={cn(
                "hidden text-[10px] leading-none tabular-nums whitespace-nowrap sm:inline",
                positive ? "text-win/70" : "text-loss/70",
              )}
            >
              {tradeCount} {tradeCount === 1 ? "Trade" : "Trades"}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

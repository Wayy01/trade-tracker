"use client";

import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { formatEUR } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Trade = Doc<"trades">;
type Transaction = Doc<"transactions">;

export function TradeList({
  trades,
  transactions,
  loading,
}: {
  trades: Trade[];
  transactions: Transaction[];
  loading: boolean;
}) {
  const removeTrade = useMutation(api.trades.remove);
  const removeTx = useMutation(api.transactions.remove);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  const items: Array<
    | { kind: "trade"; sort: string; data: Trade }
    | { kind: "tx"; sort: string; data: Transaction }
  > = [
    ...trades.map((t) => ({ kind: "trade" as const, sort: t.time, data: t })),
    ...transactions.map((x) => ({ kind: "tx" as const, sort: "23:59:" + x._id, data: x })),
  ].sort((a, b) => a.sort.localeCompare(b.sort));

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-muted-foreground">
        <span className="text-sm">No trades yet.</span>
        <span className="text-xs">Tap “Add trade” below.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        if (item.kind === "trade") {
          const t = item.data;
          const isWin = t.type === "win";
          return (
            <div
              key={t._id}
              className={cn(
                "flex items-center justify-between rounded-xl border p-3",
                isWin
                  ? "cell-glow-win border-win/40"
                  : "cell-glow-loss border-loss/40",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    isWin ? "bg-win/20 text-win" : "bg-loss/20 text-loss",
                  )}
                >
                  {t.type}
                </span>
                <span className="text-sm tabular-nums text-muted-foreground">{t.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-base font-bold tabular-nums",
                    isWin ? "text-win" : "text-loss",
                  )}
                >
                  {isWin ? "+" : "-"}
                  {formatEUR(t.amount)}
                </span>
                <button
                  type="button"
                  aria-label="Delete trade"
                  onClick={() => removeTrade({ id: t._id as Id<"trades"> })}
                  className="rounded-md p-1.5 text-muted-foreground transition hover:bg-card hover:text-loss"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        }
        const x = item.data;
        const isDep = x.type === "deposit";
        return (
          <div
            key={x._id}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-3"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {x.type}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-base font-bold tabular-nums",
                  isDep ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {isDep ? "+" : "-"}
                {formatEUR(x.amount)}
              </span>
              <button
                type="button"
                aria-label="Delete transaction"
                onClick={() => removeTx({ id: x._id as Id<"transactions"> })}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-card hover:text-loss"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Wallet, Plus, Minus } from "lucide-react";
import { formatEUR } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { TransactionForm } from "@/components/trades/transaction-form";
import { isoDate } from "@/lib/dates";

export function BalanceCard({
  balance,
  depositsTotal,
  withdrawalsTotal,
  loading = false,
}: {
  balance: number;
  depositsTotal: number;
  withdrawalsTotal: number;
  loading?: boolean;
}) {
  const [open, setOpen] = useState<null | "deposit" | "withdrawal">(null);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
          <Wallet className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Balance
          </span>
          <span
            className={cn(
              "text-base font-bold tabular-nums leading-none",
              balance > 0 && "text-foreground",
              balance < 0 && "text-loss",
            )}
          >
            {loading ? "—" : formatEUR(balance)}
          </span>
          <span className="mt-0.5 text-[10px] text-muted-foreground tabular-nums">
            {loading
              ? "—"
              : `${formatEUR(depositsTotal, { compact: true })} in · ${formatEUR(withdrawalsTotal, { compact: true })} out`}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setOpen("deposit")}
          aria-label="Deposit"
          title="Deposit"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground/60 transition hover:bg-card hover:text-win active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setOpen("withdrawal")}
          aria-label="Withdraw"
          title="Withdraw"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground/60 transition hover:bg-card hover:text-loss active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
      <TransactionForm
        open={open !== null}
        defaultType={open ?? "deposit"}
        date={isoDate(new Date())}
        onOpenChange={(o) => !o && setOpen(null)}
      />
    </div>
  );
}

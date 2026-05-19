"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { parseISO } from "date-fns";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TradeList } from "./trade-list";
import { TradeForm } from "./trade-form";
import { TransactionForm } from "./transaction-form";
import { formatDateLong } from "@/lib/dates";
import { formatEUR } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function DayDetail({ date }: { date: string }) {
  const trades = useQuery(api.trades.listByDate, { date });
  const transactions = useQuery(api.transactions.listByDate, { date });
  const [tradeOpen, setTradeOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const loading = trades === undefined || transactions === undefined;

  const dayPnL = useMemo(() => {
    if (!trades) return 0;
    return trades.reduce(
      (acc, t) => acc + (t.type === "win" ? t.amount : -t.amount),
      0,
    );
  }, [trades]);

  const tradeCount = trades?.length ?? 0;
  const txCount = transactions?.length ?? 0;

  return (
    <main className="relative flex h-[100dvh] flex-col safe-pt safe-pb safe-px">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 ambient-glow"
      />
      <header className="flex items-center gap-2 px-4 pb-2 pt-2">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60 transition active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Day
          </span>
          <span className="text-base font-bold leading-none">
            {formatDateLong(parseISO(date))}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Day P/L
          </span>
          <div
            className={cn(
              "text-xl font-extrabold tabular-nums leading-none",
              dayPnL > 0 && "text-win",
              dayPnL < 0 && "text-loss",
              dayPnL === 0 && "text-foreground",
            )}
          >
            {loading ? "—" : formatEUR(dayPnL, { signed: true })}
          </div>
        </div>
      </header>

      <Tabs defaultValue="trades" className="flex min-h-0 flex-1 flex-col gap-2 px-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trades">
            Trades {tradeCount > 0 && <span className="ml-1 opacity-70">({tradeCount})</span>}
          </TabsTrigger>
          <TabsTrigger value="transactions">
            Account {txCount > 0 && <span className="ml-1 opacity-70">({txCount})</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="min-h-0 flex-1 overflow-y-auto">
          <TradeList
            trades={trades ?? []}
            transactions={[]}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="transactions" className="min-h-0 flex-1 overflow-y-auto">
          <TradeList
            trades={[]}
            transactions={transactions ?? []}
            loading={loading}
          />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-3 gap-2 px-4 pb-3 pt-2">
        <Button
          type="button"
          onClick={() => setTradeOpen(true)}
          className="col-span-2 h-14 rounded-2xl text-base font-bold uppercase tracking-wide shadow-lg shadow-primary/20"
        >
          + Add trade
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setTxOpen(true)}
          className="h-14 rounded-2xl text-xs font-semibold"
        >
          Deposit /<br />Withdraw
        </Button>
      </div>

      <TradeForm open={tradeOpen} onOpenChange={setTradeOpen} date={date} />
      <TransactionForm open={txOpen} onOpenChange={setTxOpen} date={date} />
    </main>
  );
}

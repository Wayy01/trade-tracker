"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { isoTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function TradeForm({
  open,
  onOpenChange,
  date,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
}) {
  const addTrade = useMutation(api.trades.add);
  const [type, setType] = useState<"win" | "loss">("win");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState(isoTime(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setError("Enter a positive amount.");
      return;
    }
    setSubmitting(true);
    try {
      await addTrade({ date, type, amount: n, time });
      setAmount("");
      setType("win");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Add trade</SheetTitle>
          <SheetDescription>Log a win or loss for {date}.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label>Result</Label>
            <ToggleGroup
              value={[type]}
              onValueChange={(v) => {
                const next = v[0];
                if (next === "win" || next === "loss") setType(next);
              }}
              className="w-full"
            >
              <ToggleGroupItem
                value="win"
                className={cn(
                  "h-12 flex-1 text-base font-bold",
                  type === "win" && "!bg-win/20 !text-win !border-win/50",
                )}
              >
                WIN
              </ToggleGroupItem>
              <ToggleGroupItem
                value="loss"
                className={cn(
                  "h-12 flex-1 text-base font-bold",
                  type === "loss" && "!bg-loss/20 !text-loss !border-loss/50",
                )}
              >
                LOSS
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg font-semibold tabular-nums"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-12 text-lg font-semibold tabular-nums"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-loss" role="alert">
              {error}
            </p>
          )}

          <SheetFooter className="flex-row gap-2 px-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-[2] font-semibold">
              {submitting ? "Saving..." : "Save trade"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

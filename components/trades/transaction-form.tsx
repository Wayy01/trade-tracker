"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

export function TransactionForm({
  open,
  onOpenChange,
  date,
  defaultType = "deposit",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  defaultType?: "deposit" | "withdrawal";
}) {
  const addTx = useMutation(api.transactions.add);
  const [type, setType] = useState<"deposit" | "withdrawal">(defaultType);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setType(defaultType);
  }, [open, defaultType]);

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
      await addTx({ date, type, amount: n });
      setAmount("");
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
          <SheetTitle>{type === "deposit" ? "Add deposit" : "Add withdrawal"}</SheetTitle>
          <SheetDescription>
            Adjust your account balance for {date}.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <ToggleGroup
              value={[type]}
              onValueChange={(v) => {
                const next = v[0];
                if (next === "deposit" || next === "withdrawal") setType(next);
              }}
              className="w-full"
            >
              <ToggleGroupItem
                value="deposit"
                className={cn(
                  "h-12 flex-1 text-base font-bold",
                  type === "deposit" && "!bg-win/20 !text-win !border-win/50",
                )}
              >
                DEPOSIT
              </ToggleGroupItem>
              <ToggleGroupItem
                value="withdrawal"
                className={cn(
                  "h-12 flex-1 text-base font-bold",
                  type === "withdrawal" && "!bg-loss/20 !text-loss !border-loss/50",
                )}
              >
                WITHDRAW
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tx-amount">Amount (€)</Label>
            <Input
              id="tx-amount"
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
              {submitting ? "Saving..." : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

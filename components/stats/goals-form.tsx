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

export function GoalsForm({
  open,
  onOpenChange,
  weeklyTarget,
  monthlyTarget,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyTarget: number;
  monthlyTarget: number;
}) {
  const setGoals = useMutation(api.goals.set);
  const [weekly, setWeekly] = useState(weeklyTarget ? String(weeklyTarget) : "");
  const [monthly, setMonthly] = useState(monthlyTarget ? String(monthlyTarget) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setWeekly(weeklyTarget ? String(weeklyTarget) : "");
      setMonthly(monthlyTarget ? String(monthlyTarget) : "");
      setError(null);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const w = weekly === "" ? 0 : Number(weekly);
    const m = monthly === "" ? 0 : Number(monthly);
    if (!Number.isFinite(w) || w < 0) {
      setError("Weekly target must be a non-negative number.");
      return;
    }
    if (!Number.isFinite(m) || m < 0) {
      setError("Monthly target must be a non-negative number.");
      return;
    }
    setSubmitting(true);
    try {
      await setGoals({ weeklyTarget: w, monthlyTarget: m });
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
          <SheetTitle>Edit goals</SheetTitle>
          <SheetDescription>
            Set your weekly and monthly PnL targets. Leave a field empty to clear it.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-weekly">Weekly target (€)</Label>
            <Input
              id="goal-weekly"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              autoFocus
              placeholder="0.00"
              value={weekly}
              onChange={(e) => setWeekly(e.target.value)}
              className="h-12 text-lg font-semibold tabular-nums"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-monthly">Monthly target (€)</Label>
            <Input
              id="goal-monthly"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
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

import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const summary = query({
  args: { fromDate: v.string(), toDate: v.string() },
  handler: async (ctx, { fromDate, toDate }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        totalTrades: 0,
        wins: 0,
        losses: 0,
        balance: 0,
        depositsTotal: 0,
        withdrawalsTotal: 0,
      };
    }

    const rangeTrades = await ctx.db
      .query("trades")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).gte("date", fromDate).lte("date", toDate),
      )
      .collect();

    let wins = 0;
    let losses = 0;
    let winSum = 0;
    let lossSum = 0;
    for (const t of rangeTrades) {
      if (t.type === "win") {
        wins++;
        winSum += t.amount;
      } else {
        losses++;
        lossSum += t.amount;
      }
    }
    const totalPnL = winSum - lossSum;
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? wins / totalTrades : 0;
    const avgWin = wins > 0 ? winSum / wins : 0;
    const avgLoss = losses > 0 ? lossSum / losses : 0;

    const allTrades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    let allPnL = 0;
    for (const t of allTrades) {
      allPnL += t.type === "win" ? t.amount : -t.amount;
    }

    const allTx = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    let depositsTotal = 0;
    let withdrawalsTotal = 0;
    for (const x of allTx) {
      if (x.type === "deposit") depositsTotal += x.amount;
      else withdrawalsTotal += x.amount;
    }
    const balance = depositsTotal - withdrawalsTotal + allPnL;

    return {
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      totalTrades,
      wins,
      losses,
      balance,
      depositsTotal,
      withdrawalsTotal,
    };
  },
});

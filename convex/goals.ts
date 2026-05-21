import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const summary = query({
  args: {
    weekStart: v.string(),
    weekEnd: v.string(),
    monthStart: v.string(),
    monthEnd: v.string(),
  },
  handler: async (ctx, { weekStart, weekEnd, monthStart, monthEnd }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        weeklyTarget: 0,
        monthlyTarget: 0,
        weeklyPnL: 0,
        monthlyPnL: 0,
      };
    }

    const goal = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const weekTrades = await ctx.db
      .query("trades")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).gte("date", weekStart).lte("date", weekEnd),
      )
      .collect();

    const monthTrades = await ctx.db
      .query("trades")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).gte("date", monthStart).lte("date", monthEnd),
      )
      .collect();

    let weeklyPnL = 0;
    for (const t of weekTrades) {
      weeklyPnL += t.type === "win" ? t.amount : -t.amount;
    }

    let monthlyPnL = 0;
    for (const t of monthTrades) {
      monthlyPnL += t.type === "win" ? t.amount : -t.amount;
    }

    return {
      weeklyTarget: goal?.weeklyTarget ?? 0,
      monthlyTarget: goal?.monthlyTarget ?? 0,
      weeklyPnL,
      monthlyPnL,
    };
  },
});

export const set = mutation({
  args: {
    weeklyTarget: v.number(),
    monthlyTarget: v.number(),
  },
  handler: async (ctx, { weeklyTarget, monthlyTarget }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!Number.isFinite(weeklyTarget) || weeklyTarget < 0) {
      throw new Error("Weekly target must be a non-negative number");
    }
    if (!Number.isFinite(monthlyTarget) || monthlyTarget < 0) {
      throw new Error("Monthly target must be a non-negative number");
    }

    const existing = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { weeklyTarget, monthlyTarget });
    } else {
      await ctx.db.insert("goals", { userId, weeklyTarget, monthlyTarget });
    }
  },
});

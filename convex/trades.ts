import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("trades")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .collect();
  },
});

export const listByRange = query({
  args: { fromDate: v.string(), toDate: v.string() },
  handler: async (ctx, { fromDate, toDate }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("trades")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).gte("date", fromDate).lte("date", toDate),
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    date: v.string(),
    type: v.union(v.literal("win"), v.literal("loss")),
    amount: v.number(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (args.amount <= 0) throw new Error("Amount must be positive");
    return await ctx.db.insert("trades", { userId, ...args });
  },
});

export const remove = mutation({
  args: { id: v.id("trades") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const trade = await ctx.db.get(id);
    if (!trade || trade.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});

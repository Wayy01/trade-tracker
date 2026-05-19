import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  trades: defineTable({
    userId: v.id("users"),
    date: v.string(),
    type: v.union(v.literal("win"), v.literal("loss")),
    amount: v.number(),
    time: v.string(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    date: v.string(),
    type: v.union(v.literal("deposit"), v.literal("withdrawal")),
    amount: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all birthdays
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("birthdays").collect();
  },
});

// Get birthdays for a specific month
export const getByMonth = query({
  args: { month: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("birthdays")
      .withIndex("by_month", (q) => q.eq("month", args.month))
      .collect();
  },
});

// Get current month's birthdays
export const getCurrentMonth = query({
  args: {},
  handler: async (ctx) => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    return await ctx.db
      .query("birthdays")
      .withIndex("by_month", (q) => q.eq("month", currentMonth))
      .collect();
  },
});

// Create birthday (admin only)
export const create = mutation({
  args: {
    name: v.string(),
    month: v.number(),
    day: v.number(),
    role: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin role
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can manage birthdays");
    }

    const now = Date.now();

    return await ctx.db.insert("birthdays", {
      name: args.name,
      month: args.month,
      day: args.day,
      role: args.role,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update birthday (admin only)
export const update = mutation({
  args: {
    id: v.id("birthdays"),
    name: v.optional(v.string()),
    month: v.optional(v.number()),
    day: v.optional(v.number()),
    role: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin role
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can manage birthdays");
    }

    const birthday = await ctx.db.get(args.id);
    if (!birthday) throw new Error("Birthday not found");

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.month !== undefined) updates.month = args.month;
    if (args.day !== undefined) updates.day = args.day;
    if (args.role !== undefined) updates.role = args.role;

    await ctx.db.patch(args.id, updates);
  },
});

// Delete birthday (admin only)
export const remove = mutation({
  args: {
    id: v.id("birthdays"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin role
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can manage birthdays");
    }

    await ctx.db.delete(args.id);
  },
});

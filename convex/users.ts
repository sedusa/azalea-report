import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new user
 * For now, this is a simple mutation without authentication
 * In production, you'd add proper password hashing
 */
export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("viewer"), v.literal("editor"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error(`User with email ${args.email} already exists`);
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      isActive: true,
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * List all users
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

/**
 * Get user by email
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

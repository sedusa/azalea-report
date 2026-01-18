import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Lock configuration
const STALE_THRESHOLD_MS = 120000; // 2 minutes

// Get lock for an issue
export const getForIssue = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    const lock = await ctx.db
      .query("locks")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .unique();

    if (!lock) return null;

    // Check if lock is stale
    const now = Date.now();
    if (now - lock.lastHeartbeat > STALE_THRESHOLD_MS) {
      return null; // Lock is stale, treat as unlocked
    }

    // Get user info
    const user = await ctx.db.get(lock.userId);

    return {
      ...lock,
      userName: user?.name || "Unknown User",
      userEmail: user?.email,
      isStale: false,
    };
  },
});

// Acquire lock for editing
export const acquire = mutation({
  args: {
    issueId: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for existing lock
    const existingLock = await ctx.db
      .query("locks")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .unique();

    if (existingLock) {
      // Check if it's our lock or if it's stale
      if (existingLock.userId === args.userId) {
        // Our lock, update heartbeat
        await ctx.db.patch(existingLock._id, {
          lastHeartbeat: now,
        });
        return { success: true, lockId: existingLock._id };
      }

      // Someone else's lock - check if stale
      if (now - existingLock.lastHeartbeat > STALE_THRESHOLD_MS) {
        // Stale lock, we can take it
        await ctx.db.delete(existingLock._id);
      } else {
        // Active lock by another user
        const user = await ctx.db.get(existingLock.userId);
        return {
          success: false,
          lockedBy: user?.name || "Another user",
          lockedAt: existingLock.acquiredAt,
        };
      }
    }

    // Create new lock
    const lockId = await ctx.db.insert("locks", {
      issueId: args.issueId,
      userId: args.userId,
      acquiredAt: now,
      lastHeartbeat: now,
    });

    return { success: true, lockId };
  },
});

// Send heartbeat to keep lock alive
export const heartbeat = mutation({
  args: {
    issueId: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const lock = await ctx.db
      .query("locks")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .unique();

    if (!lock) {
      return { success: false, error: "No lock found" };
    }

    if (lock.userId !== args.userId) {
      return { success: false, error: "Lock held by another user" };
    }

    await ctx.db.patch(lock._id, {
      lastHeartbeat: Date.now(),
    });

    return { success: true };
  },
});

// Release lock
export const release = mutation({
  args: {
    issueId: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const lock = await ctx.db
      .query("locks")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .unique();

    if (!lock) {
      return { success: true }; // No lock to release
    }

    if (lock.userId !== args.userId) {
      return { success: false, error: "Cannot release lock held by another user" };
    }

    await ctx.db.delete(lock._id);
    return { success: true };
  },
});

// Force release lock (admin only)
export const forceRelease = mutation({
  args: {
    issueId: v.id("issues"),
    adminUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin role
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Only admins can force-release locks");
    }

    const lock = await ctx.db
      .query("locks")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .unique();

    if (lock) {
      await ctx.db.delete(lock._id);
    }

    return { success: true };
  },
});

// Clean up stale locks (called by scheduled function)
export const cleanupStale = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const locks = await ctx.db.query("locks").collect();

    let cleaned = 0;
    for (const lock of locks) {
      if (now - lock.lastHeartbeat > STALE_THRESHOLD_MS) {
        await ctx.db.delete(lock._id);
        cleaned++;
      }
    }

    return { cleaned };
  },
});

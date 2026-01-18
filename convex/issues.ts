import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all issues (with optional status filter)
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    let issues;
    if (args.status) {
      issues = await ctx.db
        .query("issues")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      issues = await ctx.db.query("issues").order("desc").collect();
    }
    return issues;
  },
});

// Get issue by slug (with resolved banner image URL)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const issue = await ctx.db
      .query("issues")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!issue) return null;

    // Resolve banner image URL if present
    let bannerImageUrl: string | null = null;
    if (issue.bannerImage) {
      const media = await ctx.db.get(issue.bannerImage);
      if (media?.storageId) {
        bannerImageUrl = await ctx.storage.getUrl(media.storageId);
      }
    }

    return {
      ...issue,
      // Keep the original media ID for consistency
      bannerImageId: issue.bannerImage,
      // Also provide the resolved URL for display
      bannerImageUrl: bannerImageUrl ?? undefined,
    };
  },
});

// Get issue by ID (with resolved banner image URL)
export const get = query({
  args: { id: v.id("issues") },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) return null;

    // Resolve banner image URL if present
    let bannerImageUrl: string | null = null;
    if (issue.bannerImage) {
      const media = await ctx.db.get(issue.bannerImage);
      if (media?.storageId) {
        bannerImageUrl = await ctx.storage.getUrl(media.storageId);
      }
    }

    return {
      ...issue,
      // Keep the original media ID for editing
      bannerImageId: issue.bannerImage,
      // Also provide the resolved URL for display
      bannerImageUrl: bannerImageUrl ?? undefined,
    };
  },
});

// Get latest published issue (with resolved banner image URL)
export const getLatestPublished = query({
  args: {},
  handler: async (ctx) => {
    const issue = await ctx.db
      .query("issues")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .first();

    if (!issue) return null;

    // Resolve banner image URL if present
    let bannerImageUrl: string | null = null;
    if (issue.bannerImage) {
      const media = await ctx.db.get(issue.bannerImage);
      if (media?.storageId) {
        bannerImageUrl = await ctx.storage.getUrl(media.storageId);
      }
    }

    return {
      ...issue,
      // Keep the original media ID for consistency
      bannerImageId: issue.bannerImage,
      // Also provide the resolved URL for display
      bannerImageUrl: bannerImageUrl ?? undefined,
    };
  },
});

// Create new issue
export const create = mutation({
  args: {
    title: v.string(),
    edition: v.number(),
    bannerTitle: v.string(),
    bannerDate: v.string(),
    // Accept either userId or createdBy for backwards compatibility
    userId: v.optional(v.id("users")),
    createdBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const slug = `edition-${args.edition}`;
    // Support both userId and createdBy params
    const userIdValue = args.userId || args.createdBy;
    if (!userIdValue) {
      throw new Error("Either userId or createdBy is required");
    }

    const issueId = await ctx.db.insert("issues", {
      title: args.title,
      slug,
      edition: args.edition,
      status: "draft",
      bannerTitle: args.bannerTitle,
      bannerDate: args.bannerDate,
      createdAt: now,
      updatedAt: now,
      version: 1,
      createdBy: userIdValue,
    });

    // Log the action
    if (userIdValue) {
      await ctx.db.insert("auditLog", {
        userId: userIdValue,
        action: "issue.create",
        resourceType: "issue",
        resourceId: issueId,
        timestamp: now,
      });
    }

    return issueId;
  },
});

// Update issue
export const update = mutation({
  args: {
    id: v.id("issues"),
    title: v.optional(v.string()),
    bannerTitle: v.optional(v.string()),
    bannerDate: v.optional(v.string()),
    bannerImage: v.optional(v.id("media")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) throw new Error("Issue not found");

    const now = Date.now();
    const updates: Record<string, unknown> = {
      updatedAt: now,
      version: issue.version + 1,
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.bannerTitle !== undefined) updates.bannerTitle = args.bannerTitle;
    if (args.bannerDate !== undefined) updates.bannerDate = args.bannerDate;
    if (args.bannerImage !== undefined) updates.bannerImage = args.bannerImage;

    await ctx.db.patch(args.id, updates);

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "issue.update",
      resourceType: "issue",
      resourceId: args.id,
      details: { updates: Object.keys(updates) },
      timestamp: now,
    });
  },
});

// Publish issue
export const publish = mutation({
  args: {
    id: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) throw new Error("Issue not found");

    const now = Date.now();

    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: now,
      updatedAt: now,
      version: issue.version + 1,
    });

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "issue.publish",
      resourceType: "issue",
      resourceId: args.id,
      timestamp: now,
    });

    // TODO: Trigger Netlify webhook for rebuild
  },
});

// Unpublish issue (back to draft)
export const unpublish = mutation({
  args: {
    id: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) throw new Error("Issue not found");

    const now = Date.now();

    await ctx.db.patch(args.id, {
      status: "draft",
      updatedAt: now,
      version: issue.version + 1,
    });

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "issue.unpublish",
      resourceType: "issue",
      resourceId: args.id,
      timestamp: now,
    });
  },
});

// Archive issue
export const archive = mutation({
  args: {
    id: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) throw new Error("Issue not found");

    const now = Date.now();

    await ctx.db.patch(args.id, {
      status: "archived",
      updatedAt: now,
      version: issue.version + 1,
    });

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "issue.archive",
      resourceType: "issue",
      resourceId: args.id,
      timestamp: now,
    });
  },
});

// Delete issue (only if draft)
export const remove = mutation({
  args: {
    id: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) throw new Error("Issue not found");
    if (issue.status !== "draft") {
      throw new Error("Can only delete draft issues");
    }

    // Delete all sections for this issue
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_issue", (q) => q.eq("issueId", args.id))
      .collect();

    for (const section of sections) {
      await ctx.db.delete(section._id);
    }

    // Delete the issue
    await ctx.db.delete(args.id);
  },
});

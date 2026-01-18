import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import sanitizeHtml from "sanitize-html";

/**
 * Sanitize HTML content in section data to prevent XSS attacks
 * Recursively processes all string values that look like HTML
 */
function sanitizeSectionData(data: any): any {
  if (typeof data === "string") {
    // Check if string contains HTML tags
    if (/<[^>]+>/.test(data)) {
      // Configure sanitize-html to allow safe HTML elements
      return sanitizeHtml(data, {
        allowedTags: [
          'p', 'br', 'strong', 'em', 'u', 's', 'a', 'h1', 'h2', 'h3', 'h4',
          'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
        ],
        allowedAttributes: {
          'a': ['href', 'target', 'rel']
        },
      });
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeSectionData(item));
  }

  if (data && typeof data === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeSectionData(value);
    }
    return sanitized;
  }

  return data;
}

// Section type validator
const sectionTypeValidator = v.union(
  v.literal("about"),
  v.literal("spotlight"),
  v.literal("chiefsCorner"),
  v.literal("internsCorner"),
  v.literal("textImage"),
  v.literal("carousel"),
  v.literal("textCarousel"),
  v.literal("events"),
  v.literal("podcast"),
  v.literal("birthdays"),
  v.literal("culturosity"),
  v.literal("communityService"),
  v.literal("recentSuccess"),
  v.literal("musings"),
  v.literal("photosOfMonth"),
  v.literal("genericText"),
  v.literal("custom")
);

// Get all sections for an issue (ordered)
export const listByIssue = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sections")
      .withIndex("by_issue_order", (q) => q.eq("issueId", args.issueId))
      .collect();
  },
});

// Get visible sections for an issue (for public display)
export const listVisibleByIssue = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_issue_order", (q) => q.eq("issueId", args.issueId))
      .collect();

    return sections.filter((section) => section.visible);
  },
});

// Get single section
export const get = query({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new section
export const create = mutation({
  args: {
    issueId: v.id("issues"),
    type: sectionTypeValidator,
    data: v.any(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get the current max order for this issue
    const existingSections = await ctx.db
      .query("sections")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .collect();

    const maxOrder = existingSections.reduce(
      (max, section) => Math.max(max, section.order),
      -1
    );

    // Sanitize data to prevent XSS
    const sanitizedData = sanitizeSectionData(args.data);

    const sectionId = await ctx.db.insert("sections", {
      issueId: args.issueId,
      type: args.type,
      order: maxOrder + 1,
      visible: true,
      data: sanitizedData,
      createdAt: now,
      updatedAt: now,
    });

    // Update issue version
    const issue = await ctx.db.get(args.issueId);
    if (issue) {
      await ctx.db.patch(args.issueId, {
        updatedAt: now,
        version: issue.version + 1,
      });
    }

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "section.create",
      resourceType: "section",
      resourceId: sectionId,
      details: { issueId: args.issueId, type: args.type },
      timestamp: now,
    });

    return sectionId;
  },
});

// Update section data
export const update = mutation({
  args: {
    id: v.id("sections"),
    data: v.any(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) throw new Error("Section not found");

    const now = Date.now();

    // Sanitize data to prevent XSS
    const sanitizedData = sanitizeSectionData(args.data);

    await ctx.db.patch(args.id, {
      data: sanitizedData,
      updatedAt: now,
    });

    // Update issue version
    const issue = await ctx.db.get(section.issueId);
    if (issue) {
      await ctx.db.patch(section.issueId, {
        updatedAt: now,
        version: issue.version + 1,
      });
    }

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "section.update",
      resourceType: "section",
      resourceId: args.id,
      timestamp: now,
    });
  },
});

// Toggle section visibility
export const toggleVisibility = mutation({
  args: {
    id: v.id("sections"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) throw new Error("Section not found");

    const now = Date.now();

    await ctx.db.patch(args.id, {
      visible: !section.visible,
      updatedAt: now,
    });

    // Update issue version
    const issue = await ctx.db.get(section.issueId);
    if (issue) {
      await ctx.db.patch(section.issueId, {
        updatedAt: now,
        version: issue.version + 1,
      });
    }
  },
});

// Reorder sections
export const reorder = mutation({
  args: {
    issueId: v.id("issues"),
    sectionIds: v.array(v.id("sections")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Update order for each section
    for (let i = 0; i < args.sectionIds.length; i++) {
      await ctx.db.patch(args.sectionIds[i], {
        order: i,
        updatedAt: now,
      });
    }

    // Update issue version
    const issue = await ctx.db.get(args.issueId);
    if (issue) {
      await ctx.db.patch(args.issueId, {
        updatedAt: now,
        version: issue.version + 1,
      });
    }

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "section.reorder",
      resourceType: "section",
      resourceId: args.issueId,
      details: { newOrder: args.sectionIds },
      timestamp: now,
    });
  },
});

// Delete section
export const remove = mutation({
  args: {
    id: v.id("sections"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) throw new Error("Section not found");

    const now = Date.now();

    // Delete the section
    await ctx.db.delete(args.id);

    // Update issue version
    const issue = await ctx.db.get(section.issueId);
    if (issue) {
      await ctx.db.patch(section.issueId, {
        updatedAt: now,
        version: issue.version + 1,
      });
    }

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "section.delete",
      resourceType: "section",
      resourceId: args.id,
      details: { issueId: section.issueId, type: section.type },
      timestamp: now,
    });
  },
});

// Duplicate section
export const duplicate = mutation({
  args: {
    id: v.id("sections"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) throw new Error("Section not found");

    const now = Date.now();

    // Get current sections to find new order
    const existingSections = await ctx.db
      .query("sections")
      .withIndex("by_issue", (q) => q.eq("issueId", section.issueId))
      .collect();

    const maxOrder = existingSections.reduce(
      (max, s) => Math.max(max, s.order),
      -1
    );

    // Create duplicate (media references stay the same per spec)
    const newSectionId = await ctx.db.insert("sections", {
      issueId: section.issueId,
      type: section.type,
      order: maxOrder + 1,
      visible: section.visible,
      data: section.data, // Reference same media, no deep copy
      createdAt: now,
      updatedAt: now,
    });

    // Update issue version
    const issue = await ctx.db.get(section.issueId);
    if (issue) {
      await ctx.db.patch(section.issueId, {
        updatedAt: now,
        version: issue.version + 1,
      });
    }

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "section.create",
      resourceType: "section",
      resourceId: newSectionId,
      details: { issueId: section.issueId, type: section.type, duplicatedFrom: args.id },
      timestamp: now,
    });

    return newSectionId;
  },
});

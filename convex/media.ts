import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all media (newest first)
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("media")
      .withIndex("by_uploaded_at")
      .order("desc");

    const media = args.limit ? await query.take(args.limit) : await query.collect();

    // Get URLs for each media item
    return Promise.all(
      media.map(async (item) => ({
        ...item,
        url: await ctx.storage.getUrl(item.storageId),
      }))
    );
  },
});

// Search media by filename
export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const allMedia = await ctx.db.query("media").collect();

    // Simple case-insensitive search
    const searchLower = args.query.toLowerCase();
    const results = allMedia.filter((item) =>
      item.filename.toLowerCase().includes(searchLower)
    );

    // Get URLs for results
    return Promise.all(
      results.map(async (item) => ({
        ...item,
        url: await ctx.storage.getUrl(item.storageId),
      }))
    );
  },
});

// Get single media item
export const get = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) return null;

    return {
      ...media,
      url: await ctx.storage.getUrl(media.storageId),
    };
  },
});

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create media record after upload
export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const mediaId = await ctx.db.insert("media", {
      storageId: args.storageId,
      filename: args.filename,
      mimeType: args.mimeType,
      size: args.size,
      width: args.width,
      height: args.height,
      uploadedBy: args.userId,
      uploadedAt: now,
    });

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "media.upload",
      resourceType: "media",
      resourceId: mediaId,
      details: { filename: args.filename },
      timestamp: now,
    });

    return mediaId;
  },
});

// Check if media can be deleted (not referenced)
export const canDelete = query({
  args: { mediaId: v.id("media") },
  handler: async (ctx, args) => {
    // Search all sections for references to this mediaId
    const sections = await ctx.db.query("sections").collect();

    const references: Array<{ issueId: string; sectionId: string; type: string }> = [];

    for (const section of sections) {
      const dataStr = JSON.stringify(section.data);
      if (dataStr.includes(args.mediaId)) {
        references.push({
          issueId: section.issueId as string,
          sectionId: section._id as string,
          type: section.type,
        });
      }
    }

    // Also check issue banner images
    const issues = await ctx.db.query("issues").collect();
    for (const issue of issues) {
      if (issue.bannerImage === args.mediaId) {
        references.push({
          issueId: issue._id as string,
          sectionId: "banner",
          type: "banner",
        });
      }
    }

    return {
      canDelete: references.length === 0,
      usageCount: references.length,
      referenceCount: references.length,
      references,
    };
  },
});

// Delete media (only if not referenced)
export const remove = mutation({
  args: {
    id: v.id("media"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) throw new Error("Media not found");

    // Check for references
    const sections = await ctx.db.query("sections").collect();
    for (const section of sections) {
      const dataStr = JSON.stringify(section.data);
      if (dataStr.includes(args.id)) {
        throw new Error(
          "Cannot delete media: it is referenced by one or more sections"
        );
      }
    }

    // Check issue banner images
    const issues = await ctx.db.query("issues").collect();
    for (const issue of issues) {
      if (issue.bannerImage === args.id) {
        throw new Error("Cannot delete media: it is used as a banner image");
      }
    }

    // Delete from storage
    await ctx.storage.delete(media.storageId);

    // Delete record
    await ctx.db.delete(args.id);

    // Log the action
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "media.delete",
      resourceType: "media",
      resourceId: args.id,
      details: { filename: media.filename },
      timestamp: Date.now(),
    });
  },
});

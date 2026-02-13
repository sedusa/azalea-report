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
  v.literal("photosOfMonth"),
  v.literal("genericText"),
  v.literal("twoColumn"),
  v.literal("custom"),
  v.literal("eventsBirthdays"),
  v.literal("thingsToDoInValdosta")
);

// Get all sections for an issue (ordered) with resolved media URLs
export const listByIssue = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_issue_order", (q) => q.eq("issueId", args.issueId))
      .collect();

    // Pre-fetch all birthdays for birthday sections
    const allBirthdays = await ctx.db.query("birthdays").collect();

    // Resolve image URLs in section data for preview
    const resolvedSections = await Promise.all(
      sections.map(async (section) => {
        const data = { ...section.data };

        // Resolve chiefs array images
        if (section.type === 'chiefsCorner' && data.chiefs && Array.isArray(data.chiefs)) {
          data.chiefs = await Promise.all(
            data.chiefs.map(async (chief: any) => ({
              ...chief,
              image: await resolveMediaUrl(ctx, chief.image),
            }))
          );
        }

        // Resolve interns array images
        if (section.type === 'internsCorner' && data.interns && Array.isArray(data.interns)) {
          data.interns = await Promise.all(
            data.interns.map(async (intern: any) => ({
              ...intern,
              image: await resolveMediaUrl(ctx, intern.image),
            }))
          );
        }

        // Resolve top-level image field (for spotlight, textImage, etc.)
        if (data.image) {
          data.image = await resolveMediaUrl(ctx, data.image);
        }

        // Resolve twoColumn images
        if (section.type === 'twoColumn') {
          if (data.leftImage) {
            data.leftImage = await resolveMediaUrl(ctx, data.leftImage);
          }
          if (data.rightImage) {
            data.rightImage = await resolveMediaUrl(ctx, data.rightImage);
          }
        }

        // Resolve images array (for recentSuccess, photosOfMonth, carousel, communityService, textCarousel)
        if (data.images && Array.isArray(data.images)) {
          if (section.type === 'photosOfMonth') {
            // For photosOfMonth, resolve with timestamps and sort most recent first
            const imagesWithTimestamps = await Promise.all(
              data.images.map(async (img: any) => {
                const resolved = await resolveMediaWithTimestamp(ctx, img.mediaId);
                return {
                  ...img,
                  mediaId: resolved.url || img.mediaId,
                  _uploadedAt: resolved.uploadedAt,
                };
              })
            );
            data.images = imagesWithTimestamps
              .sort((a: any, b: any) => b._uploadedAt - a._uploadedAt)
              .map(({ _uploadedAt, ...img }: any) => img);
          } else {
            data.images = await Promise.all(
              data.images.map(async (img: any) => ({
                ...img,
                mediaId: await resolveMediaUrl(ctx, img.mediaId) || img.mediaId,
              }))
            );
          }
        }

        // Resolve thingsToDoInValdosta carousel slides and place images
        if (section.type === 'thingsToDoInValdosta') {
          if (data.carousel?.slides && Array.isArray(data.carousel.slides)) {
            data.carousel = {
              ...data.carousel,
              slides: await Promise.all(
                data.carousel.slides.map(async (slide: any) => ({
                  ...slide,
                  mediaId: await resolveMediaUrl(ctx, slide.mediaId) || slide.mediaId,
                }))
              ),
            };
          }
          if (data.places && Array.isArray(data.places)) {
            data.places = await Promise.all(
              data.places.map(async (place: any) => ({
                ...place,
                mediaId: await resolveMediaUrl(ctx, place.mediaId) || place.mediaId,
              }))
            );
          }
        }

        // Populate birthdays for birthday sections
        if (section.type === 'birthdays') {
          data.birthdays = allBirthdays.map(b => ({
            _id: b._id,
            name: b.name,
            day: b.day,
            month: b.month,
          }));
        }

        // Populate birthdays for eventsBirthdays sections
        if (section.type === 'eventsBirthdays') {
          data.birthdays = allBirthdays.map(b => ({
            _id: b._id,
            name: b.name,
            day: b.day,
            month: b.month,
          }));
        }

        return { ...section, data, rawData: section.data };
      })
    );

    return resolvedSections;
  },
});

// Helper function to resolve media ID to URL
async function resolveMediaUrl(ctx: any, mediaId: string | undefined): Promise<string | undefined> {
  if (!mediaId) return undefined;

  // Check if it's already a URL
  if (mediaId.startsWith('http://') || mediaId.startsWith('https://')) {
    return mediaId;
  }

  try {
    const media = await ctx.db.get(mediaId as any);
    if (media?.storageId) {
      const url = await ctx.storage.getUrl(media.storageId);
      return url ?? undefined;
    }
  } catch {
    // If lookup fails, return undefined
  }
  return undefined;
}

// Helper to resolve media ID to URL + uploadedAt (for sorting)
async function resolveMediaWithTimestamp(ctx: any, mediaId: string | undefined): Promise<{ url: string | undefined; uploadedAt: number }> {
  if (!mediaId) return { url: undefined, uploadedAt: 0 };

  if (mediaId.startsWith('http://') || mediaId.startsWith('https://')) {
    return { url: mediaId, uploadedAt: 0 };
  }

  try {
    const media = await ctx.db.get(mediaId as any);
    if (media?.storageId) {
      const url = await ctx.storage.getUrl(media.storageId);
      return { url: url ?? undefined, uploadedAt: media.uploadedAt ?? 0 };
    }
  } catch {
    // If lookup fails, return defaults
  }
  return { url: undefined, uploadedAt: 0 };
}

// Get visible sections for an issue (for public display)
// Resolves all media IDs to URLs for chiefs/interns arrays
export const listVisibleByIssue = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_issue_order", (q) => q.eq("issueId", args.issueId))
      .collect();

    const visibleSections = sections.filter((section) => section.visible);

    // Pre-fetch all birthdays for birthday sections
    const allBirthdays = await ctx.db.query("birthdays").collect();

    // Resolve image URLs in section data
    const resolvedSections = await Promise.all(
      visibleSections.map(async (section) => {
        const data = { ...section.data };

        // Resolve chiefs array images
        if (section.type === 'chiefsCorner' && data.chiefs && Array.isArray(data.chiefs)) {
          data.chiefs = await Promise.all(
            data.chiefs.map(async (chief: any) => ({
              ...chief,
              image: await resolveMediaUrl(ctx, chief.image),
            }))
          );
        }

        // Resolve interns array images
        if (section.type === 'internsCorner' && data.interns && Array.isArray(data.interns)) {
          data.interns = await Promise.all(
            data.interns.map(async (intern: any) => ({
              ...intern,
              image: await resolveMediaUrl(ctx, intern.image),
            }))
          );
        }

        // Resolve top-level image field (for spotlight, legacy formats, etc.)
        if (data.image) {
          data.image = await resolveMediaUrl(ctx, data.image);
        }

        // Resolve twoColumn images
        if (section.type === 'twoColumn') {
          if (data.leftImage) {
            data.leftImage = await resolveMediaUrl(ctx, data.leftImage);
          }
          if (data.rightImage) {
            data.rightImage = await resolveMediaUrl(ctx, data.rightImage);
          }
        }

        // Resolve images array (for recentSuccess, photosOfMonth, carousel, communityService, textCarousel)
        if (data.images && Array.isArray(data.images)) {
          if (section.type === 'photosOfMonth') {
            // For photosOfMonth, resolve with timestamps and sort most recent first
            const imagesWithTimestamps = await Promise.all(
              data.images.map(async (img: any) => {
                const resolved = await resolveMediaWithTimestamp(ctx, img.mediaId);
                return {
                  ...img,
                  mediaId: resolved.url || img.mediaId,
                  _uploadedAt: resolved.uploadedAt,
                };
              })
            );
            data.images = imagesWithTimestamps
              .sort((a: any, b: any) => b._uploadedAt - a._uploadedAt)
              .map(({ _uploadedAt, ...img }: any) => img);
          } else {
            data.images = await Promise.all(
              data.images.map(async (img: any) => ({
                ...img,
                mediaId: await resolveMediaUrl(ctx, img.mediaId) || img.mediaId,
              }))
            );
          }
        }

        // Resolve thingsToDoInValdosta carousel slides and place images
        if (section.type === 'thingsToDoInValdosta') {
          if (data.carousel?.slides && Array.isArray(data.carousel.slides)) {
            data.carousel = {
              ...data.carousel,
              slides: await Promise.all(
                data.carousel.slides.map(async (slide: any) => ({
                  ...slide,
                  mediaId: await resolveMediaUrl(ctx, slide.mediaId) || slide.mediaId,
                }))
              ),
            };
          }
          if (data.places && Array.isArray(data.places)) {
            data.places = await Promise.all(
              data.places.map(async (place: any) => ({
                ...place,
                mediaId: await resolveMediaUrl(ctx, place.mediaId) || place.mediaId,
              }))
            );
          }
        }

        // Populate birthdays for birthday sections
        if (section.type === 'birthdays') {
          data.birthdays = allBirthdays.map(b => ({
            _id: b._id,
            name: b.name,
            day: b.day,
            month: b.month,
          }));
        }

        // Populate birthdays for eventsBirthdays sections
        if (section.type === 'eventsBirthdays') {
          data.birthdays = allBirthdays.map(b => ({
            _id: b._id,
            name: b.name,
            day: b.day,
            month: b.month,
          }));
        }

        return { ...section, data };
      })
    );

    return resolvedSections;
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
    userId: v.optional(v.id("users")),
    // Optional fields for backwards compatibility (ignored - calculated automatically)
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
    backgroundColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get the current max order for this issue (ignore passed order, calculate fresh)
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
      visible: args.visible !== undefined ? args.visible : true,
      backgroundColor: args.backgroundColor,
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

    // Log the action (only if user is authenticated)
    if (args.userId) {
      await ctx.db.insert("auditLog", {
        userId: args.userId,
        action: "section.create",
        resourceType: "section",
        resourceId: sectionId,
        details: { issueId: args.issueId, type: args.type },
        timestamp: now,
      });
    }

    return sectionId;
  },
});

// Update section data
export const update = mutation({
  args: {
    id: v.id("sections"),
    data: v.any(),
    userId: v.optional(v.id("users")),
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

    // Log the action (only if user is authenticated)
    if (args.userId) {
      await ctx.db.insert("auditLog", {
        userId: args.userId,
        action: "section.update",
        resourceType: "section",
        resourceId: args.id,
        timestamp: now,
      });
    }
  },
});

// Toggle section visibility
export const toggleVisibility = mutation({
  args: {
    id: v.id("sections"),
    userId: v.optional(v.id("users")),
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

// Update section background color
export const updateBackgroundColor = mutation({
  args: {
    id: v.id("sections"),
    backgroundColor: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) throw new Error("Section not found");

    const now = Date.now();

    await ctx.db.patch(args.id, {
      backgroundColor: args.backgroundColor,
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

// Update section custom label and/or description (editor-only display name)
export const updateLabel = mutation({
  args: {
    id: v.id("sections"),
    customLabel: v.optional(v.string()),
    customDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) throw new Error("Section not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.customLabel !== undefined) {
      patch.customLabel = args.customLabel || undefined;
    }
    if (args.customDescription !== undefined) {
      patch.customDescription = args.customDescription || undefined;
    }
    await ctx.db.patch(args.id, patch);
  },
});

// Reorder sections
export const reorder = mutation({
  args: {
    issueId: v.id("issues"),
    sectionIds: v.array(v.id("sections")),
    userId: v.optional(v.id("users")),
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

    // Log the action (only if user is authenticated)
    if (args.userId) {
      await ctx.db.insert("auditLog", {
        userId: args.userId,
        action: "section.reorder",
        resourceType: "section",
        resourceId: args.issueId,
        details: { newOrder: args.sectionIds },
        timestamp: now,
      });
    }
  },
});

// Delete section
export const remove = mutation({
  args: {
    id: v.id("sections"),
    userId: v.optional(v.id("users")),
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

    // Log the action (only if user is authenticated)
    if (args.userId) {
      await ctx.db.insert("auditLog", {
        userId: args.userId,
        action: "section.delete",
        resourceType: "section",
        resourceId: args.id,
        details: { issueId: section.issueId, type: section.type },
        timestamp: now,
      });
    }
  },
});

// Duplicate section
export const duplicate = mutation({
  args: {
    id: v.id("sections"),
    userId: v.optional(v.id("users")),
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
      customLabel: section.customLabel,
      customDescription: section.customDescription,
      backgroundColor: section.backgroundColor,
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

    // Log the action (only if user is authenticated)
    if (args.userId) {
      await ctx.db.insert("auditLog", {
        userId: args.userId,
        action: "section.create",
        resourceType: "section",
        resourceId: newSectionId,
        details: { issueId: section.issueId, type: section.type, duplicatedFrom: args.id },
        timestamp: now,
      });
    }

    return newSectionId;
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Issues table - main content container
  issues: defineTable({
    title: v.string(),
    slug: v.string(),
    edition: v.number(),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    bannerImage: v.optional(v.id("media")),
    bannerTitle: v.string(),
    bannerDate: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
    version: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_edition", ["edition"]),

  // Sections table - content blocks within issues
  sections: defineTable({
    issueId: v.id("issues"),
    type: v.union(
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
    ),
    order: v.number(),
    visible: v.boolean(),
    data: v.any(), // Section-specific data, validated by section validators
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_issue", ["issueId"])
    .index("by_issue_order", ["issueId", "order"]),

  // Media table - uploaded files
  media: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_uploaded_at", ["uploadedAt"])
    .index("by_filename", ["filename"]),

  // Users table - authentication and authorization
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("viewer"), v.literal("editor"), v.literal("admin")),
    passwordHash: v.optional(v.string()), // For email/password auth
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"]),

  // Locks table - pessimistic locking for issue editing
  locks: defineTable({
    issueId: v.id("issues"),
    userId: v.id("users"),
    acquiredAt: v.number(),
    lastHeartbeat: v.number(),
  })
    .index("by_issue", ["issueId"])
    .index("by_user", ["userId"]),

  // Audit log table - track all changes
  auditLog: defineTable({
    userId: v.id("users"),
    action: v.union(
      v.literal("issue.create"),
      v.literal("issue.update"),
      v.literal("issue.publish"),
      v.literal("issue.unpublish"),
      v.literal("issue.archive"),
      v.literal("section.create"),
      v.literal("section.update"),
      v.literal("section.delete"),
      v.literal("section.reorder"),
      v.literal("media.upload"),
      v.literal("media.delete"),
      v.literal("user.create"),
      v.literal("user.update")
    ),
    resourceType: v.union(
      v.literal("issue"),
      v.literal("section"),
      v.literal("media"),
      v.literal("user")
    ),
    resourceId: v.string(),
    details: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_user", ["userId"])
    .index("by_resource", ["resourceType", "resourceId"]),

  // Birthdays table - resident birthdays (dynamic data)
  birthdays: defineTable({
    name: v.string(),
    month: v.number(), // 1-12
    day: v.number(), // 1-31
    role: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_month", ["month"])
    .index("by_name", ["name"]),

  // Sessions table - for Convex Auth
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),
});

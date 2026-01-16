# Azalea Report CMS Architecture Restructure

## Executive Summary

This document outlines the architecture for restructuring the Azalea Report from a markdown-driven static site into a full-featured CMS with drag-and-drop capabilities, using **Convex** as the backend and a **Next.js** frontend deployed on **Netlify**.

---

## Current State Analysis

### What Exists Today
- **Framework**: Next.js 14 with static export
- **Content Storage**: Markdown files with YAML frontmatter (`content/*.md`)
- **Styling**: CSS Modules (33 module files)
- **Components**: 23+ section-specific components
- **Deployment**: Netlify static hosting
- **Data Sources**: Local markdown, `birthdays.json`, unused Supabase client

### Pain Points
1. Content editing requires code changes and Git commits
2. No visual editor for non-technical users
3. No section reordering without code modifications
4. No real-time preview capabilities
5. Tight coupling between content and presentation

---

## Proposed Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NETLIFY                                  │
│  ┌──────────────────────┐    ┌─────────────────────────────┐   │
│  │   Public Frontend    │    │      CMS Admin Panel        │   │
│  │   (Next.js SSG)      │    │   (Next.js + Auth)          │   │
│  │                      │    │   - Drag & Drop Editor      │   │
│  │   /                  │    │   - Media Library           │   │
│  │   /archives          │    │   - Preview Mode            │   │
│  │   /archives/[slug]   │    │   /admin                    │   │
│  └──────────┬───────────┘    └──────────────┬──────────────┘   │
│             │                                │                   │
└─────────────┼────────────────────────────────┼───────────────────┘
              │                                │
              ▼                                ▼
        ┌─────────────────────────────────────────────┐
        │              CONVEX BACKEND                  │
        │                                              │
        │  ┌─────────────┐  ┌─────────────────────┐  │
        │  │   Database  │  │   Serverless Funcs  │  │
        │  │  - Pages    │  │   - CRUD operations │  │
        │  │  - Sections │  │   - Image upload    │  │
        │  │  - Media    │  │   - Auth handlers   │  │
        │  │  - Users    │  │   - Webhooks        │  │
        │  └─────────────┘  └─────────────────────┘  │
        │                                              │
        │  ┌─────────────────────────────────────┐   │
        │  │        File Storage                  │   │
        │  │   - Images, PDFs, Media assets      │   │
        │  └─────────────────────────────────────┘   │
        └─────────────────────────────────────────────┘
```

---

## Recommended Project Structure

```
azalea-report/
├── apps/
│   ├── web/                          # Public-facing website
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Homepage (latest issue)
│   │   │   ├── archives/
│   │   │   │   ├── page.tsx          # Archive listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Individual archive
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                   # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Carousel.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Banner.tsx
│   │   │   │   └── Container.tsx
│   │   │   └── sections/             # Content section renderers
│   │   │       ├── index.ts          # Section registry
│   │   │       ├── AboutSection.tsx
│   │   │       ├── SpotlightSection.tsx
│   │   │       ├── CarouselSection.tsx
│   │   │       ├── TextImageSection.tsx
│   │   │       ├── EventsSection.tsx
│   │   │       └── [SectionType].tsx
│   │   ├── lib/
│   │   │   ├── convex.ts             # Convex client setup
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── useBreakpoint.ts
│   │   │   └── useTheme.ts
│   │   └── styles/
│   │       └── [component].module.css
│   │
│   └── admin/                        # CMS Admin Panel
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Dashboard
│       │   ├── login/
│       │   │   └── page.tsx
│       │   ├── issues/
│       │   │   ├── page.tsx          # Issue list
│       │   │   ├── new/
│       │   │   │   └── page.tsx
│       │   │   └── [id]/
│       │   │       ├── page.tsx      # Issue editor
│       │   │       └── preview/
│       │   │           └── page.tsx
│       │   ├── media/
│       │   │   └── page.tsx          # Media library
│       │   └── settings/
│       │       └── page.tsx
│       ├── components/
│       │   ├── editor/
│       │   │   ├── DragDropCanvas.tsx
│       │   │   ├── SectionPalette.tsx
│       │   │   ├── SectionEditor.tsx
│       │   │   ├── PropertyPanel.tsx
│       │   │   └── PreviewPane.tsx
│       │   ├── media/
│       │   │   ├── MediaLibrary.tsx
│       │   │   ├── ImageUploader.tsx
│       │   │   └── MediaPicker.tsx
│       │   └── auth/
│       │       └── AuthGuard.tsx
│       └── lib/
│           ├── convex.ts
│           └── auth.ts
│
├── packages/
│   ├── shared/                       # Shared code between apps
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── section.types.ts
│   │   │   ├── issue.types.ts
│   │   │   └── media.types.ts
│   │   ├── constants/
│   │   │   ├── sectionTypes.ts
│   │   │   └── themes.ts
│   │   └── utils/
│   │       ├── text.ts
│   │       └── date.ts
│   │
│   └── ui/                           # Shared UI component library
│       ├── src/
│       │   ├── Button/
│       │   ├── Input/
│       │   ├── RichTextEditor/
│       │   └── index.ts
│       └── package.json
│
├── convex/                           # Convex backend
│   ├── schema.ts                     # Database schema
│   ├── issues.ts                     # Issue CRUD operations
│   ├── sections.ts                   # Section operations
│   ├── media.ts                      # Media/file operations
│   ├── users.ts                      # User management
│   ├── auth.ts                       # Authentication
│   └── _generated/                   # Auto-generated Convex code
│
├── scripts/
│   ├── migrate-content.ts            # Migration from markdown
│   └── seed-data.ts
│
├── turbo.json                        # Turborepo config
├── package.json                      # Root package.json
└── README.md
```

---

## Convex Data Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table for CMS authentication
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Newsletter issues
  issues: defineTable({
    title: v.string(),
    slug: v.string(),
    edition: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("users"),
    // Banner/header data
    banner: v.object({
      headerImage: v.optional(v.id("media")),
      title: v.string(),
      subtitle: v.optional(v.string()),
      date: v.string(),
    }),
    // Ordered list of section IDs
    sectionOrder: v.array(v.id("sections")),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_edition", ["edition"]),

  // Content sections (polymorphic)
  sections: defineTable({
    issueId: v.id("issues"),
    type: v.string(), // "spotlight", "textImage", "carousel", "events", etc.
    order: v.number(),
    visible: v.boolean(),
    // Flexible data field for section-specific content
    data: v.any(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_issue", ["issueId"]),

  // Media library
  media: defineTable({
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageId: v.id("_storage"),
    url: v.string(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    folder: v.optional(v.string()),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_folder", ["folder"])
    .index("by_type", ["mimeType"]),

  // Birthdays (migrated from JSON)
  birthdays: defineTable({
    name: v.string(),
    day: v.number(),
    month: v.number(),
    department: v.optional(v.string()),
  }).index("by_month", ["month"]),

  // Audit log for tracking changes
  auditLog: defineTable({
    userId: v.id("users"),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_entity", ["entityType", "entityId"]),
});
```

---

## Section Type Definitions

```typescript
// packages/shared/types/section.types.ts

export type SectionType =
  | "about"
  | "spotlight"
  | "chiefsCorner"
  | "internsCorner"
  | "textImage"
  | "carousel"
  | "textCarousel"
  | "events"
  | "podcast"
  | "birthdays"
  | "culturosity"
  | "communityService"
  | "recentSuccess"
  | "musings"
  | "photosOfMonth"
  | "genericText"
  | "custom";

// Base section interface
interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  sectionTitle?: string;
}

// Section-specific data shapes
export interface SpotlightSectionData extends BaseSection {
  type: "spotlight";
  data: {
    name: string;
    image?: string;
    birthplace?: string;
    medicalSchool?: string;
    funFact?: string;
    favoriteDish?: string;
    interests?: string;
    postResidencyPlans?: string;
  };
}

export interface TextImageSectionData extends BaseSection {
  type: "textImage";
  data: {
    content: string; // Rich text/HTML
    image?: string;
    imagePosition: "left" | "right";
    imageCaption?: string;
  };
}

export interface CarouselSectionData extends BaseSection {
  type: "carousel";
  data: {
    title: string;
    description?: string;
    images: Array<{
      src: string;
      caption?: string;
    }>;
  };
}

export interface EventsSectionData extends BaseSection {
  type: "events";
  data: {
    events: Array<{
      title: string;
      date: string;
      location?: string;
      description?: string;
    }>;
  };
}

// Union type for all sections
export type Section =
  | SpotlightSectionData
  | TextImageSectionData
  | CarouselSectionData
  | EventsSectionData;
// ... add more as needed

// Section registry for drag-drop palette
export const SECTION_REGISTRY: Record<SectionType, {
  label: string;
  icon: string;
  defaultData: unknown;
  fields: FieldDefinition[];
}> = {
  spotlight: {
    label: "Resident Spotlight",
    icon: "user",
    defaultData: { name: "", image: "" },
    fields: [
      { name: "name", type: "text", required: true },
      { name: "image", type: "image", required: false },
      // ... more fields
    ],
  },
  // ... define all section types
};
```

---

## Key Components Architecture

### 1. Drag & Drop Editor

```
┌────────────────────────────────────────────────────────────────┐
│                        Issue Editor                             │
├─────────────┬──────────────────────────────┬───────────────────┤
│             │                              │                    │
│  Section    │      Drag & Drop Canvas      │   Property Panel  │
│  Palette    │                              │                    │
│             │  ┌──────────────────────┐    │   ┌────────────┐  │
│  [Spotlight]│  │     Banner Section   │    │   │ Section    │  │
│  [TextImage]│  └──────────────────────┘    │   │ Properties │  │
│  [Carousel] │  ┌──────────────────────┐    │   │            │  │
│  [Events]   │  │   About Section      │    │   │ Title: [  ]│  │
│  [Podcast]  │  │   (selected)         │◀───┼───│ Image: [  ]│  │
│  [Birthdays]│  └──────────────────────┘    │   │ Content:   │  │
│  [Custom]   │  ┌──────────────────────┐    │   │ [        ] │  │
│             │  │   Spotlight Section  │    │   │            │  │
│  ──────────│  └──────────────────────┘    │   │ [Delete]   │  │
│  Drag to   │  ┌──────────────────────┐    │   │ [Duplicate]│  │
│  add new   │  │   Events Section     │    │   └────────────┘  │
│  sections  │  └──────────────────────┘    │                    │
│             │         ▲ ▼ (reorder)        │                    │
├─────────────┴──────────────────────────────┴───────────────────┤
│  [Save Draft]    [Preview]    [Publish]           Status: Draft │
└────────────────────────────────────────────────────────────────┘
```

### Recommended Libraries for Drag & Drop

```typescript
// Option 1: @dnd-kit (Recommended)
// - Lightweight, accessible, excellent React integration
// - Best for sortable lists and kanban-style interfaces

// Option 2: react-beautiful-dnd
// - Battle-tested, great UX out of the box
// - Note: No longer actively maintained

// Option 3: @hello-pangea/dnd
// - Fork of react-beautiful-dnd with active maintenance
```

### 2. Section Renderer Pattern

```typescript
// apps/web/components/sections/index.ts
import { AboutSection } from "./AboutSection";
import { SpotlightSection } from "./SpotlightSection";
import { CarouselSection } from "./CarouselSection";
import { TextImageSection } from "./TextImageSection";
// ... import all sections

// Section component registry
export const SECTION_COMPONENTS: Record<SectionType, React.ComponentType<any>> = {
  about: AboutSection,
  spotlight: SpotlightSection,
  carousel: CarouselSection,
  textImage: TextImageSection,
  // ... all section types
};

// Dynamic section renderer
export function SectionRenderer({ section }: { section: Section }) {
  const Component = SECTION_COMPONENTS[section.type];

  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }

  return <Component data={section.data} />;
}
```

### 3. Issue Page Composition

```typescript
// apps/web/app/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Banner } from "@/components/layout/Banner";
import { SectionRenderer } from "@/components/sections";

export default async function HomePage() {
  // Fetch latest published issue
  const issue = await fetchQuery(api.issues.getLatest);

  if (!issue) return <div>No published issues</div>;

  return (
    <main>
      <Banner {...issue.banner} />

      {issue.sections
        .filter(s => s.visible)
        .sort((a, b) => a.order - b.order)
        .map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))
      }
    </main>
  );
}
```

---

## Convex Functions

### Issues API

```typescript
// convex/issues.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get latest published issue
export const getLatest = query({
  handler: async (ctx) => {
    const issue = await ctx.db
      .query("issues")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .first();

    if (!issue) return null;

    // Fetch all sections for this issue
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_issue", (q) => q.eq("issueId", issue._id))
      .collect();

    // Fetch media for banner
    const bannerImage = issue.banner.headerImage
      ? await ctx.db.get(issue.banner.headerImage)
      : null;

    return {
      ...issue,
      banner: {
        ...issue.banner,
        headerImage: bannerImage?.url,
      },
      sections: sections.sort((a, b) => a.order - b.order),
    };
  },
});

// Get issue by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const issue = await ctx.db
      .query("issues")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!issue) return null;

    const sections = await ctx.db
      .query("sections")
      .withIndex("by_issue", (q) => q.eq("issueId", issue._id))
      .collect();

    return { ...issue, sections };
  },
});

// Create new issue
export const create = mutation({
  args: {
    title: v.string(),
    edition: v.number(),
    banner: v.object({
      title: v.string(),
      subtitle: v.optional(v.string()),
      date: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    const slug = args.title.toLowerCase().replace(/\s+/g, "-");
    const now = Date.now();

    return await ctx.db.insert("issues", {
      ...args,
      slug,
      status: "draft",
      sectionOrder: [],
      createdAt: now,
      updatedAt: now,
      createdBy: user!._id,
    });
  },
});

// Update section order (for drag & drop)
export const updateSectionOrder = mutation({
  args: {
    issueId: v.id("issues"),
    sectionOrder: v.array(v.id("sections")),
  },
  handler: async (ctx, { issueId, sectionOrder }) => {
    // Update order field on each section
    for (let i = 0; i < sectionOrder.length; i++) {
      await ctx.db.patch(sectionOrder[i], { order: i });
    }

    await ctx.db.patch(issueId, {
      sectionOrder,
      updatedAt: Date.now(),
    });
  },
});

// Publish issue
export const publish = mutation({
  args: { issueId: v.id("issues") },
  handler: async (ctx, { issueId }) => {
    await ctx.db.patch(issueId, {
      status: "published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

### Sections API

```typescript
// convex/sections.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add section to issue
export const create = mutation({
  args: {
    issueId: v.id("issues"),
    type: v.string(),
    data: v.any(),
  },
  handler: async (ctx, { issueId, type, data }) => {
    const issue = await ctx.db.get(issueId);
    if (!issue) throw new Error("Issue not found");

    const existingSections = await ctx.db
      .query("sections")
      .withIndex("by_issue", (q) => q.eq("issueId", issueId))
      .collect();

    const order = existingSections.length;
    const now = Date.now();

    const sectionId = await ctx.db.insert("sections", {
      issueId,
      type,
      order,
      visible: true,
      data,
      createdAt: now,
      updatedAt: now,
    });

    // Update issue's section order
    await ctx.db.patch(issueId, {
      sectionOrder: [...issue.sectionOrder, sectionId],
      updatedAt: now,
    });

    return sectionId;
  },
});

// Update section data
export const update = mutation({
  args: {
    sectionId: v.id("sections"),
    data: v.any(),
  },
  handler: async (ctx, { sectionId, data }) => {
    await ctx.db.patch(sectionId, {
      data,
      updatedAt: Date.now(),
    });
  },
});

// Toggle section visibility
export const toggleVisibility = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, { sectionId }) => {
    const section = await ctx.db.get(sectionId);
    if (!section) throw new Error("Section not found");

    await ctx.db.patch(sectionId, {
      visible: !section.visible,
      updatedAt: Date.now(),
    });
  },
});

// Delete section
export const remove = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, { sectionId }) => {
    const section = await ctx.db.get(sectionId);
    if (!section) throw new Error("Section not found");

    const issue = await ctx.db.get(section.issueId);
    if (issue) {
      await ctx.db.patch(issue._id, {
        sectionOrder: issue.sectionOrder.filter((id) => id !== sectionId),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(sectionId);
  },
});
```

### Media API

```typescript
// convex/media.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save uploaded media record
export const saveMedia = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    folder: v.optional(v.string()),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    return await ctx.db.insert("media", {
      ...args,
      url,
      uploadedBy: user!._id,
      createdAt: Date.now(),
    });
  },
});

// List media with optional folder filter
export const list = query({
  args: { folder: v.optional(v.string()) },
  handler: async (ctx, { folder }) => {
    if (folder) {
      return await ctx.db
        .query("media")
        .withIndex("by_folder", (q) => q.eq("folder", folder))
        .order("desc")
        .collect();
    }

    return await ctx.db.query("media").order("desc").collect();
  },
});
```

---

## Authentication Strategy

### Option 1: Convex Auth (Recommended for simplicity)

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
```

### Option 2: Clerk Integration

```typescript
// apps/admin/lib/auth.ts
import { ClerkProvider } from "@clerk/nextjs";

// Clerk provides:
// - User management UI
// - Social logins (Google, GitHub)
// - Role-based access control
// - Session management
```

### Option 3: Custom Auth with Convex

```typescript
// Simple email/password or magic link
// Store hashed passwords in users table
// Use Convex's built-in session management
```

---

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Initialize Turborepo monorepo structure
2. Set up Convex project and schema
3. Configure authentication
4. Deploy empty admin and web apps

### Phase 2: Migrate Content
```typescript
// scripts/migrate-content.ts
import matter from "gray-matter";
import fs from "fs";
import { ConvexClient } from "convex/browser";

async function migrateMarkdownToConvex() {
  const client = new ConvexClient(process.env.CONVEX_URL!);

  // Read all markdown files
  const contentDir = "./content";
  const files = fs.readdirSync(contentDir);

  for (const file of files) {
    const content = fs.readFileSync(`${contentDir}/${file}`, "utf8");
    const { data } = matter(content);

    // Create issue
    const issueId = await client.mutation(api.issues.create, {
      title: data.banner?.title || "Untitled",
      edition: data.banner?.edition || 0,
      banner: {
        title: data.banner?.title || "",
        subtitle: data.banner?.subtitle,
        date: data.banner?.date || "",
      },
    });

    // Migrate each section
    const sectionMappings = [
      { key: "about", type: "about" },
      { key: "spotlight", type: "spotlight" },
      { key: "chiefsCorner", type: "chiefsCorner" },
      // ... map all section types
    ];

    for (const mapping of sectionMappings) {
      if (data[mapping.key]) {
        await client.mutation(api.sections.create, {
          issueId,
          type: mapping.type,
          data: data[mapping.key],
        });
      }
    }
  }
}
```

### Phase 3: Build Admin Interface
1. Create drag-and-drop editor components
2. Build media library with upload
3. Implement preview mode
4. Add user management

### Phase 4: Build Public Frontend
1. Port existing components to new structure
2. Connect to Convex for data fetching
3. Implement static generation with ISR
4. Set up Netlify deployment

### Phase 5: Testing & Launch
1. Parallel run old and new systems
2. Content team training
3. Gradual rollout
4. Deprecate markdown system

---

## Deployment Configuration

### Netlify Configuration

```toml
# netlify.toml (web app)
[build]
  command = "npm run build"
  publish = "apps/web/.next"

[build.environment]
  NEXT_PUBLIC_CONVEX_URL = "https://your-deployment.convex.cloud"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Separate site for admin
# netlify.toml (admin app)
[build]
  command = "npm run build:admin"
  publish = "apps/admin/.next"

[context.production.environment]
  NEXT_PUBLIC_CONVEX_URL = "https://your-deployment.convex.cloud"
```

### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_CONVEX_URL=https://your-dev.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Production (set in Netlify dashboard)
NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud
CLERK_SECRET_KEY=your-clerk-secret  # if using Clerk
```

---

## Recommended Tech Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Monorepo** | Turborepo | Fast builds, shared packages |
| **Frontend** | Next.js 14+ (App Router) | SSG, ISR, modern React |
| **Backend** | Convex | Real-time, type-safe, serverless |
| **Drag & Drop** | @dnd-kit | Modern, accessible, flexible |
| **Rich Text** | Tiptap or Plate | Extensible, React-native |
| **Auth** | Clerk or Convex Auth | Simple integration |
| **Styling** | Tailwind CSS | Rapid development, consistency |
| **Hosting** | Netlify | Static hosting, edge functions |
| **File Storage** | Convex Storage | Integrated with backend |

---

## Cost Considerations

### Convex Pricing (as of 2024)
- **Free Tier**: Generous for development
- **Pro**: $25/month (sufficient for most newsletters)
- Includes: 1M function calls, 1GB storage, 256MB database

### Netlify Pricing
- **Free Tier**: 100GB bandwidth, 300 build minutes
- **Pro**: $19/user/month for team features

### Total Estimated Cost
- **Development**: Free (using free tiers)
- **Production**: ~$25-50/month for small team

---

## Security Considerations

1. **Authentication**: All admin routes protected
2. **Authorization**: Role-based access (admin/editor/viewer)
3. **Input Validation**: Convex validators on all mutations
4. **File Uploads**: Type/size restrictions, virus scanning
5. **Audit Logging**: Track all content changes
6. **CORS**: Properly configured for Convex
7. **Environment Variables**: Never expose secrets client-side

---

## Future Enhancements

1. **Version History**: Track section/issue revisions
2. **Scheduled Publishing**: Publish at specific date/time
3. **Content Templates**: Pre-built section combinations
4. **Multi-language**: i18n support
5. **Analytics Dashboard**: Track readership
6. **Email Distribution**: Integrate with SendGrid/Mailchimp
7. **Mobile App**: React Native admin app
8. **AI Assistance**: Content suggestions, image generation

---

## Getting Started

```bash
# 1. Create monorepo
npx create-turbo@latest azalea-report-cms

# 2. Initialize Convex
npx convex dev

# 3. Install dependencies
npm install @dnd-kit/core @dnd-kit/sortable convex

# 4. Run development
npm run dev

# 5. Deploy to Netlify
netlify deploy --prod
```

---

## Questions to Consider

1. **Who will maintain the CMS?** Technical vs non-technical users
2. **How often is content updated?** Real-time needs vs batch updates
3. **What's the budget?** Free tier limitations vs paid features
4. **Existing integrations?** Email, analytics, etc.
5. **Content approval workflow?** Draft → Review → Publish pipeline

---

*Document Version: 1.0*
*Last Updated: January 2026*

# Azalea Report CMS - Technical Specification

> **Version:** 1.0
> **Date:** January 2026
> **Status:** Approved for Implementation

This specification document captures all technical and UX decisions for the Azalea Report CMS restructure project. It should be treated as the authoritative reference during implementation.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
   - [Tech Stack](#tech-stack)
   - [Cost Strategy: Free Tier Only](#cost-strategy-free-tier-only)
2. [Type Safety & Validation](#type-safety--validation)
3. [Concurrency & Locking](#concurrency--locking)
4. [Media Management](#media-management)
5. [Editor UX](#editor-ux)
6. [Data & Content Behavior](#data--content-behavior)
7. [Authentication & Authorization](#authentication--authorization)
8. [Technical Architecture](#technical-architecture)
9. [Operations & Deployment](#operations--deployment)
10. [Section Type Registry](#section-type-registry)
11. [Migration Plan](#migration-plan)
12. [Implementation Phases](#implementation-phases)

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Decision Rationale | Cost |
|-------|------------|-------------------|------|
| Monorepo | Turborepo | Fast builds, shared packages | **Free** (MIT) |
| Frontend | Next.js 14+ (App Router) | SSG, ISR, modern React | **Free** (MIT) |
| Backend | Convex | Real-time, type-safe, serverless | **Free tier** |
| Drag & Drop | @dnd-kit | Modern, accessible, flexible | **Free** (MIT) |
| Rich Text | **Tiptap** | Mature ecosystem, Prosemirror-based, excellent docs | **Free** (MIT core) |
| Auth | **Convex Auth** | Native integration, simpler setup | **Free** (included) |
| Styling | **Tailwind CSS** | Full migration from CSS Modules | **Free** (MIT) |
| Hosting | Netlify | Static hosting, edge functions | **Free tier** |
| File Storage | Convex Storage | Integrated with backend | **Free tier** |

### Cost Strategy: Free Tier Only

**Primary Constraint:** Minimize costs by using free tiers exclusively.

#### Free Tier Limits & Fit

| Service | Free Tier Limits | Our Usage | Fit |
|---------|------------------|-----------|-----|
| **Convex** | 1M function calls/mo, 1GB storage, 256MB database | 1-2 editors, ~50 issues/year, ~500 images | Comfortable |
| **Netlify** | 100GB bandwidth/mo, 300 build mins/mo | Low traffic newsletter, ~10 builds/mo | Comfortable |
| **Tiptap** | Unlimited (MIT licensed core) | Standard rich text features | Perfect |

#### What's NOT Included (and not needed)

- **Tiptap Cloud** ($0 - not using): Real-time collaboration features. We use lock-based editing instead.
- **Convex Pro** ($0 - not using): Higher limits. Free tier is sufficient for 1-2 editors.
- **Netlify Pro** ($0 - not using): Team features. Not needed for small team.
- **Clerk** ($0 - not using): Using Convex Auth instead.
- **External CDN** ($0 - not using): Convex Storage handles media.

#### Cost Monitoring

- Set up Convex dashboard alerts at 80% of free tier limits
- Monitor Netlify build minutes monthly
- If limits approached, optimize before upgrading:
  - Reduce autosave frequency
  - Batch media uploads
  - Cache more aggressively

**Total Monthly Cost: $0**

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NETLIFY                                  │
│                                                                  │
│  ┌──────────────────────┐    ┌─────────────────────────────┐   │
│  │   azaleareport.com   │    │  admin.azaleareport.com     │   │
│  │   (Public Website)   │    │  (CMS Admin Panel)          │   │
│  │   Next.js SSG        │    │  Next.js + Convex Auth      │   │
│  └──────────┬───────────┘    └──────────────┬──────────────┘   │
│             │                                │                   │
└─────────────┼────────────────────────────────┼───────────────────┘
              │                                │
              ▼                                ▼
        ┌─────────────────────────────────────────────┐
        │              CONVEX BACKEND                  │
        │   - Database (issues, sections, media)      │
        │   - File Storage                            │
        │   - Serverless Functions                    │
        │   - Authentication                          │
        └─────────────────────────────────────────────┘
```

**Key Decision:** Admin panel deployed as **separate subdomain** (`admin.azaleareport.com`) - separate deploy, separate auth boundary, cleaner separation of concerns.

---

## Type Safety & Validation

### Section Data Validation: Strict Validators Per Section

**Decision:** Implement strict Convex validators for each section type rather than using `v.any()`.

**Rationale:**
- Catches malformed data at mutation time rather than render time
- Enables better autocomplete and IntelliSense in the editor
- Prevents silent data corruption
- Worth the upfront development cost for long-term reliability

**Implementation Requirements:**

```typescript
// convex/validators/sections.ts
import { v } from "convex/values";

export const spotlightValidator = v.object({
  name: v.string(),
  image: v.optional(v.id("media")),
  birthplace: v.optional(v.string()),
  medicalSchool: v.optional(v.string()),
  funFact: v.optional(v.string()),
  favoriteDish: v.optional(v.string()),
  interests: v.optional(v.string()),
  postResidencyPlans: v.optional(v.string()),
});

export const textImageValidator = v.object({
  content: v.string(), // Sanitized HTML from Tiptap
  image: v.optional(v.id("media")),
  imagePosition: v.union(v.literal("left"), v.literal("right")),
  imageCaption: v.optional(v.string()),
});

export const carouselValidator = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  images: v.array(v.object({
    mediaId: v.id("media"),
    caption: v.optional(v.string()),
  })),
});

// ... validators for all 16+ section types
```

**Each section type MUST have:**
1. A TypeScript interface in `packages/shared/types/`
2. A Convex validator in `convex/validators/`
3. A default data factory in the section registry

---

## Concurrency & Locking

### Editing Model: Lock-Based with Session Lifecycle

**Decision:** Pessimistic locking - only one user can edit an issue at a time.

**Lock Behavior:**
- Lock acquired when editor opens an issue for editing
- Lock held for duration of browser session
- Requires heartbeat mechanism to detect abandoned sessions
- Other users see read-only view with "Locked by [User]" indicator

**Implementation Details:**

```typescript
// convex/schema.ts - Add to issues table
locks: defineTable({
  issueId: v.id("issues"),
  userId: v.id("users"),
  acquiredAt: v.number(),
  lastHeartbeat: v.number(),
}).index("by_issue", ["issueId"]),
```

**Heartbeat Requirements:**
- Client sends heartbeat every 30 seconds
- Lock considered stale if no heartbeat for 2 minutes
- Stale locks automatically released by scheduled Convex function
- Admin can force-release any lock

**Team Size Context:** 1-2 concurrent editors expected. Lock contention unlikely but system should handle it gracefully.

---

## Media Management

### Media Library Structure: Flat with Search

**Decision:** Single flat media library with search and date sorting - no folders.

**Rationale:**
- Simpler implementation and UX
- Search is more efficient than folder navigation for finding specific images
- Avoids folder maintenance overhead
- Date sorting shows recent uploads first (most relevant)

### Media Deletion: Block if Referenced

**Decision:** Prevent deletion of media that is referenced by any section.

**Implementation Requirements:**
1. Track all media references across sections
2. On delete attempt, query for references
3. Show error: "This image is used in [N] sections. Remove references before deleting."
4. Provide "Find References" action to show where media is used

```typescript
// convex/media.ts
export const canDelete = query({
  args: { mediaId: v.id("media") },
  handler: async (ctx, { mediaId }) => {
    // Search all sections for references to this mediaId
    const sections = await ctx.db.query("sections").collect();
    const references = sections.filter(section =>
      JSON.stringify(section.data).includes(mediaId)
    );
    return {
      canDelete: references.length === 0,
      referenceCount: references.length,
      references: references.map(s => ({ issueId: s.issueId, sectionId: s._id }))
    };
  },
});
```

### Image Picker: Inline Thumbnail Grid

**Decision:** Show recent/relevant images inline in property panel with "Browse all" to open full library.

**UX Flow:**
1. Image field shows current image thumbnail (or placeholder)
2. Below: grid of 6-8 recent images from library
3. "Browse all" button opens full media library modal
4. Drag-and-drop upload zone for quick new uploads

### Section Duplication: Reference Same Media

**Decision:** When duplicating a section, media references point to the same files (no deep copy).

**Rationale:**
- No storage duplication
- Most users expect this behavior
- If user wants independent media, they can upload new files

---

## Editor UX

### Autosave: Debounced 2-3 Seconds

**Decision:** Automatically save after user stops typing/editing for 2-3 seconds.

**Implementation:**
- Debounce all field changes
- Show subtle "Saving..." indicator during save
- Show "Saved" with timestamp after successful save
- Saves increment a version counter for audit purposes
- Autosave writes to draft state only (never auto-publishes)

### Preview: Inline Split-Screen

**Decision:** Editor on left, live preview on right in same window.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Issue: January 2026 Edition              [Save] [Pub]  │
├────────────────────┬────────────────────────────────────┤
│  Section Palette   │                                    │
│  ─────────────────│         Drag & Drop                │
│  [+ Spotlight]    │           Canvas                   │
│  [+ TextImage]    │                                    │
│  [+ Carousel]     │  ┌────────────────────────────┐   │
│  [+ Events]       │  │  Banner Section            │   │
│  [+ Podcast]      │  └────────────────────────────┘   │
│  [+ Birthdays]    │  ┌────────────────────────────┐   │
│  ...              │  │  Spotlight (selected)  ≡  │◀──┼───┐
│                   │  └────────────────────────────┘   │   │
│                   │  ┌────────────────────────────┐   │   │
├───────────────────│  │  Events Section        ≡  │   │   │
│  Property Panel   │  └────────────────────────────┘   │   │
│  ─────────────────│                                    │   │
│  ◀── Spotlight ──│────────────────────────────────────│───┘
│                   │          LIVE PREVIEW              │
│  Name: [      ]   │                                    │
│  Image: [thumb]   │   ┌──────────────────────────┐    │
│  Birthplace: [ ]  │   │  Rendered preview of     │    │
│  Med School: [ ]  │   │  entire issue using      │    │
│  Fun Fact: [   ]  │   │  same components as      │    │
│  ...              │   │  public site             │    │
│  (scrollable)     │   │                          │    │
│                   │   └──────────────────────────┘    │
└───────────────────┴────────────────────────────────────┘
```

**Preview Requirements:**
- Uses **same components** as public site (imported from shared package)
- Updates in real-time as editor types (debounced)
- Scrollable independently of editor
- Responsive preview toggle (desktop/tablet/mobile widths)

### Property Panel: Single Scrollable Column

**Decision:** All fields for selected section in one scrollable column - no tabs, no collapsible groups.

**Rationale:**
- Simplest implementation
- 1-2 editors don't need complex organization
- Most sections have manageable field counts (8-10 max)
- Can always add complexity later if needed

### Drag-and-Drop Behavior

**Drop Behavior:** Direct positional drop
- Drop indicator shows between existing sections
- Section drops exactly where indicator shows
- More intuitive than append-then-reorder

**Drag Target:** Drag handle only
- Small grip icon (≡) on each section card
- Prevents accidental drags when clicking to edit section
- Click anywhere else on card selects for property editing

### New Section Default Content: Example Content

**Decision:** New sections come pre-filled with realistic example data for that section type.

**Rationale:**
- Shows editors what fields exist and expected format
- Demonstrates final appearance in preview
- Better than empty fields (unclear what's needed) or lorem ipsum (not instructive)

**Implementation:** Each section type in registry has `exampleData` factory:

```typescript
export const SECTION_REGISTRY = {
  spotlight: {
    label: "Resident Spotlight",
    icon: "user",
    exampleData: () => ({
      name: "Dr. Jane Smith",
      image: null,
      birthplace: "Atlanta, Georgia",
      medicalSchool: "Emory University School of Medicine",
      funFact: "I've visited all 50 states!",
      favoriteDish: "Southern-style shrimp and grits",
      interests: "Hiking, photography, and cooking",
      postResidencyPlans: "Pursuing fellowship in cardiology",
    }),
    fields: [/* field definitions */],
  },
  // ... all section types
};
```

### Undo/Redo: Full Stack, Session Only

**Decision:** Full undo/redo stack for all operations, but clears on page refresh.

**Operations Tracked:**
- Add section
- Delete section
- Reorder sections
- Edit section data
- Toggle visibility

**Implementation:**
- In-memory undo stack (array of operations)
- Each operation stores inverse operation for redo
- Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z (Cmd on Mac)
- Toolbar buttons for undo/redo with tooltips
- Stack clears on page refresh (no localStorage persistence)

### Unsaved Changes Warning: Browser beforeunload

**Decision:** Use standard browser beforeunload dialog.

**Note:** With 2-3s debounced autosave, truly unsaved work is rare. The warning is a safety net, not the primary data protection mechanism.

### Error Handling: Toast Notifications

**Decision:** Show toast notification on Convex mutation failures.

**Toast Behavior:**
- Appears in corner (bottom-right recommended)
- Shows error message from Convex
- Auto-dismisses after 5 seconds
- Includes "Retry" action button
- Form data preserved - user can fix and retry

---

## Data & Content Behavior

### Dynamic Data (Birthdays): Always Live

**Decision:** Birthday sections always show current data from birthdays table - not snapshotted.

**Behavior:**
- Section stores only `{ month: number }` or empty (current month)
- At render time, queries birthdays table filtered by month
- No editorial control over which birthdays appear
- Changes to birthdays table immediately reflected

### Publish Validation: Minimal

**Decision:** Only require that issue has at least one visible section and banner is filled.

**Validation Rules:**
1. Banner title is not empty
2. Banner date is not empty
3. At least one section exists with `visible: true`

**Not Required:**
- Specific section types (no mandatory spotlight, etc.)
- Complete data in all section fields
- Images in image-required sections

**Rationale:** Trust editors. Low friction to publish. Editors can see preview before publishing.

### Section Types: All 16+ Available

**Decision:** Migrate all existing section types to the new CMS.

**Complete Section Type List:**
1. `about`
2. `spotlight`
3. `chiefsCorner`
4. `internsCorner`
5. `textImage`
6. `carousel`
7. `textCarousel`
8. `events`
9. `podcast`
10. `birthdays`
11. `culturosity`
12. `communityService`
13. `recentSuccess`
14. `musings`
15. `photosOfMonth`
16. `genericText`
17. `custom`

Each type requires:
- TypeScript interface
- Convex validator
- Section renderer component
- Property panel field configuration
- Example data factory
- Icon for palette

### Rich Text: Tiptap (Free MIT Core) with Strict Sanitization

**Decision:** Use Tiptap's free, MIT-licensed core. Strip all raw HTML from output.

**Why Tiptap Free Tier Works:**
- Core editor is fully MIT licensed and free forever
- All features we need (bold, italic, lists, links, tables, images) are in free core
- Paid "Tiptap Cloud" is only for real-time collaboration (we use locking instead)
- No feature limitations that would require upgrading

**Allowed Elements:**
- Paragraphs, headings (h1-h4)
- Bold, italic, underline, strikethrough
- Links (with rel="noopener noreferrer" forced)
- Ordered and unordered lists
- Blockquotes
- Tables (editor-generated only)
- Images (must be from media library)

**Blocked:**
- Script tags
- Iframes
- Custom HTML
- Style attributes
- Event handlers

**Implementation:** Use DOMPurify on server-side before storage.

### Archive Status: Manual Only

**Decision:** Admin manually archives issues. No auto-archival.

**Archive Behavior:**
- Archived issues remain publicly visible
- Archived issues cannot be edited (read-only)
- Archived issues don't appear in "active" admin lists
- Can be un-archived by admin

### Section Visibility: Requires Republish

**Decision:** Toggling section visibility saves to draft but requires explicit publish to affect public site.

**Flow:**
1. Editor toggles section visibility in editor
2. Change auto-saves (debounced)
3. Preview shows the change
4. Public site unchanged until "Publish" clicked
5. Publish triggers Netlify rebuild

---

## Authentication & Authorization

### Auth Provider: Convex Auth

**Decision:** Use Convex's native authentication with email/password.

**Features:**
- Email/password authentication
- Magic link option (future enhancement)
- Session management handled by Convex
- No additional cost
- Simple integration

### Role Definitions

| Role | Content Permissions | System Permissions |
|------|--------------------|--------------------|
| **Viewer** | Read all issues, view preview | None |
| **Editor** | Full CRUD on all content (issues, sections) | None |
| **Admin** | Full CRUD on all content | User management, settings, audit log access, birthday management, force-release locks, archive/unarchive issues |

**Key Distinction:** Editors have full content control. Admins additionally manage the system itself.

### Audit Log Access: Admin Only

**Decision:** Only admins can view the audit log.

**Rationale:** Keeps editor UX clean. Audit log is for compliance/debugging, not day-to-day editing.

### Birthday Management: Admin Only

**Decision:** Only admins can add/edit/delete birthday entries.

**Location:** Settings > Birthdays in admin panel

---

## Technical Architecture

### Monorepo Structure

```
azalea-report/
├── apps/
│   ├── web/                          # Public website (azaleareport.com)
│   └── admin/                        # CMS admin (admin.azaleareport.com)
├── packages/
│   ├── shared/                       # Types, constants, utilities
│   ├── ui/                           # Shared React components
│   └── sections/                     # Section renderer components (used by both apps)
├── convex/                           # Convex backend (root level)
│   ├── schema.ts
│   ├── validators/
│   ├── issues.ts
│   ├── sections.ts
│   ├── media.ts
│   ├── users.ts
│   ├── locks.ts
│   └── auth.ts
├── scripts/
│   └── migrate-content.ts
├── turbo.json
└── package.json
```

**Key Decision:** Root-level `convex/` directory shared by both apps. Simpler than a separate package.

### Shared Components (Preview Fidelity)

**Decision:** Preview uses same components as public site.

**Implementation:** `packages/sections/` contains all section renderer components:
- Imported by `apps/web` for public rendering
- Imported by `apps/admin` for preview rendering
- Guarantees WYSIWYG fidelity

```typescript
// packages/sections/index.ts
export { AboutSection } from "./AboutSection";
export { SpotlightSection } from "./SpotlightSection";
export { CarouselSection } from "./CarouselSection";
// ... all section components

export { SectionRenderer } from "./SectionRenderer";
```

### Styling: Full Tailwind Migration

**Decision:** Migrate all 33 CSS Module files to Tailwind CSS.

**Migration Strategy:**
1. Install and configure Tailwind in both apps
2. Create shared Tailwind config in `packages/ui`
3. Migrate components incrementally during implementation
4. Delete CSS Module files as components are migrated

**Shared Config:**
```javascript
// packages/ui/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Azalea brand colors
      },
      fontFamily: {
        // Custom fonts
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

---

## Operations & Deployment

### Publishing: Fire and Forget

**Decision:** Click "Publish", show brief confirmation, trust the webhook.

**Flow:**
1. Editor clicks "Publish"
2. Convex mutation updates issue status to "published"
3. Convex sends webhook to Netlify build hook
4. UI shows "Published!" toast immediately
5. No tracking of Netlify build status

**Rationale:**
- Simpler implementation
- Builds are reliable (Netlify)
- 1-2 editors don't need complex status tracking
- If build fails, Netlify sends email notification

### Data Freshness: Pure SSG with Webhook Rebuild

**Decision:** Full static site generation, rebuild triggered by publish webhook.

**Implementation:**
1. `apps/web` builds as static site
2. All pages pre-rendered at build time
3. Convex webhook hits Netlify build hook on publish
4. New build deploys in 1-2 minutes
5. No ISR, no client-side fetching for content

**Archive Pages:** Statically generated at build time. Adding webhook trigger when any issue is published/archived.

### Migration: Hard Cutover

**Decision:** Once new CMS is ready, immediately deprecate old markdown system.

**Cutover Plan:**
1. Complete all migration and testing
2. Train editors on new system
3. Final content sync from markdown to Convex
4. Switch DNS to new system
5. Archive (don't delete) old repo

**No Parallel Operation:** Clean break reduces confusion and maintenance burden.

### Dashboard: Content-Focused Only

**Decision:** Dashboard shows content management features only. No analytics.

**Dashboard Components:**
- Recent issues (drafts and published)
- Quick actions (New Issue, Media Library)
- Activity feed (recent edits by all users)
- System status (Convex connection)

---

## Section Type Registry

Complete registry definition for the section palette and property panel:

```typescript
// packages/shared/constants/sectionRegistry.ts

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'images' | 'date' | 'select' | 'number';
  required: boolean;
  options?: { value: string; label: string }[]; // for select type
  placeholder?: string;
}

export interface SectionDefinition {
  type: string;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  fields: FieldDefinition[];
  exampleData: () => Record<string, unknown>;
}

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  about: {
    type: 'about',
    label: 'About Section',
    description: 'Introduction or about content with rich text',
    icon: 'info',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'About' },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'About This Edition',
      content: '<p>Welcome to this month\'s edition of the Azalea Report...</p>',
    }),
  },

  spotlight: {
    type: 'spotlight',
    label: 'Resident Spotlight',
    description: 'Feature a resident with photo and details',
    icon: 'user',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Resident Spotlight' },
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Dr. Jane Smith' },
      { name: 'image', label: 'Photo', type: 'image', required: false },
      { name: 'birthplace', label: 'Birthplace', type: 'text', required: false },
      { name: 'medicalSchool', label: 'Medical School', type: 'text', required: false },
      { name: 'funFact', label: 'Fun Fact', type: 'textarea', required: false },
      { name: 'favoriteDish', label: 'Favorite Dish', type: 'text', required: false },
      { name: 'interests', label: 'Interests', type: 'textarea', required: false },
      { name: 'postResidencyPlans', label: 'Post-Residency Plans', type: 'textarea', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Resident Spotlight',
      name: 'Dr. Jane Smith',
      birthplace: 'Atlanta, Georgia',
      medicalSchool: 'Emory University School of Medicine',
      funFact: 'I\'ve visited all 50 states!',
      favoriteDish: 'Southern-style shrimp and grits',
      interests: 'Hiking, photography, and cooking',
      postResidencyPlans: 'Pursuing fellowship in cardiology',
    }),
  },

  carousel: {
    type: 'carousel',
    label: 'Image Carousel',
    description: 'Slideshow of multiple images',
    icon: 'images',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false },
      { name: 'title', label: 'Carousel Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'images', label: 'Images', type: 'images', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Photo Gallery',
      title: 'Department Events',
      description: 'Highlights from this month\'s activities',
      images: [],
    }),
  },

  // ... Define all 17 section types with full field definitions
};
```

### Carousel Limit: None

**Decision:** No limit on number of images in a carousel.

**Rationale:** Trust editors. If performance becomes an issue, address reactively.

---

## Migration Plan

### Phase 1: Infrastructure Setup
1. Create Turborepo monorepo structure
2. Configure Convex project with schema
3. Set up Convex Auth
4. Configure Tailwind CSS
5. Deploy empty apps to Netlify

### Phase 2: Core Backend
1. Implement all Convex validators
2. Build issues CRUD operations
3. Build sections CRUD operations
4. Implement media upload/management
5. Build locking mechanism
6. Set up audit logging

### Phase 3: Admin Panel - Editor
1. Build DragDropCanvas with @dnd-kit
2. Implement SectionPalette
3. Build PropertyPanel with all field types
4. Integrate Tiptap rich text editor
5. Implement inline preview
6. Build undo/redo system
7. Implement autosave with debouncing

### Phase 4: Admin Panel - Supporting Features
1. Build media library with search
2. Implement image picker (inline + modal)
3. Build user management (admin only)
4. Build birthday management (admin only)
5. Build dashboard
6. Implement lock status UI

### Phase 5: Public Website
1. Build shared section components in `packages/sections`
2. Implement SectionRenderer
3. Build homepage (latest issue)
4. Build archive listing (paginated)
5. Build individual archive pages
6. Configure SSG with Convex

### Phase 6: Migration & Launch
1. Write content migration script
2. Upload all images to Convex storage
3. Migrate all markdown content
4. Test thoroughly
5. Train editors
6. Execute hard cutover
7. Monitor and fix issues

---

## Implementation Phases

### MVP (Phases 1-3)
- Basic editing with drag-and-drop
- Preview functionality
- Core section types (5-6 most used)
- Single user (no auth complexity)

### V1.0 (Phases 4-5)
- All section types
- Multi-user with locking
- Full media library
- Public site complete

### V1.1 (Phase 6 + Polish)
- Migration complete
- Production launch
- Bug fixes and refinements

---

## Appendix: Key Technical Decisions Summary

| Decision Area | Choice | Rationale |
|--------------|--------|-----------|
| Type validation | Strict per-section | Catch errors early, better DX |
| Concurrency | Lock-based, session lifecycle | Simple for 1-2 users |
| Media deletion | Block if referenced | Prevent broken links |
| Autosave | Debounced 2-3s | Responsive, low friction |
| Preview | Inline split-screen, same components | WYSIWYG guarantee |
| Styling | Full Tailwind migration | Unified, modern |
| Drag-drop | Direct positional, handle only | Intuitive, prevents accidents |
| New sections | Pre-filled example content | Better guidance |
| Undo/redo | Full stack, session only | Good UX, simple implementation |
| Dynamic data (birthdays) | Always live | Automatic, no maintenance |
| Publish validation | Minimal | Trust editors |
| Rich text | Tiptap (free MIT core), strict sanitization | Mature + secure + $0 |
| Archive | Manual, read-only | Full control |
| Visibility | Requires republish | Predictable |
| Auth | Convex Auth | Native, simple, free |
| Roles | Editor=content, Admin=system | Clear separation |
| Audit access | Admin only | Clean editor UX |
| Convex structure | Root-level | Simple sharing |
| Data freshness | Pure SSG + webhook | Simple, reliable |
| Deploy status | Fire and forget | Trust the pipeline |
| Migration | Hard cutover | Clean break |
| Dashboard | Content only | Tight scope |
| Image picker | Inline grid + modal | Quick access |
| Errors | Toast notifications | Non-disruptive |
| Property panel | Single scrollable | Simple |
| Admin deploy | Separate subdomain | Clean separation |
| Section duplication | Reference same media | No storage waste |
| Team size | 1-2 editors | Informs simplicity choices |
| **Cost strategy** | **Free tier only ($0/mo)** | **Primary constraint** |

---

*This specification is the authoritative reference for implementation. Any deviations should be discussed and this document updated accordingly.*

# Azalea Report CMS

![SGMC Health's new health tower](./readme-sgmc.jpeg)

Modern content management system for the SGMC Internal Medicine Residency Program newsletter, built with Next.js, Convex, and Turborepo.

The Azalea Report is a digital newsletter designed to showcase the achievements, events, and community of the SGMC Health Internal Medicine Residency program. This CMS provides a visual editor for creating and managing newsletter issues with drag-and-drop functionality.

## 🏗️ Architecture

This is a monorepo containing:

- **apps/web** - Public website (azaleareport.com)
- **apps/admin** - CMS admin panel (admin.azaleareport.com)
- **packages/shared** - Shared types and constants
- **packages/ui** - Shared React components
- **packages/sections** - Section renderer components
- **convex/** - Backend (database, serverless functions)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Initialize Convex:**

```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate TypeScript types from your schema
- Start the Convex development server
- Give you a `NEXT_PUBLIC_CONVEX_URL`

3. **Set up environment variables:**

Copy the example files and add your Convex URL:

```bash
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

Edit each `.env.local` file and add your `NEXT_PUBLIC_CONVEX_URL`

4. **Start development servers:**

```bash
# Start all apps
npm run dev

# Or start individual apps
npm run dev:web    # Public website on :3000
npm run dev:admin  # Admin panel on :3001
```

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Monorepo | Turborepo | Fast builds, shared packages |
| Frontend | Next.js 14 (App Router) | SSG, ISR, modern React |
| Backend | Convex | Real-time, type-safe, serverless |
| Drag & Drop | @dnd-kit | Accessible drag-and-drop |
| Rich Text | Tiptap | Prosemirror-based editor |
| Styling | Tailwind CSS | Utility-first CSS |
| Hosting | Netlify | Static hosting |
| Storage | Convex Storage | File storage |

**Total Cost: $0/month** (using free tiers)

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start all apps in dev mode
npm run dev:web          # Start web app only
npm run dev:admin        # Start admin app only

# Convex (local)
npm run convex:dev       # Start Convex dev server (local)
npm run convex:deploy    # Deploy functions to production

# Building
npm run build            # Build all apps
npm run build:web        # Build web app
npm run build:admin      # Build admin app

# Type checking
npm run type-check       # Check types in all packages
```

## 🚢 Deploying to Production

The project uses two deployment targets:
- **Convex** (`resolute-emu-262.convex.cloud`) — backend functions, database, and file storage
- **Netlify** (`azalea-staging-web.netlify.app`) — frontend, deployed from the `staging` branch

### Deploy Scripts (requires [Bun](https://bun.sh))

```bash
# Full deploy: functions + data + file storage (images)
bun run deploy:prod

# Deploy only Convex functions (schema, queries, mutations)
bun run deploy:prod:functions

# Export local database and import to production (no files)
bun run deploy:prod:data

# Migrate file storage (images) from local to production
bun run migrate:storage
```

### What Each Script Does

| Command | What it does |
|---------|-------------|
| `deploy:prod` | Runs all three steps below in order |
| `deploy:prod:functions` | Pushes Convex functions (schema, queries, mutations) to production via `npx convex deploy` |
| `deploy:prod:data` | Exports a snapshot of the local Convex database and imports it into production (replaces all data) |
| `migrate:storage` | Downloads every file from local Convex storage, uploads to production storage, and updates media records with new storage IDs |

### Step-by-Step Deploy Workflow

1. **Make sure the local Convex dev server is running:**
   ```bash
   npx convex dev
   ```

2. **Run the full deploy:**
   ```bash
   bun run deploy:prod
   ```

3. **Trigger a rebuild on Netlify:**
   - Go to Netlify dashboard → `azalea-staging-web` → Deploys
   - Click **Trigger deploy** → **Clear cache and deploy site**

> **Note:** The database snapshot export/import transfers document data but NOT file storage. That's why `deploy:prod` also runs the storage migration, which re-uploads all images to the production Convex deployment.

### Environment Variables

These must be set on **Netlify** (Site settings → Environment variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | `https://resolute-emu-262.convex.cloud` |
| `CONVEX_DEPLOYMENT` | Your production deployment name (for `npx convex codegen` during builds) |

Local `.env.local` files point to `http://127.0.0.1:3210` for development and are not deployed.

## 📁 Project Structure

```
azalea-report/
├── apps/
│   ├── web/                    # Public website
│   │   ├── app/                # Next.js App Router
│   │   ├── components/         # Web-specific components
│   │   └── convex/             # Convex client setup
│   └── admin/                  # CMS admin panel
│       ├── app/                # Next.js App Router
│       ├── components/         # Admin-specific components
│       └── convex/             # Convex client setup
├── packages/
│   ├── shared/                 # Shared types & constants
│   │   ├── types/              # TypeScript interfaces
│   │   └── constants/          # Section registry, configs
│   ├── ui/                     # Shared UI components
│   │   ├── components/         # Button, Input, Card, etc.
│   │   └── tailwind.config.js  # Shared Tailwind config
│   └── sections/               # Section renderer components
│       └── (section components to be migrated)
├── convex/                     # Backend
│   ├── schema.ts               # Database schema
│   ├── validators/             # Data validators
│   ├── issues.ts               # Issues CRUD
│   ├── sections.ts             # Sections CRUD
│   ├── media.ts                # Media management
│   ├── locks.ts                # Editing locks
│   └── birthdays.ts            # Birthday management
├── scripts/                    # Deployment & migration scripts
│   ├── deploy-to-prod.ts       # Full deploy (functions + data + storage)
│   ├── migrate-storage.ts      # Migrate file storage to production
│   ├── migrate-all.ts          # Content migration from markdown
│   └── seed-birthdays.ts       # Seed birthday data
├── turbo.json                  # Turborepo config
└── package.json                # Root package config
```

## 🎨 Key Features

### Admin Panel
- **Drag-and-drop editor** - Visual section arrangement
- **17 section types** - Spotlight, carousel, events, podcasts, etc.
- **Live preview** - See changes in real-time
- **Media library** - Upload and manage images
- **Pessimistic locking** - Prevents editing conflicts
- **Autosave** - 2-3 second debounced saves
- **Undo/redo** - Full operation history

### Public Website
- **Static generation** - Fast loading times
- **Responsive design** - Mobile-first approach
- **Archive pages** - Browse past issues
- **Dynamic birthdays** - Auto-updated from database

## 🗄️ Database Schema

Main tables:
- **issues** - Newsletter issues
- **sections** - Content blocks within issues
- **media** - Uploaded files
- **users** - Admin/editor accounts
- **locks** - Editing session locks
- **birthdays** - Resident birthdays
- **auditLog** - Change tracking

## 📋 Implementation Progress

See `progress.txt` for detailed implementation status.

**Current Status:**
- ✅ Phase 1: Infrastructure Setup - COMPLETE
- ✅ Phase 2: Core Backend - COMPLETE
- ✅ Phase 3: Admin Panel Editor - COMPLETE
- ✅ Phase 4: Admin Supporting Features - COMPLETE
- ✅ Phase 5: Public Website - COMPLETE
- 🚧 Phase 6: Migration & Launch - IN PROGRESS

**What's Working:**
- Full admin CMS with drag-and-drop editor
- Media library with upload/management
- Birthday management
- Issue creation and publishing
- Public website with homepage and archives
- Responsive design on all devices
- Autosave and undo/redo
- Real-time Convex integration

## 🤝 Contributing

This is an internal project for SGMC Internal Medicine Residency Program.

## 📄 License

ISC

## 🚀 Deployment

See the [Deploying to Production](#-deploying-to-production) section above for the deploy workflow, or [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for additional details.

**Quick deployment:**
```bash
npx convex dev          # 1. Start local dev server
bun run deploy:prod     # 2. Deploy functions + data + images
                        # 3. Clear cache and redeploy on Netlify
```

## 🔧 Troubleshooting

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for common issues and solutions.

## 🔗 Links

- [Specification Document](./SPECIFICATION.md)
- [Progress Tracker](./progress.txt)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [Convex Docs](https://docs.convex.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)

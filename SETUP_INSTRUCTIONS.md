# Setup Instructions

## Current Status

✅ **Installed**: All npm dependencies installed
⏳ **Convex**: Needs manual setup (requires browser login)
✅ **Next.js**: Apps configured and ready to run

## To Complete Setup:

### 1. Initialize Convex (Required for backend features)

Convex requires interactive login in a browser. Run this command:

```bash
npx convex dev
```

This will:
1. Open your browser for authentication
2. Create a new Convex project (or link to existing)
3. Generate your `NEXT_PUBLIC_CONVEX_URL`
4. Generate TypeScript types in `convex/_generated/`

### 2. Update Environment Variables

After Convex initialization, update these files with your real Convex URL:
- `.env.local`
- `apps/web/.env.local`
- `apps/admin/.env.local`

Replace `https://placeholder.convex.cloud` with your actual URL.

### 3. Start Development Servers

Once Convex is set up, run:

```bash
# Terminal 1: Keep Convex running
npx convex dev

# Terminal 2: Start Next.js apps
npm run dev
```

Or start individual apps:
```bash
npm run dev:web     # Public site on :3000
npm run dev:admin   # Admin panel on :3001
```

## Testing Without Convex (UI Only)

You can view the UI layout without Convex:

```bash
npm run dev:admin
```

Visit: http://localhost:3001

**Note**: Most features won't work until Convex is connected:
- ❌ Issue loading/saving
- ❌ Section CRUD
- ❌ Media upload
- ✅ UI components visible
- ✅ Layout and design visible

## Project Structure

```
azalea-report/
├── apps/
│   ├── web/          → Public website (:3000)
│   └── admin/        → CMS admin (:3001)
├── packages/
│   ├── shared/       → Types & constants
│   ├── ui/           → UI components
│   └── sections/     → Section renderers
└── convex/           → Backend functions
```

## Troubleshooting

### "Cannot find module '@azalea/...'"
```bash
npm install
```

### "Convex URL not configured"
Update `.env.local` files with your Convex URL from `npx convex dev`

### Port already in use
Change ports in package.json scripts:
- Web: `-p 3000` → `-p 3002`
- Admin: `-p 3001` → `-p 3003`

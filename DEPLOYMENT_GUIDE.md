# Azalea Report - Deployment Guide

This guide covers deploying the Azalea Report CMS to production.

## Prerequisites

- [x] Netlify account (free tier)
- [x] Convex account (free tier)
- [x] GitHub repository
- [x] Domain configured (optional)

## Step 1: Deploy Convex Backend

### 1.1 Initialize Production Deployment

```bash
cd /Users/samueledusa/Desktop/code/my-projects/azalear-report
npx convex deploy
```

This will:
- Create a production Convex deployment
- Generate a production `NEXT_PUBLIC_CONVEX_URL`
- Deploy all functions and schema

### 1.2 Save Production URL

Copy the production URL from the output:
```
✓ Deployment complete!
  Production URL: https://your-deployment.convex.cloud
```

You'll need this for Netlify environment variables.

## Step 2: Deploy Admin Panel to Netlify

### 2.1 Create New Site

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git repository
4. Use these build settings:

**Build Settings:**
- Base directory: `apps/admin`
- Build command: `cd ../.. && npm run build:admin`
- Publish directory: `apps/admin/.next`

**Environment Variables:**
- `NEXT_PUBLIC_CONVEX_URL` = your production Convex URL from Step 1.2
- `NODE_VERSION` = `20`

### 2.2 Configure Domain (Optional)

1. Go to "Domain settings"
2. Add custom domain: `admin.azaleareport.com`
3. Configure DNS records as instructed

### 2.3 Enable Deploy Notifications

1. Go to "Site settings" → "Build & deploy" → "Deploy notifications"
2. Add notification for "Deploy failed" to catch issues

## Step 3: Deploy Public Website to Netlify

### 3.1 Create Second Site

1. Create another new site in Netlify
2. Connect to the same Git repository
3. Use these build settings:

**Build Settings:**
- Base directory: `apps/web`
- Build command: `cd ../.. && npm run build:web`
- Publish directory: `apps/web/.next`

**Environment Variables:**
- `NEXT_PUBLIC_CONVEX_URL` = same production Convex URL
- `NODE_VERSION` = `20`

### 3.2 Configure Domain

1. Add custom domain: `azaleareport.com` or `www.azaleareport.com`
2. Enable HTTPS (automatic with Netlify)

## Step 4: Initialize Users in Convex

Since authentication isn't fully implemented, you need to manually create admin users:

### 4.1 Open Convex Dashboard

```bash
npx convex dashboard
```

### 4.2 Create Admin User

In the Convex dashboard:
1. Go to "Data" → "users" table
2. Click "Add Document"
3. Add:
```json
{
  "email": "admin@sgmc.org",
  "name": "Admin User",
  "role": "admin"
}
```
4. Note the generated `_id` - you'll use this as your userId

### 4.3 Update Temporary User IDs

In your admin panel code, replace all instances of `'temp-user-id' as Id<'users'>` with your actual admin user ID.

Files to update:
- `apps/admin/app/issues/[id]/IssueEditor.tsx`
- `apps/admin/app/issues/page.tsx`
- `apps/admin/app/birthdays/page.tsx`
- `apps/admin/components/MediaLibrary.tsx`

## Step 5: Test Production Deployment

### 5.1 Test Admin Panel

1. Visit your admin domain (e.g., `admin.azaleareport.com`)
2. Create a test issue
3. Add sections
4. Upload a test image
5. Publish the issue

### 5.2 Test Public Website

1. Visit your public domain (e.g., `azaleareport.com`)
2. Verify latest issue appears on homepage
3. Check archives page
4. Navigate to individual issue

## Step 6: Content Migration

### Manual Migration Approach

Since you have 6 existing issues in markdown format, you'll need to migrate them manually:

1. **Create issue in admin panel**
   - Set title and edition number
   - Set banner details

2. **Add sections**
   - Use section palette to add each section type
   - Copy content from markdown files
   - Upload images as needed

3. **Test preview**
   - Use responsive preview to check layout
   - Verify all content renders correctly

4. **Publish**
   - Click publish when ready
   - Verify on public site

### Migration Priority

Migrate issues in this order:
1. Latest issue first (issue-6.md)
2. Then work backwards

This allows you to have recent content live quickly.

## Step 7: Image Migration

### 7.1 Upload Images

For the 286 images in `/public/img/`:

1. Go to admin panel → Media Library
2. Upload images in batches
3. Organize by issue/category if helpful

### 7.2 Update Image References

When adding sections, use the image picker to select uploaded images.

## Step 8: Production Checklist

Before going live:

- [ ] Convex production deployment created
- [ ] Admin panel deployed to Netlify
- [ ] Public website deployed to Netlify
- [ ] Custom domains configured
- [ ] HTTPS enabled
- [ ] Admin user created in Convex
- [ ] Test issue created and published
- [ ] Latest issue migrated
- [ ] Images uploaded
- [ ] About page content updated
- [ ] All links tested
- [ ] Mobile responsive tested
- [ ] Performance checked

## Ongoing Maintenance

### Content Updates

1. Log into admin panel
2. Create new issue or edit existing
3. Publish when ready
4. Site updates automatically (client-side rendering)

### Monitoring

- Check Convex dashboard for usage (stay within free tier)
- Monitor Netlify build minutes
- Review deploy logs for errors

### Backups

Convex provides automatic backups. To export:
1. Go to Convex dashboard
2. Navigate to "Data" → "Export"
3. Download JSON backup

## Troubleshooting

### Build Fails

Check Netlify deploy logs for:
- TypeScript errors
- Missing environment variables
- Package installation issues

### Images Not Loading

Verify:
- Images uploaded to Convex Storage
- Correct media IDs used in sections
- `NEXT_PUBLIC_CONVEX_URL` set correctly

### Sections Not Rendering

Check:
- Section type is implemented in SectionRenderer
- Section data matches expected shape
- Section is marked as visible

## Cost Monitoring

**Free Tier Limits:**
- Convex: 1M function calls/month, 1GB storage
- Netlify: 100GB bandwidth/month, 300 build minutes/month

**To Monitor:**
- Convex Dashboard → Usage
- Netlify Dashboard → Bandwidth usage

## Support Resources

- Convex Docs: https://docs.convex.dev
- Netlify Docs: https://docs.netlify.com
- Next.js Docs: https://nextjs.org/docs
- Project Progress: See `progress.txt`

## Next Steps

After deployment:
1. Test all functionality thoroughly
2. Gather feedback from editors
3. Implement remaining section types as needed
4. Consider adding user authentication
5. Optimize for SEO if needed

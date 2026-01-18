/**
 * Cleanup script to remove duplicate issues and sections
 * Keeps only the most recent migration
 * Run with: npx tsx scripts/cleanup-duplicates.ts
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'http://127.0.0.1:3210';
const client = new ConvexHttpClient(CONVEX_URL);

const ADMIN_USER_ID = 'k17eswp9hr1efhk7j1kkr4d5697zf4hd' as Id<'users'>;

// IDs of issues to KEEP (from the most recent migration - latest creation time)
const ISSUES_TO_KEEP = [
  'jd73xwg26cwsfvmy07hnbfgm657ze95h', // Edition 6
  'jd7930sw2sa3b019mm6zegj7jn7zf1jp', // Edition 5
  'jd779621ck9f0exewy338ywmsn7ze05f', // Edition 4
  'jd747h3rds34xpmrfdfjjev1gh7zef87', // Edition 3
  'jd713fm3j28rgw47jccd4xwqds7ze4nd', // Edition 2
  'jd78xrdd47y69evfbbnsqt719s7zfsbh', // Edition 1
];

async function cleanup() {
  console.log('🧹 Starting cleanup of duplicate issues and sections...\n');

  // Get all issues
  const allIssues = await client.query(api.issues.list, {});
  console.log(`Found ${allIssues.length} total issues`);

  // Find issues to delete (not in keep list)
  const issuesToDelete = allIssues.filter(
    (issue) => !ISSUES_TO_KEEP.includes(issue._id as string)
  );

  console.log(`Will delete ${issuesToDelete.length} duplicate issues\n`);

  for (const issue of issuesToDelete) {
    console.log(`Deleting: Edition ${issue.edition} - ${issue._id}`);

    try {
      // Get sections for this issue
      const sections = await client.query(api.sections.listByIssue, {
        issueId: issue._id,
      });

      // Delete all sections
      for (const section of sections) {
        await client.mutation(api.sections.remove, {
          id: section._id,
          userId: ADMIN_USER_ID,
        });
      }
      console.log(`  Deleted ${sections.length} sections`);

      // Change issue to draft first (required before deletion)
      if (issue.status === 'published') {
        await client.mutation(api.issues.unpublish, {
          id: issue._id,
          userId: ADMIN_USER_ID,
        });
      }

      // Delete the issue
      await client.mutation(api.issues.remove, {
        id: issue._id,
        userId: ADMIN_USER_ID,
      });
      console.log(`  ✓ Issue deleted`);
    } catch (error) {
      console.error(`  ✗ Error deleting issue:`, error);
    }
  }

  console.log('\n✅ Cleanup complete!');

  // Show remaining issues
  const remaining = await client.query(api.issues.list, {});
  console.log(`\nRemaining issues: ${remaining.length}`);
  for (const issue of remaining) {
    console.log(`  - Edition ${issue.edition}: ${issue.title} (${issue.status})`);
  }
}

cleanup().catch(console.error);

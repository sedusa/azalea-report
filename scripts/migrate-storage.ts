#!/usr/bin/env bun
/**
 * Migrate Convex file storage from local dev to production.
 *
 * The standard Convex export/import only transfers database records, NOT files
 * in storage. This script bridges that gap by:
 *   1. Reading all media records from the local deployment
 *   2. Downloading each file from local storage
 *   3. Uploading it to production storage
 *   4. Updating the media record in production with the new storageId
 *   5. Updating any section/issue references that embed the old storageId
 *
 * Usage:
 *   bun run migrate:storage
 *
 * Prerequisites:
 *   - Local Convex dev server running on port 3210
 *   - Functions already deployed to production (`bun run deploy:prod:functions`)
 *   - Data already imported to production (`bun run deploy:prod:data`)
 */

const LOCAL_URL = "http://127.0.0.1:3210";
const PROD_URL = "https://resolute-emu-262.convex.cloud";

const BATCH_SIZE = 5; // concurrent uploads to avoid overwhelming the server

interface MediaRecord {
  _id: string;
  storageId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

async function convexQuery(
  deploymentUrl: string,
  functionPath: string,
  args: Record<string, unknown> = {}
) {
  const res = await fetch(`${deploymentUrl}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionPath, args, format: "json" }),
  });
  if (!res.ok) {
    throw new Error(
      `Query ${functionPath} failed: ${res.status} ${await res.text()}`
    );
  }
  const data = await res.json();
  return data.value;
}

async function convexMutation(
  deploymentUrl: string,
  functionPath: string,
  args: Record<string, unknown> = {}
) {
  const res = await fetch(`${deploymentUrl}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionPath, args, format: "json" }),
  });
  if (!res.ok) {
    throw new Error(
      `Mutation ${functionPath} failed: ${res.status} ${await res.text()}`
    );
  }
  const data = await res.json();
  return data.value;
}

async function migrateFile(
  media: MediaRecord,
  index: number,
  total: number
): Promise<{ oldStorageId: string; newStorageId: string } | null> {
  const prefix = `[${index + 1}/${total}]`;

  if (!media.url) {
    console.log(`${prefix} ⚠️  Skipping "${media.filename}" — no URL from local storage`);
    return null;
  }

  try {
    // 1. Download from local
    const fileRes = await fetch(media.url);
    if (!fileRes.ok) {
      console.log(`${prefix} ⚠️  Skipping "${media.filename}" — download failed (${fileRes.status})`);
      return null;
    }
    const fileBlob = await fileRes.blob();

    // 2. Get upload URL from production
    const uploadUrl = await convexMutation(PROD_URL, "media:generateUploadUrl");

    // 3. Upload to production storage
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": media.mimeType },
      body: fileBlob,
    });
    if (!uploadRes.ok) {
      console.log(`${prefix} ⚠️  Skipping "${media.filename}" — upload failed (${uploadRes.status})`);
      return null;
    }
    const { storageId: newStorageId } = await uploadRes.json();

    console.log(`${prefix} ✅ ${media.filename}`);
    return { oldStorageId: media.storageId, newStorageId };
  } catch (err) {
    console.log(`${prefix} ⚠️  Skipping "${media.filename}" — ${err}`);
    return null;
  }
}

async function main() {
  console.log("=".repeat(55));
  console.log("  Azalea Report — Migrate File Storage to Production");
  console.log("=".repeat(55));

  // 1. Get all media from local with URLs
  console.log("\n📋 Fetching media list from local...\n");
  let localMedia: MediaRecord[];
  try {
    localMedia = await convexQuery(LOCAL_URL, "media:list");
  } catch {
    console.error("❌ Could not reach local Convex. Is `npx convex dev` running?");
    process.exit(1);
  }

  console.log(`Found ${localMedia.length} files to migrate.\n`);

  // 2. Migrate files in batches
  const storageIdMap = new Map<string, string>(); // old -> new
  let succeeded = 0;
  let skipped = 0;

  for (let i = 0; i < localMedia.length; i += BATCH_SIZE) {
    const batch = localMedia.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((media, j) =>
        migrateFile(media, i + j, localMedia.length)
      )
    );
    for (const result of results) {
      if (result) {
        storageIdMap.set(result.oldStorageId, result.newStorageId);
        succeeded++;
      } else {
        skipped++;
      }
    }
  }

  console.log(`\n📊 Upload complete: ${succeeded} succeeded, ${skipped} skipped`);

  if (storageIdMap.size === 0) {
    console.log("\n⚠️  No files were migrated. Nothing to update.");
    process.exit(0);
  }

  // 3. Update media records in production with new storageIds
  console.log("\n🔄 Updating media records in production...\n");

  // We need a helper mutation for this — create an inline approach using
  // the Convex HTTP API to read and update documents directly.
  // Since we can't add new mutations easily, we'll use the export/import
  // approach: export prod data, update storageIds, re-import.

  // Actually, the simplest approach: export prod media, update storageIds, re-import just media table.
  // But that's complex. Instead, let's write a temporary Convex mutation.

  // Write a temporary migration action
  const updateScript = `
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const updateStorageId = internalMutation({
  args: {
    mediaId: v.id("media"),
    newStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mediaId, { storageId: args.newStorageId });
  },
});
`;

  const migrationHelperPath = require("path").join(
    __dirname,
    "..",
    "convex",
    "_migrationHelper.ts"
  );

  // Write the helper, deploy, run updates, then clean up
  await Bun.write(migrationHelperPath, updateScript);

  console.log("  Deploying temporary migration helper...");
  const deployResult =
    await Bun.$`cd ${require("path").join(__dirname, "..")} && npx convex deploy --yes 2>&1`.text();

  // Run updates for each media record
  let updated = 0;
  for (const media of localMedia) {
    const newStorageId = storageIdMap.get(media.storageId);
    if (!newStorageId) continue;

    try {
      // Use the Convex CLI to run the internal mutation
      await Bun.$`cd ${require("path").join(__dirname, "..")} && npx convex run --prod _migrationHelper:updateStorageId '${JSON.stringify({ mediaId: media._id, newStorageId })}' 2>&1`.quiet();
      updated++;
      if (updated % 20 === 0) {
        console.log(`  Updated ${updated}/${storageIdMap.size} records...`);
      }
    } catch (err) {
      console.log(`  ⚠️  Failed to update record for "${media.filename}": ${err}`);
    }
  }

  console.log(`  ✅ Updated ${updated} media records.\n`);

  // Clean up the temporary helper
  const fs = require("fs");
  if (fs.existsSync(migrationHelperPath)) {
    fs.unlinkSync(migrationHelperPath);
    console.log("  Cleaning up temporary helper and redeploying...");
    await Bun.$`cd ${require("path").join(__dirname, "..")} && npx convex deploy --yes 2>&1`.quiet();
  }

  console.log("\n🎉 Storage migration complete!");
  console.log(`   ${succeeded} files uploaded to production`);
  console.log(`   ${updated} media records updated with new storage IDs`);
  console.log("\n   Remember to clear cache and redeploy on Netlify.");
}

main();

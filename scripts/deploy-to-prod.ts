#!/usr/bin/env bun
/**
 * Deploy local Convex functions and data to production.
 *
 * Usage:
 *   bun run deploy:prod            # deploy functions + migrate data + migrate storage
 *   bun run deploy:prod:functions   # deploy functions only
 *   bun run deploy:prod:data        # export local data & import to production
 *   bun run migrate:storage         # migrate file storage (images) only
 *
 * What this script does:
 *   1. Deploys Convex functions (schema, queries, mutations) to production
 *   2. Exports a snapshot of the local Convex database
 *   3. Imports that snapshot into the production deployment (replaces all data)
 *   4. Migrates file storage (images) from local to production
 *
 * Prerequisites:
 *   - Local Convex dev server running (`npx convex dev`)
 *   - Authenticated with Convex (`npx convex login`)
 *   - CONVEX_DEPLOYMENT set to your local deployment in .env.local
 */

import { $ } from "bun";
import { existsSync, unlinkSync } from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dir, "..");
const EXPORT_PATH = path.join(ROOT, "local-export.zip");

const args = process.argv.slice(2);
const functionsOnly = args.includes("--functions-only");
const dataOnly = args.includes("--data-only");

async function deployFunctions() {
  console.log("\n📦 Deploying Convex functions to production...\n");
  const result =
    await $`cd ${ROOT} && npx convex deploy --yes`.text();
  console.log(result);
  console.log("✅ Functions deployed.\n");
}

async function migrateData() {
  // Clean up any previous export
  if (existsSync(EXPORT_PATH)) {
    unlinkSync(EXPORT_PATH);
  }

  console.log("\n📤 Exporting local Convex data...\n");
  const exportResult =
    await $`cd ${ROOT} && npx convex export --path ${EXPORT_PATH}`.text();
  console.log(exportResult);

  if (!existsSync(EXPORT_PATH)) {
    console.error("❌ Export failed — file not found at", EXPORT_PATH);
    process.exit(1);
  }

  console.log("📥 Importing data into production (--replace-all)...\n");
  const importResult =
    await $`cd ${ROOT} && npx convex import --prod --replace-all --yes ${EXPORT_PATH}`.text();
  console.log(importResult);

  // Clean up export file
  unlinkSync(EXPORT_PATH);
  console.log("✅ Data migrated to production.\n");
}

async function migrateStorage() {
  console.log("\n🖼️  Migrating file storage to production...\n");
  const result =
    await $`cd ${ROOT} && bun run scripts/migrate-storage.ts`.text();
  console.log(result);
}

async function main() {
  console.log("=".repeat(50));
  console.log("  Azalea Report — Deploy to Production");
  console.log("=".repeat(50));

  try {
    if (dataOnly) {
      await migrateData();
    } else if (functionsOnly) {
      await deployFunctions();
    } else {
      await deployFunctions();
      await migrateData();
      await migrateStorage();
    }

    console.log("🎉 Deployment complete!");
    console.log("   Remember to trigger a fresh deploy on Netlify");
    console.log("   (Deploys → Trigger deploy → Clear cache and deploy site)");
  } catch (error) {
    console.error("\n❌ Deployment failed:\n", error);
    process.exit(1);
  }
}

main();

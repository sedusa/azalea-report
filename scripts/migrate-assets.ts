/**
 * Asset Migration Script - Upload all images to Convex storage
 * Run with: npx tsx scripts/migrate-assets.ts
 */

import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'http://127.0.0.1:3210';
const client = new ConvexHttpClient(CONVEX_URL);

// Admin user ID
const ADMIN_USER_ID = 'k17eswp9hr1efhk7j1kkr4d5697zf4hd' as Id<'users'>;

// Asset directory
const ASSETS_DIR = path.join(process.cwd(), 'apps/web/public/img');

// Mapping file to store path -> mediaId mappings
const MAPPING_FILE = path.join(process.cwd(), 'scripts/asset-mapping.json');

interface AssetMapping {
  [localPath: string]: {
    mediaId: string;
    filename: string;
    url?: string;
  };
}

// Get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Recursively get all image files
function getAllImageFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllImageFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      // Check if it's an image file
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        // Store relative path from baseDir
        const relativePath = path.relative(baseDir, fullPath);
        files.push(relativePath);
      }
    }
  }

  return files;
}

// Upload a single file to Convex storage
async function uploadFile(filePath: string, relativePath: string): Promise<{ mediaId: string; url: string } | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const mimeType = getMimeType(filename);
    const size = fileBuffer.length;

    // Generate upload URL
    const uploadUrl = await client.mutation(api.media.generateUploadUrl, {});

    // Upload file to Convex storage
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': mimeType,
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const { storageId } = await response.json();

    // Create media record
    const mediaId = await client.mutation(api.media.create, {
      storageId,
      filename,
      mimeType,
      size,
      userId: ADMIN_USER_ID,
    });

    // Get the URL for this media
    const mediaRecord = await client.query(api.media.get, { id: mediaId });
    const url = mediaRecord?.url || '';

    return { mediaId: mediaId as string, url };
  } catch (error) {
    console.error(`Error uploading ${relativePath}:`, error);
    return null;
  }
}

// Load existing mapping if it exists
function loadExistingMapping(): AssetMapping {
  try {
    if (fs.existsSync(MAPPING_FILE)) {
      const content = fs.readFileSync(MAPPING_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.log('No existing mapping file found, starting fresh');
  }
  return {};
}

// Save mapping to file
function saveMapping(mapping: AssetMapping): void {
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
}

// Main migration function
async function migrateAssets() {
  console.log('🚀 Starting asset migration to Convex...\n');
  console.log(`Asset directory: ${ASSETS_DIR}`);
  console.log(`Convex URL: ${CONVEX_URL}\n`);

  // Load existing mapping to resume if interrupted
  const mapping = loadExistingMapping();
  const existingCount = Object.keys(mapping).length;
  if (existingCount > 0) {
    console.log(`Found existing mapping with ${existingCount} assets. Will skip already uploaded files.\n`);
  }

  // Get all image files
  const imageFiles = getAllImageFiles(ASSETS_DIR);
  console.log(`Found ${imageFiles.length} image files to process\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const relativePath = imageFiles[i];
    const localPath = `/img/${relativePath.replace(/\\/g, '/')}`;

    // Skip if already uploaded
    if (mapping[localPath]) {
      skipped++;
      continue;
    }

    const fullPath = path.join(ASSETS_DIR, relativePath);

    process.stdout.write(`[${i + 1}/${imageFiles.length}] Uploading ${relativePath}...`);

    const result = await uploadFile(fullPath, relativePath);

    if (result) {
      mapping[localPath] = {
        mediaId: result.mediaId,
        filename: path.basename(relativePath),
        url: result.url,
      };
      uploaded++;
      console.log(' ✓');

      // Save mapping periodically (every 10 uploads)
      if (uploaded % 10 === 0) {
        saveMapping(mapping);
      }
    } else {
      failed++;
      console.log(' ✗');
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Save final mapping
  saveMapping(mapping);

  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary:');
  console.log(`   Total files: ${imageFiles.length}`);
  console.log(`   Uploaded: ${uploaded}`);
  console.log(`   Skipped (already uploaded): ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n✅ Asset mapping saved to: ${MAPPING_FILE}`);
  console.log('='.repeat(50));
}

// Run migration
migrateAssets().catch(console.error);

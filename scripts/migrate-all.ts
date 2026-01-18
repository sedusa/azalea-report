/**
 * Full Migration Script - Migrates assets and content to Convex
 * Run with: npx tsx scripts/migrate-all.ts
 *
 * This script:
 * 1. Uploads all images to Convex storage
 * 2. Creates media records with proper mapping
 * 3. Migrates all content from markdown files
 * 4. Links images in content to their Convex media IDs
 */

import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';
import matter from 'gray-matter';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'http://127.0.0.1:3210';
const client = new ConvexHttpClient(CONVEX_URL);

// Admin user ID - ensure this user exists in Convex
const ADMIN_USER_ID = 'k17eswp9hr1efhk7j1kkr4d5697zf4hd' as Id<'users'>;

// Directories
const ASSETS_DIR = path.join(process.cwd(), 'apps/web/public/img');
const CONTENT_DIR = path.join(process.cwd(), 'content');
const MAPPING_FILE = path.join(process.cwd(), 'scripts/asset-mapping.json');

interface AssetMapping {
  [localPath: string]: {
    mediaId: string;
    filename: string;
    url?: string;
  };
}

// ============================================================
// ASSET UPLOAD FUNCTIONS
// ============================================================

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function getAllImageFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllImageFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        files.push(path.relative(baseDir, fullPath));
      }
    }
  }
  return files;
}

async function uploadFile(filePath: string): Promise<{ mediaId: string; url: string } | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const mimeType = getMimeType(filename);
    const size = fileBuffer.length;

    const uploadUrl = await client.mutation(api.media.generateUploadUrl, {});

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': mimeType },
      body: fileBuffer,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

    const { storageId } = await response.json();

    const mediaId = await client.mutation(api.media.create, {
      storageId,
      filename,
      mimeType,
      size,
      userId: ADMIN_USER_ID,
    });

    const mediaRecord = await client.query(api.media.get, { id: mediaId });
    return { mediaId: mediaId as string, url: mediaRecord?.url || '' };
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

function loadMapping(): AssetMapping {
  try {
    if (fs.existsSync(MAPPING_FILE)) {
      return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    }
  } catch (e) {}
  return {};
}

function saveMapping(mapping: AssetMapping): void {
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
}

async function migrateAssets(): Promise<AssetMapping> {
  console.log('\n📷 PHASE 1: Uploading Assets to Convex Storage\n');
  console.log('='.repeat(50));

  const mapping = loadMapping();
  const existingCount = Object.keys(mapping).length;

  if (existingCount > 0) {
    console.log(`Found existing mapping with ${existingCount} assets.`);
  }

  const imageFiles = getAllImageFiles(ASSETS_DIR);
  console.log(`Found ${imageFiles.length} total image files.\n`);

  let uploaded = 0, skipped = 0, failed = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const relativePath = imageFiles[i];
    const localPath = `/img/${relativePath.replace(/\\/g, '/')}`;

    if (mapping[localPath]) {
      skipped++;
      continue;
    }

    const fullPath = path.join(ASSETS_DIR, relativePath);
    process.stdout.write(`[${i + 1}/${imageFiles.length}] ${relativePath}...`);

    const result = await uploadFile(fullPath);
    if (result) {
      mapping[localPath] = {
        mediaId: result.mediaId,
        filename: path.basename(relativePath),
        url: result.url,
      };
      uploaded++;
      console.log(' ✓');
      if (uploaded % 10 === 0) saveMapping(mapping);
    } else {
      failed++;
      console.log(' ✗');
    }

    await new Promise(r => setTimeout(r, 50));
  }

  saveMapping(mapping);

  console.log('\n📊 Asset Upload Summary:');
  console.log(`   Uploaded: ${uploaded} | Skipped: ${skipped} | Failed: ${failed}`);

  return mapping;
}

// ============================================================
// CONTENT MIGRATION FUNCTIONS
// ============================================================

interface IssueData {
  filePath: string;
  edition: number;
  data: any;
}

function getIssueFiles(): IssueData[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log(`Content directory not found: ${CONTENT_DIR}`);
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter(f => f.startsWith('issue-') && f.endsWith('.md'))
    .map(f => {
      const filePath = path.join(CONTENT_DIR, f);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);
      const edition = parseInt(f.match(/issue-(\d+)/)?.[1] || '0');
      return { filePath, edition, data };
    })
    .sort((a, b) => a.edition - b.edition);
}

// Replace image paths with Convex URLs in content
function replaceImagePaths(content: string, mapping: AssetMapping): string {
  let result = content;

  // Replace all /img/... paths with Convex URLs
  for (const [localPath, info] of Object.entries(mapping)) {
    if (info.url) {
      // Replace both with and without leading slash
      result = result.replace(new RegExp(localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), info.url);
      result = result.replace(new RegExp(localPath.substring(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), info.url);
    }
  }

  return result;
}

// Get image URL from mapping or return original
function getImageUrl(imagePath: string | undefined, mapping: AssetMapping): string {
  if (!imagePath) return '';

  // Normalize the path
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  if (mapping[normalizedPath]) {
    return mapping[normalizedPath].url || imagePath;
  }

  // Try with /img prefix if not found
  if (!normalizedPath.startsWith('/img/')) {
    const withImg = `/img${normalizedPath}`;
    if (mapping[withImg]) {
      return mapping[withImg].url || imagePath;
    }
  }

  return imagePath;
}

function createBannerDate(data: any): string {
  const dateStr = data.banner?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  try {
    const [month, year] = dateStr.split(' ');
    const monthMap: { [key: string]: string } = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12'
    };
    return `${year}-${monthMap[month] || '01'}-01`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

async function createSections(issueId: string, data: any, mapping: AssetMapping): Promise<void> {
  // About section
  if (data.about) {
    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'about',
      data: {
        sectionTitle: data.about.sectionTitle || 'Welcome',
        content: replaceImagePaths(data.about.content || '', mapping),
        signature: data.about.signature || '',
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ About section');
  }

  // Resident Spotlight
  if (data.spotlight) {
    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'spotlight',
      data: {
        sectionTitle: data.spotlight.sectionTitle || 'Resident Spotlight',
        name: data.spotlight.name || '',
        image: getImageUrl(data.spotlight.image, mapping),
        birthplace: data.spotlight.birthplace || '',
        medicalSchool: data.spotlight.medicalSchool || '',
        funFact: data.spotlight.funFact || '',
        favoriteDish: data.spotlight.favoriteDish || '',
        interests: data.spotlight.interests || '',
        postResidencyPlans: data.spotlight.postResidencyPlans || '',
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Spotlight section');
  }

  // Chiefs Corner
  if (data.chiefsCorner) {
    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'chiefsCorner',
      data: {
        sectionTitle: data.chiefsCorner.title || "Chief's Corner",
        name: data.chiefsCorner.chiefs?.[0]?.name || '',
        image: getImageUrl(data.chiefsCorner.chiefs?.[0]?.image, mapping),
        content: replaceImagePaths(data.chiefsCorner.chiefs?.[0]?.content || '', mapping),
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Chiefs Corner section');
  }

  // Interns Corner
  if (data.internsCorner) {
    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'internsCorner',
      data: {
        sectionTitle: data.internsCorner.sectionTitle || "Interns' Corner",
        name: data.internsCorner.name || '',
        image: getImageUrl(data.internsCorner.image, mapping),
        content: replaceImagePaths(data.internsCorner.content || '', mapping),
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Interns Corner section');
  }

  // Recent Success
  if (data.recentSuccess) {
    let content = `<h3>${data.recentSuccess.title || ''}</h3>`;
    if (data.recentSuccess.image) {
      content += `<img src="${getImageUrl(data.recentSuccess.image, mapping)}" alt="${data.recentSuccess.title}" style="width: 100%; max-width: 800px; border-radius: 8px; margin-bottom: 1rem;" />`;
    }
    if (data.recentSuccess.imageCaption) {
      content += `<p><em>${data.recentSuccess.imageCaption}</em></p>`;
    }
    content += replaceImagePaths(data.recentSuccess.content || '', mapping);

    // Add poster images if present
    if (data.recentSuccess.posterImage?.length > 0) {
      content += `<h4>${data.recentSuccess.carouselTitle || 'Poster Presentations'}</h4>`;
      content += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">';
      for (const poster of data.recentSuccess.posterImage) {
        content += `<div><img src="${getImageUrl(poster.image, mapping)}" alt="${poster.caption || ''}" style="width: 100%; border-radius: 8px;" /><p style="font-size: 0.875rem; margin-top: 0.5rem;">${poster.caption || ''}</p></div>`;
      }
      content += '</div>';
    }

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.recentSuccess.sectionTitle || 'Recent Success',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Recent Success section');
  }

  // Community Service Corner
  if (data.communityServiceCorner) {
    let content = '';
    if (data.communityServiceCorner.title) {
      content += `<h3>${data.communityServiceCorner.title}</h3>`;
    }
    if (data.communityServiceCorner.author) {
      content += `<p><em>By ${data.communityServiceCorner.author}</em></p>`;
    }
    if (data.communityServiceCorner.image) {
      content += `<img src="${getImageUrl(data.communityServiceCorner.image, mapping)}" alt="${data.communityServiceCorner.title || 'Community Service'}" style="width: 100%; max-width: 800px; border-radius: 8px; margin-bottom: 1rem;" />`;
    }
    if (data.communityServiceCorner.imageCaption) {
      content += `<p><em>${data.communityServiceCorner.imageCaption}</em></p>`;
    }
    content += replaceImagePaths(data.communityServiceCorner.content || '', mapping);

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.communityServiceCorner.sectionTitle || 'Community Service Corner',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Community Service section');
  }

  // Photos of the Month
  if (data.photosOfMonth?.photos?.length > 0) {
    let content = '';
    if (data.photosOfMonth.subTitle) {
      content += `<p style="font-style: italic; margin-bottom: 1rem;">${data.photosOfMonth.subTitle}</p>`;
    }
    content += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">';
    for (const photo of data.photosOfMonth.photos) {
      content += `<div><img src="${getImageUrl(photo.image, mapping)}" alt="${photo.caption || ''}" style="width: 100%; border-radius: 8px;" /><p style="font-size: 0.875rem; margin-top: 0.5rem; text-align: center;">${photo.caption || ''}</p></div>`;
    }
    content += '</div>';

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.photosOfMonth.sectionTitle || 'Photos of the Month',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Photos of Month section');
  }

  // Events
  if (data.events?.eventsList?.length > 0) {
    let content = '<ul style="list-style: none; padding: 0;">';
    for (const event of data.events.eventsList) {
      content += `<li style="margin-bottom: 0.75rem; padding-left: 1rem; border-left: 3px solid #016f53;"><strong>${event.date || ''}</strong>: ${event.description || ''}</li>`;
    }
    content += '</ul>';

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.events.sectionTitle || 'Upcoming Events',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Events section');
  }

  // Things To Do
  if (data.thingsToDo?.items?.length > 0) {
    let content = '<div style="display: grid; gap: 1rem;">';
    for (const item of data.thingsToDo.items) {
      content += `<div style="padding: 1rem; background: rgba(1, 111, 83, 0.1); border-radius: 8px;">`;
      content += `<h4 style="margin: 0 0 0.5rem 0;"><a href="${item.url || '#'}" target="_blank" style="color: #016f53;">${item.title || ''}</a></h4>`;
      if (item.date) content += `<p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">${item.date}</p>`;
      if (item.description) content += `<p style="margin: 0;">${item.description}</p>`;
      content += '</div>';
    }
    content += '</div>';

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.thingsToDo.sectionTitle || 'Things To Do in Valdosta',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Things To Do section');
  }

  // Culturosity
  if (data.culturosity) {
    let content = '';
    if (data.culturosity.title) {
      content += `<h3>${data.culturosity.title}</h3>`;
    }
    if (data.culturosity.image) {
      content += `<img src="${getImageUrl(data.culturosity.image, mapping)}" alt="${data.culturosity.title || 'Culturosity'}" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 1rem;" />`;
    }
    content += replaceImagePaths(data.culturosity.content || '', mapping);

    // Add carousel images if present
    if (data.culturosity.carousel?.length > 0) {
      content += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">';
      for (const img of data.culturosity.carousel) {
        content += `<img src="${getImageUrl(img.image || img, mapping)}" alt="Culturosity" style="width: 100%; border-radius: 8px;" />`;
      }
      content += '</div>';
    }

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.culturosity.sectionTitle || 'Culturosity',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Culturosity section');
  }

  // News From Clinic
  if (data.newsFromClinic) {
    let content = '';
    if (data.newsFromClinic.employeeSpotlight) {
      const emp = data.newsFromClinic.employeeSpotlight;
      content += `<h3>${emp.subSectionTitle || 'Employee Spotlight'}</h3>`;
      if (emp.image) {
        content += `<img src="${getImageUrl(emp.image, mapping)}" alt="${emp.name || ''}" style="max-width: 300px; border-radius: 8px; margin-bottom: 1rem;" />`;
      }
      if (emp.name) content += `<h4>${emp.name}</h4>`;
      if (emp.title) content += `<p><em>${emp.title}</em></p>`;
      if (emp.profile) content += `<p>${emp.profile}</p>`;
    }

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.newsFromClinic.sectionTitle || 'News From The Clinic',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ News From Clinic section');
  }

  // Wellness Corner
  if (data.wellnessCorner) {
    let content = '';
    if (data.wellnessCorner.title) {
      content += `<h3>${data.wellnessCorner.title}</h3>`;
    }
    if (data.wellnessCorner.image) {
      content += `<img src="${getImageUrl(data.wellnessCorner.image, mapping)}" alt="${data.wellnessCorner.title || 'Wellness'}" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 1rem;" />`;
    }
    content += replaceImagePaths(data.wellnessCorner.content || '', mapping);

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.wellnessCorner.sectionTitle || 'Wellness Corner',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Wellness Corner section');
  }

  // Program section
  if (data.program) {
    let content = '';
    if (data.program.about) {
      content += `<p>${data.program.about}</p>`;
    }
    if (data.program.statistics) {
      content += `<h3>${data.program.statistics.sectionTitle || 'Program Statistics'}</h3><ul>`;
      if (data.program.statistics.residentCount) {
        content += `<li><strong>Residents:</strong> ${data.program.statistics.residentCount}</li>`;
      }
      if (data.program.statistics.countryCount) {
        content += `<li><strong>Countries Represented:</strong> ${data.program.statistics.countryCount}</li>`;
      }
      if (data.program.statistics.languageCount) {
        content += `<li><strong>Languages Spoken:</strong> ${data.program.statistics.languageCount}</li>`;
      }
      content += '</ul>';
    }

    await client.mutation(api.sections.create, {
      issueId: issueId as Id<'issues'>,
      type: 'genericText',
      data: {
        sectionTitle: data.program.title || 'About the Program',
        content,
      },
      userId: ADMIN_USER_ID,
    });
    console.log('  ✓ Program section');
  }
}

async function migrateContent(mapping: AssetMapping): Promise<void> {
  console.log('\n📄 PHASE 2: Migrating Content to Convex\n');
  console.log('='.repeat(50));

  const issues = getIssueFiles();
  console.log(`Found ${issues.length} issues to migrate\n`);

  for (const issue of issues) {
    console.log(`\n📰 Issue #${issue.edition}: ${issue.data.banner?.title || 'Untitled'}`);

    try {
      // Create issue
      const issueId = await client.mutation(api.issues.create, {
        title: `Edition ${issue.edition} - ${issue.data.banner?.date || ''}`,
        edition: issue.edition,
        bannerTitle: issue.data.banner?.title || 'AZALEA REPORT',
        bannerDate: createBannerDate(issue.data),
        userId: ADMIN_USER_ID,
      });

      console.log(`  Created issue: ${issueId}`);

      // Create sections
      await createSections(issueId as string, issue.data, mapping);

      // Publish the issue
      await client.mutation(api.issues.publish, {
        id: issueId,
        userId: ADMIN_USER_ID,
      });

      console.log(`  ✓ Issue #${issue.edition} published`);

    } catch (error) {
      console.error(`  ✗ Error migrating issue #${issue.edition}:`, error);
    }
  }
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('   AZALEA REPORT - FULL CONTENT MIGRATION');
  console.log('═'.repeat(60));
  console.log(`\nConvex URL: ${CONVEX_URL}`);
  console.log(`Assets Dir: ${ASSETS_DIR}`);
  console.log(`Content Dir: ${CONTENT_DIR}\n`);

  // Phase 1: Upload assets
  const mapping = await migrateAssets();

  // Phase 2: Migrate content
  await migrateContent(mapping);

  console.log('\n' + '═'.repeat(60));
  console.log('   ✅ MIGRATION COMPLETE');
  console.log('═'.repeat(60));
  console.log('\nNext steps:');
  console.log('1. Check the CMS at http://localhost:3001');
  console.log('2. Verify images display correctly');
  console.log('3. Check the frontend at http://localhost:3000');
  console.log('═'.repeat(60) + '\n');
}

main().catch(console.error);

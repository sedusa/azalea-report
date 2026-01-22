/**
 * Migration script to import content from markdown files into Convex sections
 *
 * This script:
 * 1. Reads markdown files from /content directory
 * 2. Parses YAML frontmatter
 * 3. Maps content to existing Convex sections by edition number
 * 4. Updates section data (preserving existing media references)
 *
 * Run with: npx tsx scripts/migrate-markdown-content.ts
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

// Initialize Convex client - using production URL
const CONVEX_URL = 'https://resolute-emu-262.convex.cloud';
const convex = new ConvexHttpClient(CONVEX_URL);
console.log(`Connecting to Convex at: ${CONVEX_URL}`);

interface MarkdownContent {
  edition: number;
  data: Record<string, any>;
}

// Read and parse markdown files
function readMarkdownFiles(): MarkdownContent[] {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

  const contents: MarkdownContent[] = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);

    // Determine edition number
    let edition: number;
    if (file === 'home.md') {
      edition = parsed.data.banner?.edition || 7;
    } else {
      const match = file.match(/issue-(\d+)\.md/);
      edition = match ? parseInt(match[1]) : 0;
    }

    if (edition > 0) {
      contents.push({
        edition,
        data: parsed.data,
      });
      console.log(`Parsed ${file} (Edition ${edition})`);
    }
  }

  return contents.sort((a, b) => a.edition - b.edition);
}

// Map markdown section to Convex section type
function mapSectionType(mdKey: string): string | null {
  const mapping: Record<string, string> = {
    'about': 'about',
    'spotlight': 'spotlight',
    'chiefsCorner': 'chiefsCorner',
    'internsCorner': 'internsCorner',
    'recentSuccess': 'recentSuccess',
    'communityServiceCorner': 'communityService',
    'photosOfMonth': 'photosOfMonth',
    'events': 'events',
    'podcast': 'podcast',
    'culturosity': 'culturosity',
    'musings': 'custom',
    'genericSingleImageTextSection': 'custom',
    'genericSingleImageCarouselTextSection': 'custom',
    'basicSection': 'custom',
    'wellnessCorner': 'textImage',
    'newsFromClinic': 'twoColumn',
  };
  return mapping[mdKey] || null;
}

// Transform markdown section data to Convex format
function transformSectionData(mdKey: string, mdData: any): Record<string, any> | null {
  switch (mdKey) {
    case 'about':
      return {
        sectionTitle: mdData.sectionTitle || '',
        content: mdData.content || '',
        signature: mdData.signature || '',
      };

    case 'spotlight':
      return {
        sectionTitle: mdData.sectionTitle || 'Resident Spotlight',
        name: mdData.name || '',
        birthplace: mdData.birthplace || '',
        medicalSchool: mdData.medicalSchool || '',
        funFact: mdData.funFact || '',
        favoriteDish: mdData.favoriteDish || '',
        interests: mdData.interests || '',
        postResidencyPlans: mdData.postResidencyPlans || '',
        // Note: image preserved from existing Convex data
      };

    case 'chiefsCorner':
      return {
        sectionTitle: mdData.title || "The Chiefs' Corner",
        chiefs: (mdData.chiefs || []).map((chief: any) => ({
          name: chief.name || '',
          content: chief.content || '',
          // Note: image preserved from existing Convex data
        })),
      };

    case 'internsCorner':
      return {
        sectionTitle: mdData.title || "Intern Spotlight",
        interns: (mdData.interns || []).map((intern: any) => ({
          name: intern.name || '',
          content: intern.content || '',
          // Note: image preserved from existing Convex data
        })),
      };

    case 'recentSuccess':
      return {
        sectionTitle: mdData.sectionTitle || 'Recent Success',
        title: mdData.title || '',
        content: mdData.content || '',
        imageCaption: mdData.imageCaption || '',
        // Note: image and images preserved from existing Convex data
      };

    case 'communityServiceCorner':
      return {
        sectionTitle: mdData.sectionTitle || 'Community Service Corner',
        title: mdData.title || '',
        content: mdData.content || '',
        imageCaption: mdData.imageCaption || '',
        photosTitle: mdData.photosTitle || '',
        // Note: image and images preserved from existing Convex data
      };

    case 'photosOfMonth':
      return {
        sectionTitle: mdData.sectionTitle || 'Photos of the Month',
        title: mdData.subTitle || '',
        // Note: images preserved from existing Convex data
      };

    case 'events':
      return {
        eventsTitle: mdData.sectionTitle || 'Upcoming Events',
        events: (mdData.eventsList || []).map((event: any) => ({
          date: event.date || '',
          title: event.description || '',
        })),
      };

    case 'podcast':
      return {
        sectionTitle: mdData.sectionTitle || 'Podcasts',
        title: mdData.title || '',
        subtitle: mdData.subtitle || '',
        episodes: (mdData.episodes || []).map((ep: any) => ({
          title: ep.name || '',
          description: ep.synopsis || '',
          buttonUrl: ep.noPlayerLink || ep.iframeUrl || '',
          buttonText: ep.noPlayerLinkText || 'Listen on Spotify',
        })),
      };

    case 'culturosity':
      return {
        sectionTitle: mdData.sectionTitle || 'Culturosity',
        title: mdData.title || '',
        content: mdData.content || '',
        author: mdData.author || '',
        // Note: image preserved from existing Convex data
      };

    case 'musings':
    case 'genericSingleImageTextSection':
    case 'genericSingleImageCarouselTextSection':
    case 'basicSection':
      return {
        sectionTitle: mdData.sectionTitle || '',
        title: mdData.title || '',
        description: mdData.description || '',
        author: mdData.author || '',
        html: mdData.content || '',
        // Note: images preserved from existing Convex data
      };

    case 'wellnessCorner':
      return {
        sectionTitle: mdData.sectionTitle || 'Wellness Corner',
        content: mdData.content || '',
        imageCaption: mdData.altImageText || '',
        imagePosition: 'left' as const,
        // Note: image preserved from existing Convex data
      };

    default:
      return null;
  }
}

// Merge new data with existing, preserving media references
function mergeWithExisting(newData: Record<string, any>, existingData: Record<string, any>): Record<string, any> {
  const merged = { ...newData };

  // Preserve image references from existing data
  if (existingData.image) merged.image = existingData.image;
  if (existingData.images) merged.images = existingData.images;
  if (existingData.leftImage) merged.leftImage = existingData.leftImage;
  if (existingData.rightImage) merged.rightImage = existingData.rightImage;

  // Preserve chief/intern images
  if (merged.chiefs && existingData.chiefs) {
    merged.chiefs = merged.chiefs.map((chief: any, i: number) => ({
      ...chief,
      image: existingData.chiefs[i]?.image || chief.image,
    }));
  }

  if (merged.interns && existingData.interns) {
    merged.interns = merged.interns.map((intern: any, i: number) => ({
      ...intern,
      image: existingData.interns[i]?.image || intern.image,
    }));
  }

  return merged;
}

async function migrate() {
  console.log('Starting migration...\n');

  // Read markdown files
  const markdownContents = readMarkdownFiles();
  console.log(`\nFound ${markdownContents.length} markdown files\n`);

  // Get all issues from Convex
  const issues = await convex.query(api.issues.list);
  console.log(`Found ${issues.length} issues in Convex\n`);

  // Process each markdown file
  for (const md of markdownContents) {
    console.log(`\n--- Processing Edition ${md.edition} ---`);

    // Find matching issue
    const issue = issues.find((i: any) => i.edition === md.edition);
    if (!issue) {
      console.log(`  No matching issue found for edition ${md.edition}`);
      continue;
    }

    console.log(`  Found issue: ${issue.title} (${issue._id})`);

    // Get existing sections for this issue
    const existingSections = await convex.query(api.sections.listByIssue, { issueId: issue._id });
    console.log(`  Found ${existingSections.length} existing sections`);

    // Process each markdown section
    const mdSections = Object.entries(md.data).filter(([key]) =>
      !['banner', 'program', 'tribalCouncil', 'programDirector', 'thingsToDo', 'halloweenCarousel'].includes(key)
    );

    for (const [mdKey, mdValue] of mdSections) {
      if (!mdValue || typeof mdValue !== 'object') continue;

      const convexType = mapSectionType(mdKey);
      if (!convexType) {
        console.log(`  Skipping unknown section: ${mdKey}`);
        continue;
      }

      // Find matching existing section by type
      const existingSection = existingSections.find((s: any) => s.type === convexType);

      // Transform markdown data
      const newData = transformSectionData(mdKey, mdValue);
      if (!newData) {
        console.log(`  Could not transform section: ${mdKey}`);
        continue;
      }

      if (existingSection) {
        // Merge with existing data (preserving media)
        const mergedData = mergeWithExisting(newData, existingSection.data);

        console.log(`  Updating section: ${mdKey} -> ${convexType}`);

        try {
          await convex.mutation(api.sections.update, {
            id: existingSection._id,
            data: mergedData,
          });
          console.log(`    ✓ Updated successfully`);
        } catch (error: any) {
          console.log(`    ✗ Error: ${error.message}`);
        }
      } else {
        console.log(`  No existing ${convexType} section found for ${mdKey}`);
      }
    }
  }

  console.log('\n\nMigration complete!');
}

// Run the migration
migrate().catch(console.error);

/**
 * Migration script to migrate markdown content to Convex CMS
 * Run with: npx tsx scripts/migrate-content.ts
 */

import fs from 'fs';
import path from 'path';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import matter from 'gray-matter';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://resolute-emu-262.convex.cloud';
const client = new ConvexHttpClient(CONVEX_URL);

// Your admin user ID
const ADMIN_USER_ID = 'k17eswp9hr1efhk7j1kkr4d5697zf4hd';

interface IssueData {
  filePath: string;
  edition: number;
  data: any;
}

// Read all issue files
function getIssueFiles(): IssueData[] {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);

  const issueFiles = files
    .filter(f => f.startsWith('issue-') && f.endsWith('.md'))
    .map(f => {
      const filePath = path.join(contentDir, f);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);
      const edition = parseInt(f.match(/issue-(\d+)/)?.[1] || '0');

      return { filePath, edition, data };
    })
    .sort((a, b) => a.edition - b.edition);

  return issueFiles;
}

// Create issue banner title from edition and date
function createBannerTitle(data: any): string {
  return data.banner?.title || 'AZALEA REPORT';
}

// Create issue title from edition and date
function createIssueTitle(data: any, edition: number): string {
  const date = data.banner?.date || `Edition ${edition}`;
  return `${data.banner?.subtitle || 'SGMC Health Internal Medicine Residency Newsletter'} - ${date}`;
}

// Create bannerDate from banner.date
function createBannerDate(data: any): string {
  const dateStr = data.banner?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  // Convert "October 2024" to "2024-10-01" format
  try {
    const [month, year] = dateStr.split(' ');
    const monthMap: { [key: string]: string } = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12'
    };
    return `${year}-${monthMap[month] || '01'}-01`;
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

// Map content sections to CMS sections
async function createSections(issueId: string, data: any): Promise<void> {
  let order = 0;

  // About section
  if (data.about) {
    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'about',
      data: {
        sectionTitle: data.about.sectionTitle || 'Welcome',
        content: data.about.content || '',
        signature: data.about.signature || '',
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created About section`);
  }

  // Program section (as generic text)
  if (data.program) {
    const programContent = `
      <h2>${data.program.title || 'About the Program'}</h2>
      <p>${data.program.about || ''}</p>
      ${data.program.statistics ? `
        <h3>${data.program.statistics.sectionTitle || 'Program Statistics'}</h3>
        <ul>
          ${data.program.statistics.residentCount ? `<li><strong>Residents:</strong> ${data.program.statistics.residentCount}</li>` : ''}
          ${data.program.statistics.countryCount ? `<li><strong>Countries Represented:</strong> ${data.program.statistics.countryCount}</li>` : ''}
          ${data.program.statistics.languageCount ? `<li><strong>Languages Spoken:</strong> ${data.program.statistics.languageCount}</li>` : ''}
        </ul>
      ` : ''}
    `;

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.program.title || 'About the Program',
        content: programContent,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Program section`);
  }

  // Resident Spotlight
  if (data.spotlight) {
    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'spotlight',
      data: {
        sectionTitle: 'Resident Spotlight',
        name: data.spotlight.name || '',
        image: data.spotlight.image || '',
        birthplace: data.spotlight.birthplace || '',
        funFact: data.spotlight.funFact || '',
        favoriteDish: data.spotlight.favoriteDish || '',
        interests: data.spotlight.interests || '',
        postResidencyPlans: data.spotlight.postResidencyPlans || '',
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Spotlight section`);
  }

  // Tribal Council (as generic text)
  if (data.tribalCouncil) {
    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: 'Tribal Council Update',
        content: `<p>${data.tribalCouncil.content || ''}</p>`,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Tribal Council section`);
  }

  // Chiefs Corner
  if (data.chiefsCorner && data.chiefsCorner.chiefs) {
    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'chiefsCorner',
      data: {
        sectionTitle: data.chiefsCorner.title || "The Chiefs' Corner",
        chiefs: data.chiefsCorner.chiefs.map((chief: any) => ({
          name: chief.name || '',
          image: chief.image || '',
          content: chief.content || '',
        })),
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Chiefs Corner section`);
  }

  // Program Director Message (as generic text)
  if (data.programDirector) {
    const content = `
      <div style="text-align: center;">
        ${data.programDirector.image ? `<img src="${data.programDirector.image}" alt="${data.programDirector.name}" style="max-width: 200px; border-radius: 10px; margin-bottom: 1rem;" />` : ''}
        <h3>${data.programDirector.name || ''}</h3>
        <p><em>${data.programDirector.title || ''}</em></p>
      </div>
      <p>${data.programDirector.message || ''}</p>
    `;

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.programDirector.sectionTitle || 'Message from the Program Director',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Program Director section`);
  }

  // Recent Success
  if (data.recentSuccess) {
    let content = `<h3>${data.recentSuccess.title || ''}</h3>`;
    if (data.recentSuccess.image) {
      content += `<img src="${data.recentSuccess.image}" alt="${data.recentSuccess.title}" style="width: 100%; max-width: 800px;" />`;
      if (data.recentSuccess.imageCaption) {
        content += `<p><small><em>${data.recentSuccess.imageCaption}</em></small></p>`;
      }
    }
    content += `<p>${data.recentSuccess.content || ''}</p>`;

    // Add poster carousel if exists
    if (data.recentSuccess.posterImage && data.recentSuccess.posterImage.length > 0) {
      content += `<h4>${data.recentSuccess.carouselTitle || 'Poster Presentations'}</h4>`;
      content += '<div class="poster-grid">';
      data.recentSuccess.posterImage.forEach((poster: any) => {
        content += `
          <div class="poster-item">
            <img src="${poster.image}" alt="${poster.caption}" />
            <p><small>${poster.caption}</small></p>
          </div>
        `;
      });
      content += '</div>';
    }

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.recentSuccess.sectionTitle || 'Recent Success',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Recent Success section`);
  }

  // Community Service Corner
  if (data.communityServiceCorner) {
    let content = `<h3>${data.communityServiceCorner.title || ''}</h3>`;
    if (data.communityServiceCorner.author) {
      content += `<p><em>By ${data.communityServiceCorner.author}</em></p>`;
    }
    if (data.communityServiceCorner.image) {
      content += `<img src="${data.communityServiceCorner.image}" alt="${data.communityServiceCorner.title}" style="width: 100%; max-width: 800px;" />`;
      if (data.communityServiceCorner.imageCaption) {
        content += `<p><small><em>${data.communityServiceCorner.imageCaption}</em></small></p>`;
      }
    }
    content += data.communityServiceCorner.content || '';

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.communityServiceCorner.sectionTitle || 'Community Service Corner',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Community Service section`);
  }

  // Photos of the Month
  if (data.photosOfMonth && data.photosOfMonth.photos) {
    const photos = data.photosOfMonth.photos.map((photo: any) => ({
      image: photo.image || '',
      caption: photo.caption || '',
    }));

    let content = `<h3>${data.photosOfMonth.subTitle || 'Capturing the Smiles, Milestones, and Unforgettable Moments'}</h3>`;
    content += '<div class="photo-grid">';
    photos.forEach((photo: any) => {
      content += `
        <div class="photo-item">
          <img src="${photo.image}" alt="${photo.caption}" />
          <p><small>${photo.caption}</small></p>
        </div>
      `;
    });
    content += '</div>';

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.photosOfMonth.sectionTitle || 'Through the Lens: Residency Highlights',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Photos of the Month section`);
  }

  // Events
  if (data.events && data.events.eventsList) {
    let content = '<ul class="events-list">';
    data.events.eventsList.forEach((event: any) => {
      content += `
        <li>
          <strong>${event.date || ''}</strong>: ${event.description || ''}
        </li>
      `;
    });
    content += '</ul>';

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.events.sectionTitle || 'Upcoming Events',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Events section`);
  }

  // Things To Do
  if (data.thingsToDo && data.thingsToDo.items) {
    let content = '<ul class="things-to-do">';
    data.thingsToDo.items.forEach((item: any) => {
      content += `
        <li>
          <h4><a href="${item.url || '#'}" target="_blank">${item.title || ''}</a></h4>
          <p><em>${item.date || ''}</em></p>
          <p>${item.description || ''}</p>
        </li>
      `;
    });
    content += '</ul>';

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.thingsToDo.sectionTitle || 'Things To Do In Valdosta',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Things To Do section`);
  }

  // News From Clinic
  if (data.newsFromClinic) {
    let content = '';
    if (data.newsFromClinic.employeeSpotlight) {
      const emp = data.newsFromClinic.employeeSpotlight;
      content += `<h3>${emp.subSectionTitle || 'Employee Spotlight'}</h3>`;
      if (emp.image) {
        content += `<img src="${emp.image}" alt="${emp.name}" style="max-width: 300px; border-radius: 10px;" />`;
      }
      content += `
        <h4>${emp.name || ''}</h4>
        <p><em>${emp.title || ''}</em></p>
        <p>${emp.profile || ''}</p>
      `;
    }

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.newsFromClinic.sectionTitle || 'News From The Clinic',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created News From Clinic section`);
  }

  // Wellness Corner
  if (data.wellnessCorner) {
    let content = `<h3>${data.wellnessCorner.title || ''}</h3>`;
    if (data.wellnessCorner.image) {
      content += `<img src="${data.wellnessCorner.image}" alt="${data.wellnessCorner.altImageText || 'Wellness'}" style="width: 100%; max-width: 600px;" />`;
    }
    content += `<p>${data.wellnessCorner.content || ''}</p>`;

    await client.mutation(api.sections.create, {
      issueId: issueId as any,
      type: 'genericText',
      data: {
        sectionTitle: data.wellnessCorner.sectionTitle || 'Wellness Corner',
        content,
      },
      userId: ADMIN_USER_ID as any,
    });
    order++;
    console.log(`  ✓ Created Wellness Corner section`);
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting content migration...\n');

  const issues = getIssueFiles();
  console.log(`Found ${issues.length} issues to migrate\n`);

  for (const issue of issues) {
    console.log(`\n📄 Migrating Issue #${issue.edition}...`);

    try {
      // Create issue
      const issueId = await client.mutation(api.issues.create, {
        title: createIssueTitle(issue.data, issue.edition),
        edition: issue.edition,
        bannerTitle: createBannerTitle(issue.data),
        bannerDate: createBannerDate(issue.data),
        userId: ADMIN_USER_ID as any,
      });

      console.log(`  ✓ Created issue: ${issueId}`);

      // Create sections
      await createSections(issueId, issue.data);

      // Publish issue
      await client.mutation(api.issues.publish, {
        id: issueId as any,
        userId: ADMIN_USER_ID as any,
      });

      console.log(`  ✓ Published issue #${issue.edition}`);

    } catch (error) {
      console.error(`  ✗ Error migrating issue #${issue.edition}:`, error);
    }
  }

  console.log('\n✅ Migration complete!');
}

// Run migration
migrate().catch(console.error);

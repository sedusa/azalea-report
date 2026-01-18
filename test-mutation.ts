import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api';

const CONVEX_URL = 'https://resolute-emu-262.convex.cloud';
const client = new ConvexHttpClient(CONVEX_URL);
const ADMIN_USER_ID = 'k17eswp9hr1efhk7j1kkr4d5697zf4hd';

async function test() {
  console.log('Testing mutation...');
  try {
    const issueId = await client.mutation(api.issues.create, {
      title: 'Test Issue via HTTP Client',
      edition: 99,
      bannerTitle: 'TEST',
      bannerDate: '2026-01-18',
      userId: ADMIN_USER_ID as any,
    });
    console.log('Created issue:', issueId);

    const issues = await client.query(api.issues.list, {});
    console.log('Total issues:', issues.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();

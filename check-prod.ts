import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api';

const client = new ConvexHttpClient('https://resolute-emu-262.convex.cloud');

async function check() {
  const issues = await client.query(api.issues.list, {});
  console.log(`Total issues in production: ${issues.length}\n`);
  issues.forEach((issue: any) => {
    console.log(`Edition ${issue.edition}: ${issue.title} (${issue.status})`);
  });
}

check();

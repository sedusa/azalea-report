import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";

async function verifyBirthdays() {
  const client = new ConvexHttpClient(CONVEX_URL);
  const birthdays = await client.query(api.birthdays.list, {});

  console.log(`Total birthdays in Convex: ${birthdays.length}`);
  console.log("\nSample entries:");
  birthdays.slice(0, 5).forEach(b => {
    console.log(`  - ${b.name}: ${b.month}/${b.day}`);
  });

  // Group by month
  const byMonth: Record<number, number> = {};
  birthdays.forEach(b => {
    byMonth[b.month] = (byMonth[b.month] || 0) + 1;
  });

  console.log("\nBirthdays by month:");
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  Object.entries(byMonth)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([month, count]) => {
      console.log(`  ${monthNames[Number(month)]}: ${count}`);
    });
}

verifyBirthdays();

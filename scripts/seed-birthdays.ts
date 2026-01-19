import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import birthdaysData from "../public/birthdays.json";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  process.exit(1);
}

async function seedBirthdays() {
  const client = new ConvexHttpClient(CONVEX_URL!);

  console.log("Seeding birthdays to Convex...");
  console.log(`Found ${birthdaysData.staff.length} birthdays to import`);

  try {
    const result = await client.mutation(api.birthdays.seed, {
      birthdays: birthdaysData.staff,
      clearExisting: true, // Clear existing data before seeding
    });

    console.log(`✓ Successfully inserted ${result.inserted} of ${result.total} birthdays`);
  } catch (error) {
    console.error("Error seeding birthdays:", error);
    process.exit(1);
  }
}

seedBirthdays();

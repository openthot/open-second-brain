import * as dotenv from "dotenv";
import { NotionBrainBuilder } from "./builder";

dotenv.config();

async function main() {
  const apiKey = process.env.NOTION_API_KEY;
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

  if (!apiKey || !parentPageId) {
    console.error("❌ Error: Missing NOTION_API_KEY or NOTION_PARENT_PAGE_ID in .env file.");
    console.error("Please copy .env.example to .env and provide your credentials.");
    process.exit(1);
  }

  const builder = new NotionBrainBuilder({ apiKey, parentPageId });

  try {
    await builder.run();
  } catch (error: any) {
    console.error("❌ Provisioning failed:", error?.message || error);
    process.exit(1);
  }
}

main();

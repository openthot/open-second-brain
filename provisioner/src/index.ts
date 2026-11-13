import * as dotenv from "dotenv";
import { NotionBrainBuilder } from "./builder";

dotenv.config();

/**
 * Extracts a normalized 32-character Notion Page ID from a raw ID or full Notion URL.
 */
function normalizePageId(rawInput: string): string | null {
  const cleanInput = rawInput.trim();
  // Check if full Notion URL (e.g., https://notion.so/workspace/Page-Title-32charId)
  const urlMatch = cleanInput.match(/[a-f0-9]{32}/i);
  if (urlMatch) {
    return urlMatch[0];
  }
  // Check UUID with hyphens (e.g. 12345678-1234-1234-1234-123456789abc)
  const uuidMatch = cleanInput.replace(/-/g, "").match(/^[a-f0-9]{32}$/i);
  if (uuidMatch) {
    return uuidMatch[0];
  }
  return null;
}

/**
 * Scrubs any sensitive tokens from error strings before terminal display.
 */
function sanitizeErrorMessage(message: string, apiKey: string): string {
  if (!apiKey) return message;
  const escapedKey = apiKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedKey, "g");
  return message.replace(regex, "[REDACTED_API_KEY]");
}

async function main() {
  const rawApiKey = process.env.NOTION_API_KEY?.trim();
  const rawParentPageId = process.env.NOTION_PARENT_PAGE_ID?.trim();

  if (!rawApiKey || !rawParentPageId) {
    console.error("❌ Error: Missing NOTION_API_KEY or NOTION_PARENT_PAGE_ID in .env file.");
    console.error("Please copy .env.example to .env and provide your credentials.");
    process.exit(1);
  }

  // Validate API Key format
  if (!rawApiKey.startsWith("secret_") && !rawApiKey.startsWith("ntn_")) {
    console.error("❌ Error: Invalid NOTION_API_KEY format.");
    console.error("Notion integration tokens must begin with 'secret_' or 'ntn_'.");
    process.exit(1);
  }

  // Sanitize and validate Parent Page ID
  const parentPageId = normalizePageId(rawParentPageId);
  if (!parentPageId) {
    console.error("❌ Error: Invalid NOTION_PARENT_PAGE_ID format.");
    console.error("Please supply a valid 32-character Notion Page ID or full page URL.");
    process.exit(1);
  }

  const maskedKey = `${rawApiKey.substring(0, 10)}...${rawApiKey.slice(-4)}`;
  console.log(`🔐 Authenticated with token: ${maskedKey}`);
  console.log(`🎯 Target Page ID: ${parentPageId}`);

  const builder = new NotionBrainBuilder({ apiKey: rawApiKey, parentPageId });

  try {
    await builder.run();
  } catch (error: any) {
    const rawError = error?.message || String(error);
    const safeError = sanitizeErrorMessage(rawError, rawApiKey);
    console.error("❌ Provisioning failed:", safeError);
    process.exit(1);
  }
}

main();

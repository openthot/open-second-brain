import { Client } from "@notionhq/client";

export interface ProvisionerConfig {
  apiKey: string;
  parentPageId: string;
}

export class NotionBrainBuilder {
  private notion: Client;
  private parentPageId: string;
  public dbMap: Record<string, string> = {};

  constructor(config: ProvisionerConfig) {
    this.notion = new Client({ auth: config.apiKey });
    this.parentPageId = config.parentPageId;
  }

  public async run() {
    console.log("🚀 Starting OpenSecondBrain Automated Provisioning...\n");

    // 1. Create Core Databases
    await this.createAreasDatabase();
    await this.createProjectsDatabase();
    await this.createTasksDatabase();
    await this.createNotesDatabase();
    await this.createResourcesDatabase();
    await this.createReviewsDatabase();

    // 2. Establish Mutual Database Relations
    await this.linkDatabaseRelations();

    // 3. Seed Sample Data
    await this.seedInitialContent();

    console.log("\n✨ OpenSecondBrain successfully provisioned into your Notion workspace!");
  }

  private async createAreasDatabase() {
    console.log("📁 Creating [DB_Areas]...");
    const response = await this.notion.databases.create({
      parent: { type: "page_id", page_id: this.parentPageId },
      title: [{ type: "text", text: { content: "🌐 Areas of Life" } }],
      icon: { type: "emoji", emoji: "🌐" },
      properties: {
        Name: { title: {} },
        Category: {
          select: {
            options: [
              { name: "Professional", color: "blue" },
              { name: "Personal", color: "green" },
              { name: "Financial", color: "yellow" },
              { name: "Health & Longevity", color: "red" }
            ]
          }
        },
        Status: {
          select: {
            options: [
              { name: "Focusing", color: "green" },
              { name: "Maintaining", color: "blue" },
              { name: "Paused", color: "gray" }
            ]
          }
        }
      }
    });
    this.dbMap["Areas"] = response.id;
  }

  private async createProjectsDatabase() {
    console.log("🎯 Creating [DB_Projects]...");
    const response = await this.notion.databases.create({
      parent: { type: "page_id", page_id: this.parentPageId },
      title: [{ type: "text", text: { content: "🎯 Projects" } }],
      icon: { type: "emoji", emoji: "🎯" },
      properties: {
        Name: { title: {} },
        Status: {
          select: {
            options: [
              { name: "Planning", color: "yellow" },
              { name: "Active Sprint", color: "blue" },
              { name: "On Hold", color: "orange" },
              { name: "Completed", color: "green" }
            ]
          }
        },
        Deadline: { date: {} }
      }
    });
    this.dbMap["Projects"] = response.id;
  }

  private async createTasksDatabase() {
    console.log("⚡ Creating [DB_Tasks]...");
    const response = await this.notion.databases.create({
      parent: { type: "page_id", page_id: this.parentPageId },
      title: [{ type: "text", text: { content: "⚡ Action Tasks" } }],
      icon: { type: "emoji", emoji: "⚡" },
      properties: {
        Task: { title: {} },
        Status: {
          select: {
            options: [
              { name: "To Do", color: "gray" },
              { name: "In Progress", color: "blue" },
              { name: "Blocked", color: "red" },
              { name: "Done", color: "green" }
            ]
          }
        },
        "Due Date": { date: {} },
        Priority: {
          select: {
            options: [
              { name: "P1 (Critical)", color: "red" },
              { name: "P2 (High)", color: "orange" },
              { name: "P3 (Normal)", color: "blue" },
              { name: "P4 (Low)", color: "gray" }
            ]
          }
        },
        Urgency: {
          select: {
            options: [
              { name: "Urgent", color: "red" },
              { name: "Not Urgent", color: "blue" }
            ]
          }
        },
        Importance: {
          select: {
            options: [
              { name: "Important", color: "purple" },
              { name: "Not Important", color: "gray" }
            ]
          }
        }
      }
    });
    this.dbMap["Tasks"] = response.id;
  }

  private async createNotesDatabase() {
    console.log("📥 Creating [DB_Notes] (Universal Capture)...");
    const response = await this.notion.databases.create({
      parent: { type: "page_id", page_id: this.parentPageId },
      title: [{ type: "text", text: { content: "📥 Notes & Quick Capture" } }],
      icon: { type: "emoji", emoji: "📥" },
      properties: {
        Title: { title: {} },
        Status: {
          select: {
            options: [
              { name: "📥 Inbox", color: "red" },
              { name: "⚡ In Progress", color: "yellow" },
              { name: "✅ Processed", color: "green" },
              { name: "📦 Evergreen", color: "blue" }
            ]
          }
        },
        Type: {
          select: {
            options: [
              { name: "Quick Thought", color: "yellow" },
              { name: "Meeting Minutes", color: "blue" },
              { name: "Literature & Books", color: "purple" },
              { name: "Web Bookmark", color: "gray" }
            ]
          }
        },
        URL: { url: {} }
      }
    });
    this.dbMap["Notes"] = response.id;
  }

  private async createResourcesDatabase() {
    console.log("📚 Creating [DB_Resources]...");
    const response = await this.notion.databases.create({
      parent: { type: "page_id", page_id: this.parentPageId },
      title: [{ type: "text", text: { content: "📚 Knowledge Resources" } }],
      icon: { type: "emoji", emoji: "📚" },
      properties: {
        Topic: { title: {} },
        Category: {
          select: {
            options: [
              { name: "Software & Tools", color: "blue" },
              { name: "Books & Summaries", color: "purple" },
              { name: "Mental Models", color: "green" },
              { name: "Guides & Swipe Files", color: "orange" }
            ]
          }
        }
      }
    });
    this.dbMap["Resources"] = response.id;
  }

  private async createReviewsDatabase() {
    console.log("🔄 Creating [DB_Reviews]...");
    const response = await this.notion.databases.create({
      parent: { type: "page_id", page_id: this.parentPageId },
      title: [{ type: "text", text: { content: "🔄 Retrospectives & Reviews" } }],
      icon: { type: "emoji", emoji: "🔄" },
      properties: {
        "Review Period": { title: {} },
        Cadence: {
          select: {
            options: [
              { name: "Weekly", color: "blue" },
              { name: "Monthly", color: "purple" },
              { name: "Quarterly", color: "orange" }
            ]
          }
        },
        Date: { date: {} },
        "Key Wins": { rich_text: {} },
        "Friction & Blockers": { rich_text: {} }
      }
    });
    this.dbMap["Reviews"] = response.id;
  }

  private async linkDatabaseRelations() {
    console.log("\n🔗 Establishing Relational Web between databases...");

    // 1. Projects <-> Tasks & Areas
    await this.notion.databases.update({
      database_id: this.dbMap["Projects"],
      properties: {
        Tasks: {
          relation: {
            database_id: this.dbMap["Tasks"],
            type: "dual_property",
            dual_property: {}
          }
        },
        Area: {
          relation: {
            database_id: this.dbMap["Areas"],
            type: "dual_property",
            dual_property: {}
          }
        }
      }
    });

    // 2. Tasks <-> Area
    await this.notion.databases.update({
      database_id: this.dbMap["Tasks"],
      properties: {
        Area: {
          relation: {
            database_id: this.dbMap["Areas"],
            type: "dual_property",
            dual_property: {}
          }
        }
      }
    });

    // 3. Notes <-> Projects & Resources
    await this.notion.databases.update({
      database_id: this.dbMap["Notes"],
      properties: {
        Project: {
          relation: {
            database_id: this.dbMap["Projects"],
            type: "dual_property",
            dual_property: {}
          }
        },
        Resource: {
          relation: {
            database_id: this.dbMap["Resources"],
            type: "dual_property",
            dual_property: {}
          }
        }
      }
    });

    console.log("✅ Relations successfully linked.");
  }

  private async seedInitialContent() {
    console.log("\n🌱 Seeding initial Areas and Starter Tasks...");

    // Seed Areas
    await this.notion.pages.create({
      parent: { database_id: this.dbMap["Areas"] },
      properties: {
        Name: { title: [{ text: { content: "Career & Engineering" } }] },
        Category: { select: { name: "Professional" } },
        Status: { select: { name: "Focusing" } }
      }
    });

    await this.notion.pages.create({
      parent: { database_id: this.dbMap["Areas"] },
      properties: {
        Name: { title: [{ text: { content: "Health & Longevity" } }] },
        Category: { select: { name: "Health & Longevity" } },
        Status: { select: { name: "Maintaining" } }
      }
    });

    // Seed a Welcome Note
    await this.notion.pages.create({
      parent: { database_id: this.dbMap["Notes"] },
      properties: {
        Title: { title: [{ text: { content: "💡 Welcome to your Open Second Brain" } }] },
        Status: { select: { name: "📥 Inbox" } },
        Type: { select: { name: "Quick Thought" } }
      }
    });
  }
}

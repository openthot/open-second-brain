# OpenSecondBrain

An open-source personal knowledge and task management system for Notion, modeled on the P.A.R.A. framework and powered by Notion Formulas 2.0.

[![Duplicate in Notion](https://img.shields.io/badge/Notion-Duplicate%20Template-000000?style=for-the-badge&logo=notion&logoColor=white)](https://subdued-web-348.notion.site/Open-Second-Brain-41755d645777804c8a57e19a692cdd43?pvs=4)
[![License: MIT & CC-BY-4.0](https://img.shields.io/badge/License-MIT%20%2F%20CC--BY--4.0-blue?style=for-the-badge)](LICENSE)

👉 **[Click here to duplicate the template directly into your Notion](https://subdued-web-348.notion.site/Open-Second-Brain-41755d645777804c8a57e19a692cdd43?pvs=4)**

This repository provides:
1. Complete database schemas for Projects, Areas, Resources, Archives, Tasks, Notes, and Reviews.
2. Production-tested Notion Formulas 2.0 snippets for task progress bars, project health scoring, and Eisenhower matrix prioritization.
3. A TypeScript CLI provisioner that creates the entire database structure, properties, and relations via the Notion REST API.
4. A self-contained, single-page static documentation site ready for GitHub Pages.

---

## Architecture Overview

OpenSecondBrain separates state into six relational databases according to actionability:

| Database | Role | Primary Key | Key Relations |
| :--- | :--- | :--- | :--- |
| **`DB_Projects`** | Finite efforts with defined deadlines | `Name` (title) | `Tasks` (1:N), `Area` (N:1), `Notes` (1:N), `Resources` (M:N) |
| **`DB_Areas`** | Long-term spheres of responsibility | `Name` (title) | `Projects` (1:N), `Tasks` (1:N), `Resources` (1:N) |
| **`DB_Resources`** | Reference vaults and evergreen topics | `Topic` (title) | `Notes` (1:N), `Projects` (M:N), `Area` (N:1) |
| **`DB_Tasks`** | Atomic next actions | `Task` (title) | `Project` (N:1), `Area` (N:1), `Sub-tasks` (self 1:N) |
| **`DB_Notes`** | Quick capture inbox & literature notes | `Title` (title) | `Project` (N:1), `Resource` (N:1) |
| **`DB_Reviews`** | Weekly/monthly reflection logs | `Review Period` (title) | `Projects Reviewed` (1:N) |

```
                ┌──────────────┐
                │   DB_Areas   │
                └──────┬───────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
  ┌─────────────┐┌───────────┐┌──────────────┐
  │ DB_Projects ││ DB_Tasks  ││ DB_Resources │
  └──────┬──────┘└───────────┘└──────┬───────┘
         │                           │
         └─────────────┬─────────────┘
                       ▼
                 ┌──────────┐
                 │ DB_Notes │
                 └──────────┘
```

---

## Formulas 2.0 Reference

Notion Formulas 2.0 allows typed functional operations (`let`, `ifs`, `filter`, `map`, `repeat`). Below are the exact expressions used in this template.

### 1. Project Progress Bar (`DB_Projects`)
Calculates the ratio of completed tasks to total tasks linked to the project and renders a 10-character progress bar.

```javascript
let(
  total, prop("Tasks").length(),
  done, prop("Tasks").filter(current.prop("Status") == "Done").length(),
  percent, if(total > 0, round(done / total * 100), 0),
  barLength, 10,
  filled, min(barLength, max(0, round(percent / 10))),
  empty, max(0, barLength - filled),
  if(
    total == 0,
    "⚪ No Tasks Assigned",
    repeat("▓", filled) + repeat("░", empty) + " " + percent + "% (" + done + "/" + total + ")"
  )
)
```

### 2. Project Health Score (`DB_Projects`)
Evaluates deadline proximity against task completion state:

```javascript
let(
  total, prop("Tasks").length(),
  done, prop("Tasks").filter(current.prop("Status") == "Done").length(),
  isDone, prop("Status") == "Completed" or (total > 0 and done == total),
  deadline, prop("Deadline"),
  ifs(
    isDone, "✅ Completed",
    empty(deadline), "⚪ No Deadline",
    let(
      daysRemaining, dateBetween(deadline, now(), "days"),
      ifs(
        daysRemaining < 0, "🔴 Overdue by " + abs(daysRemaining) + "d",
        daysRemaining <= 3, "🟡 Due Soon (" + daysRemaining + "d left)",
        "🟢 On Track"
      )
    )
  )
)
```

### 3. Task Urgency & Overdue Badge (`DB_Tasks`)
Generates status indicators based on due dates relative to current date:

```javascript
let(
  isCompleted, prop("Status") == "Done",
  due, prop("Due Date"),
  ifs(
    isCompleted, "✓ Done",
    empty(due), "🗓️ Unscheduled",
    let(
      diff, dateBetween(due, now(), "days"),
      ifs(
        diff < 0, "⚠️ Overdue (" + abs(diff) + "d ago)",
        diff == 0, "🔥 Due Today",
        diff == 1, "⚡ Tomorrow",
        "📅 " + formatDate(due, "MMM DD")
      )
    )
  )
)
```

### 4. Eisenhower Priority Matrix (`DB_Tasks`)
Maps `Urgency` and `Importance` select properties to the four quadrants:

```javascript
let(
  u, prop("Urgency") == "Urgent",
  i, prop("Importance") == "Important",
  ifs(
    u and i, "🔥 Q1: Do First (Urgent & Important)",
    not(u) and i, "🎯 Q2: Schedule (Important, Not Urgent)",
    u and not(i), "👥 Q3: Delegate (Urgent, Not Important)",
    "🗑️ Q4: Eliminate (Neither)"
  )
)
```

---

## Directory Structure

```
open-second-brain/
├── docs/
│   ├── NOTION_MARKETPLACE_LISTING.md # Official Marketplace copy, SEO pack & deep links
│   ├── NOTION_BUILD_GUIDE.md         # Manual setup guide for Notion UI
│   ├── PARA_METHOD.md                # Breakdown of P.A.R.A. and C.O.D.E.
│   └── MOBILE_QUICK_CAPTURE.md       # iOS Shortcut, Raycast, and Web Clipper setup
├── formulas/                         # Tested raw JavaScript snippets for Notion Formulas 2.0
│   ├── project_progress_bar.js
│   ├── project_health_score.js
│   ├── task_urgency_badge.js
│   └── eisenhower_matrix.js
├── schemas/                          # Declarative JSON schemas for each database
│   ├── projects.json
│   ├── areas.json
│   ├── tasks.json
│   ├── notes.json
│   ├── resources.json
│   └── reviews.json
├── provisioner/                      # TypeScript Notion API provisioner
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── index.ts
│       └── builder.ts
├── index.html                        # Single-page static documentation & link generator
├── SECURITY.md                       # Security policy, credential safety & disclosure
├── CONTRIBUTING.md                   # Community contribution guidelines
├── LICENSE                           # Dual MIT (code) / CC-BY-4.0 (template)
└── README.md
```

---

## Notion Marketplace & Duplication

- **Live One-Click Duplicate Link**:
  ```
  https://subdued-web-348.notion.site/Open-Second-Brain-41755d645777804c8a57e19a692cdd43?pvs=4
  ```
- **Notion Marketplace Canonical Link**:
  ```
  https://www.notion.so/templates/opensecondbrain-para-system
  ```
- **Official Creator Submission Portal**:
  Submit your template to the Notion Marketplace at [notion.so/templates/submit](https://www.notion.so/templates/submit).

See [`docs/NOTION_MARKETPLACE_LISTING.md`](docs/NOTION_MARKETPLACE_LISTING.md) for full SEO listing metadata, visual asset dimensions, and high-converting marketing copy.

---

## Automated Deployment (Notion API)

If you prefer programmatic workspace creation over manual configuration:

### Prerequisites
1. Node.js 18 or higher.
2. A Notion Internal Integration token from [notion.so/my-integrations](https://www.notion.so/my-integrations).
3. A blank Notion page where the integration has been invited (`...` $\to$ `Connect to` $\to$ your integration).

### Execution

```bash
cd provisioner
npm install
cp .env.example .env
```

Configure `.env`:
```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_PARENT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Build and execute the provisioner:
```bash
npm run build
npm start
```

The script will:
1. Create all 6 databases under the designated parent page.
2. Establish two-way relations across all databases.
3. Populate initial starter Areas and sample capture items.

---

## Manual Setup via Notion UI

If you do not want to use an API token, see [`docs/NOTION_BUILD_GUIDE.md`](docs/NOTION_BUILD_GUIDE.md) for a block-by-block layout blueprint, view filters, and column configurations.

---

## GitHub Pages Documentation

A self-contained single-page documentation site is included at `index.html`. To view locally:

```bash
open index.html
```

To deploy on GitHub Pages:
1. Navigate to **Repository Settings** $\to$ **Pages**.
2. Select Source: **Deploy from a branch**.
3. Branch: `main` / `root` (or `/docs`).
4. Save.

---

## License

- **Scripts, tooling, and formulas**: [MIT License](LICENSE)
- **Documentation and Notion schemas**: [Creative Commons Attribution 4.0 International](LICENSE)

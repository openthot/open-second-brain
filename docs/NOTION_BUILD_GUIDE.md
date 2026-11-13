# Manual Notion Build Guide

This manual setup guide provides a step-by-step blueprint for building **OpenSecondBrain** directly inside Notion's user interface. If you prefer not to use the automated TypeScript CLI provisioner, follow these instructions to configure the databases, relational links, rollups, and dashboard cockpit.

---

## Workspace Architecture Summary

The system consists of **6 relational databases** organized by actionability:
1. **`DB_Projects`**: Finite efforts with defined deadlines.
2. **`DB_Areas`**: Long-term spheres of responsibility without end dates.
3. **`DB_Tasks`**: Atomic execution steps linked to Projects and Areas.
4. **`DB_Notes`**: Quick capture inbox, meeting notes, and literature notes.
5. **`DB_Resources`**: Evergreen reference vaults, documentation, and swipe files.
6. **`DB_Reviews`**: Weekly, monthly, and quarterly reflection logs.

---

## Phase 1: Database Creation & Property Setup

Create a new parent page titled **OpenSecondBrain**. Inside this page, create the following 6 inline databases (type `/database inline`):

### 1. Database: `DB_Areas` (🌐 Areas of Life)
- **Title Property**: `Name` (Title)
- **Category** (Select):
  - `Professional` (Blue)
  - `Personal` (Green)
  - `Financial` (Yellow)
  - `Health & Longevity` (Red)
- **Status** (Status):
  - To-do / In-progress / Complete: `Focusing` (Green), `Maintaining` (Blue), `Paused` (Gray)

### 2. Database: `DB_Projects` (🎯 Projects)
- **Title Property**: `Name` (Title)
- **Status** (Status):
  - `Planning` (Yellow)
  - `Active Sprint` (Blue)
  - `On Hold` (Orange)
  - `Completed` (Green)
- **Deadline** (Date): Include time if desired.
- *(Formulas & Relations added in Phase 2)*

### 3. Database: `DB_Tasks` (⚡ Action Tasks)
- **Title Property**: `Task` (Title)
- **Status** (Status):
  - `To Do` (Gray)
  - `In Progress` (Blue)
  - `Blocked` (Red)
  - `Done` (Green)
- **Due Date** (Date)
- **Priority** (Select):
  - `P1 (Critical)` (Red)
  - `P2 (High)` (Orange)
  - `P3 (Normal)` (Blue)
  - `P4 (Low)` (Gray)
- **Urgency** (Select):
  - `Urgent` (Red)
  - `Not Urgent` (Blue)
- **Importance** (Select):
  - `Important` (Purple)
  - `Not Important` (Gray)

### 4. Database: `DB_Notes` (📥 Notes & Quick Capture)
- **Title Property**: `Title` (Title)
- **Status** (Select):
  - `📥 Inbox` (Red)
  - `⚡ In Progress` (Yellow)
  - `✅ Processed` (Green)
  - `📦 Evergreen` (Blue)
- **Type** (Select):
  - `Quick Thought` (Yellow)
  - `Meeting Minutes` (Blue)
  - `Literature & Books` (Purple)
  - `Web Bookmark` (Gray)
- **URL** (URL)
- **Created Time** (Created Time)

### 5. Database: `DB_Resources` (📚 Knowledge Resources)
- **Title Property**: `Topic` (Title)
- **Category** (Select):
  - `Software & Tools` (Blue)
  - `Books & Summaries` (Purple)
  - `Mental Models` (Green)
  - `Guides & Swipe Files` (Orange)

### 6. Database: `DB_Reviews` (🔄 Retrospectives & Reviews)
- **Title Property**: `Review Period` (Title) — e.g. `2026 - W46 Review`
- **Cadence** (Select): `Weekly`, `Monthly`, `Quarterly`
- **Date** (Date)
- **Key Wins** (Text)
- **Friction & Blockers** (Text)

---

## Phase 2: Relational Wiring (Two-Way Links)

Connect the databases by adding **Relation** properties (`/relation`):

1. **`DB_Projects` $\longleftrightarrow$ `DB_Tasks`**:
   - In `DB_Projects`, add Relation $\to$ choose `DB_Tasks`.
   - Enable **Show on DB_Tasks** with synced property name: `Project`.
   - Synced property on `DB_Projects`: `Tasks`.
2. **`DB_Projects` $\longleftrightarrow$ `DB_Areas`**:
   - In `DB_Projects`, add Relation $\to$ choose `DB_Areas`.
   - Enable **Show on DB_Areas** with synced property name: `Projects`.
   - Synced property on `DB_Projects`: `Area`.
3. **`DB_Tasks` $\longleftrightarrow$ `DB_Areas`**:
   - In `DB_Tasks`, add Relation $\to$ choose `DB_Areas`.
   - Enable **Show on DB_Areas** with synced property name: `Tasks`.
   - Synced property on `DB_Tasks`: `Area`.
4. **`DB_Notes` $\longleftrightarrow$ `DB_Projects`**:
   - In `DB_Notes`, add Relation $\to$ choose `DB_Projects`.
   - Synced property on `DB_Projects`: `Notes`.
5. **`DB_Notes` $\longleftrightarrow$ `DB_Resources`**:
   - In `DB_Notes`, add Relation $\to$ choose `DB_Resources`.
   - Synced property on `DB_Resources`: `Notes`.
6. **`DB_Resources` $\longleftrightarrow$ `DB_Projects`**:
   - In `DB_Resources`, add Relation $\to$ choose `DB_Projects`.
   - Synced property on `DB_Projects`: `Resources`.
7. **`DB_Reviews` $\longleftrightarrow$ `DB_Projects`**:
   - In `DB_Reviews`, add Relation $\to$ choose `DB_Projects`.
   - Synced property on `DB_Projects`: `Reviews`.

---

## Phase 3: Add Notion Formulas 2.0

Add the following **Formula** properties (`/formula`):

### 1. Progress Bar in `DB_Projects`
- **Property Name**: `Progress Bar`
- **Formula Code**:
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

### 2. Project Health Score in `DB_Projects`
- **Property Name**: `Health`
- **Formula Code**:
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

### 3. Urgency & Overdue Badge in `DB_Tasks`
- **Property Name**: `Urgency Badge`
- **Formula Code**:
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

### 4. Eisenhower Priority Matrix in `DB_Tasks`
- **Property Name**: `Eisenhower Quadrant`
- **Formula Code**:
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

## Phase 4: Constructing the Dashboard Cockpit

Create a clean landing dashboard on your main page using **Linked Views of Databases** (`/linked view`):

### Section 1: Top Navigation & Quick Capture
- Create a 2-column layout:
  - **Left column**: Callout block with fast links to Areas, Projects, Resources, and Reviews.
  - **Right column**: Linked view of `DB_Notes` filtered by `Status = "📥 Inbox"`. Allows instant triage of incoming notes.

### Section 2: Active Sprints & Project Health
- Add a Linked View of `DB_Projects`:
  - **View Type**: Gallery or Table.
  - **Filter**: `Status != "Completed"`.
  - **Displayed Properties**: `Name`, `Status`, `Deadline`, `Health`, `Progress Bar`, `Area`.

### Section 3: Daily Task Execution (Eisenhower Matrix)
- Add a Linked View of `DB_Tasks`:
  - **Tab 1: Board View (Eisenhower Matrix)**:
    - Group by: `Eisenhower Quadrant`.
    - Filter: `Status != "Done"`.
  - **Tab 2: Today / Due Soon**:
    - Table / List view.
    - Filter: `Due Date` is on or before today, and `Status != "Done"`.
    - Sort: `Due Date` ascending.

---

## Phase 5: Template Lock & Verification

1. Click `...` in the top right corner of each database and select **Lock database** to prevent accidental property tampering.
2. If preparing for Notion Marketplace distribution, see [`docs/NOTION_MARKETPLACE_LISTING.md`](NOTION_MARKETPLACE_LISTING.md).

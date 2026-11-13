# The P.A.R.A. Method in OpenSecondBrain

OpenSecondBrain is built upon the **P.A.R.A. Method** conceptualized by Tiago Forte (author of *Building a Second Brain*). P.A.R.A. categorizes every piece of information in your digital universe into four distinct buckets based on **actionability**, rather than by subject or topic.

---

## The Four Tiers of Actionability

```
ACTIONABLE                                          STATIC
▲                                                        ▲
│  [Projects]      Short-term efforts with fixed goals   │
│  [Areas]         Ongoing domains of responsibility     │
│  [Resources]     Topics or subjects of ongoing interest│
│  [Archives]      Inactive items from the 3 categories  │
▼                                                        ▼
```

### 1. Projects (`DB_Projects`)
- **Definition**: A series of tasks linked to a single goal with a definite deadline.
- **Key Criterion**: Has a finish line. Once achieved, it is marked completed or archived.
- **Examples**:
  - Launch Personal Website v2
  - Complete Q4 Financial Tax Filing
  - Train for Marathon

### 2. Areas (`DB_Areas`)
- **Definition**: Spheres of activity with a standard to maintain over time without an end date.
- **Key Criterion**: Ongoing maintenance rather than completion.
- **Examples**:
  - Health & Fitness
  - Financial Management
  - Career & Professional Development
  - Direct Reports / Management

### 3. Resources (`DB_Resources`)
- **Definition**: Evergreen reference material, topic guides, swipe files, or inspirations that could be useful in the future.
- **Key Criterion**: Reference-oriented, not tied to a deadline or daily responsibility.
- **Examples**:
  - TypeScript Best Practices & Cheatsheets
  - Travel Recommendations & Packing Lists
  - Product Design Inspiration

### 4. Archives
- **Definition**: Inactive items from the three categories above that you want to preserve for history.
- **In OpenSecondBrain**: Archives are handled natively via database filters and status flags (e.g. `Status = "Completed"` or `Category = "Archived"`), keeping your live views lightning-fast.

---

## The C.O.D.E. Workflow

How knowledge moves through OpenSecondBrain on a daily basis:

```
[1. CAPTURE]  ──►  [2. ORGANIZE]  ──►  [3. DISTILL]  ──►  [4. EXPRESS]
Raw thoughts       Inbox triage to       Progressive       Produce output,
URLs & snippets    Project or Area       summarization     ship project
```

1. **Capture (Inbox `DB_Notes`)**:
   - Collect raw ideas, web clips, voice memos, and meeting notes into your central inbox in seconds without worrying about where they belong.
2. **Organize**:
   - Once a day or during weekly reviews, triage items from `DB_Notes` by associating them with an active `DB_Projects` or evergreen `DB_Resources`.
3. **Distill**:
   - Apply progressive summarization: bold key sentences, highlight core takeaways, and distill executive summaries.
4. **Express**:
   - Channel your notes into concrete execution: complete tasks, write articles, deploy software, or ship products.

---

## Weekly & Monthly Review Routine (`DB_Reviews`)

A Second Brain requires periodic hygiene:
1. **Clear the Inbox**: Process every item in `DB_Notes` with `Status = "📥 Inbox"`.
2. **Check Deadlines**: Review the `Health` score of all active `DB_Projects`. Adjust timelines if any are overdue or due soon.
3. **Prioritize Next Actions**: Review `DB_Tasks` in the Eisenhower Matrix view and pick the 3–5 highest leverage items for the upcoming week.
4. **Log Review**: Record key wins and points of friction in `DB_Reviews`.

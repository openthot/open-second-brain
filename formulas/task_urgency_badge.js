/**
 * Notion Formulas 2.0: Task Urgency & Overdue Badge
 * 
 * Dependencies:
 * - Property: `Due Date` (Date)
 * - Property: `Status` (Status)
 */

let(
  isCompleted, prop("Status") == "Done",
  due, prop("Due Date"),
  diff, dateBetween(due, now(), "days"),
  ifs(
    isCompleted, "✓ Done",
    empty(due), "🗓️ Unscheduled",
    diff < 0, "⚠️ Overdue (" + abs(diff) + "d ago)",
    diff == 0, "🔥 Due Today",
    diff == 1, "⚡ Tomorrow",
    "📅 " + formatDate(due, "MMM DD")
  )
)

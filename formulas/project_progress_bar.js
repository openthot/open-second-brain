/**
 * Notion Formulas 2.0: Dynamic Visual Progress Bar
 * 
 * Dependencies:
 * - Relation: `Tasks` (links to DB_Tasks)
 * - Tasks property: `Status` (Status property with "Done" state)
 * 
 * Logic:
 * Calculates completion % of connected tasks and builds an aesthetic ASCII progress bar.
 */

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

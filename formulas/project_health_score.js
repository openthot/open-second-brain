/**
 * Notion Formulas 2.0: Project Health Score
 * 
 * Dependencies:
 * - Relation: `Tasks`
 * - Property: `Deadline` (Date)
 * - Property: `Status` (Status)
 * 
 * Logic:
 * Categorizes health into Completed, Overdue, Due Soon, or On Track.
 */

let(
  total, prop("Tasks").length(),
  done, prop("Tasks").filter(current.prop("Status") == "Done").length(),
  isDone, prop("Status") == "Completed" or (total > 0 and done == total),
  deadline, prop("Deadline"),
  daysRemaining, if(empty(deadline), 999, dateBetween(deadline, now(), "days")),
  ifs(
    isDone, "✅ Completed",
    daysRemaining < 0, "🔴 Overdue by " + abs(daysRemaining) + "d",
    daysRemaining <= 3, "🟡 Due Soon (" + daysRemaining + "d left)",
    "🟢 On Track"
  )
)

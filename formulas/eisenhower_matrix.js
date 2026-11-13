/**
 * Notion Formulas 2.0: Eisenhower Matrix Quadrant Determination
 * 
 * Dependencies:
 * - Property: `Urgency` (Select: "Urgent", "Not Urgent")
 * - Property: `Importance` (Select: "Important", "Not Important")
 */

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

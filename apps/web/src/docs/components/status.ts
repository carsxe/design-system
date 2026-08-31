import { componentDates, type ComponentDates } from "./dates.generated"
import type { ComponentDoc } from "./types"

/** How long a component counts as new, or as recently updated, in days. */
export const RECENT_WINDOW_DAYS = 3

export type ComponentStatus = "new" | "updated"

/**
 * Component docs are keyed by slug, the generated dates by source file name.
 * The import path carries the file name, so it is the more reliable of the two
 * (`d3-charts` documents `d3-chart.tsx`); recipes have neither and get nothing.
 */
function sourceName(doc: ComponentDoc) {
  const fromImport = doc.importPath?.split("/").at(-1)
  return fromImport ?? doc.slug
}

function daysSince(date: string, now: Date) {
  const then = Date.parse(`${date}T00:00:00Z`)
  if (Number.isNaN(then)) return Number.POSITIVE_INFINITY

  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  )
  return Math.floor((today - then) / 86_400_000)
}

export function getComponentDates(
  doc: ComponentDoc
): ComponentDates | undefined {
  return componentDates[sourceName(doc)]
}

/**
 * "new" for a component added inside the window, "updated" for one only
 * changed inside it. New wins: a component built today has also just changed.
 */
export function getComponentStatus(
  doc: ComponentDoc,
  now: Date = new Date()
): ComponentStatus | undefined {
  const dates = getComponentDates(doc)
  if (!dates) return undefined

  if (daysSince(dates.added, now) <= RECENT_WINDOW_DAYS) return "new"
  if (daysSince(dates.updated, now) <= RECENT_WINDOW_DAYS) return "updated"
  return undefined
}

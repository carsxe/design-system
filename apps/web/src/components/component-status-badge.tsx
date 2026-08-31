import { Badge } from "@carsxe/design-system/components/badge"
import { cn } from "@carsxe/design-system/lib/utils"

import {
  RECENT_WINDOW_DAYS,
  type ComponentStatus,
} from "@/docs/components/status"

const labels: Record<ComponentStatus, string> = {
  new: "New",
  updated: "Updated",
}

const titles: Record<ComponentStatus, string> = {
  new: `Added in the last ${RECENT_WINDOW_DAYS} days`,
  updated: `Updated in the last ${RECENT_WINDOW_DAYS} days`,
}

const variants = {
  new: "success",
  updated: "secondary",
} as const

export function ComponentStatusBadge({
  status,
  compact = false,
  className,
}: {
  status: ComponentStatus
  /** Sized down to sit inline with sidebar and list labels. */
  compact?: boolean
  className?: string
}) {
  return (
    <Badge
      variant={variants[status]}
      title={titles[status]}
      className={cn(compact && "h-4 px-1.5 text-[9px]", className)}
    >
      {labels[status]}
    </Badge>
  )
}

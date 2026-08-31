"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"
import { clamp, useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type RatingIcon = React.ComponentType<{ className?: string }>

type RatingGroupProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  count?: number
  allowHalf?: boolean
  /** Lets the current rating be cleared by picking it again or pressing Delete. */
  allowClear?: boolean
  /** Icon for the filled portion of a rating. */
  icon?: RatingIcon
  /** Icon for the empty portion; defaults to `icon`. */
  emptyIcon?: RatingIcon
  orientation?: "horizontal" | "vertical"
  disabled?: boolean
  readOnly?: boolean
  name?: string
}
function RatingGroup({
  value,
  defaultValue = 0,
  onValueChange,
  count = 5,
  allowHalf = false,
  allowClear = false,
  icon,
  emptyIcon,
  orientation = "horizontal",
  disabled,
  readOnly,
  name,
  className,
  ...props
}: RatingGroupProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const FilledIcon = icon ?? StarIcon
  const EmptyIcon = emptyIcon ?? FilledIcon
  const choose = (index: number, event: React.MouseEvent) => {
    if (disabled || readOnly) return
    const rect = event.currentTarget.getBoundingClientRect()
    const next =
      allowHalf && event.clientX - rect.left < rect.width / 2
        ? index - 0.5
        : index
    setCurrent(allowClear && next === current ? 0 : next)
  }
  return (
    <div
      role="radiogroup"
      aria-disabled={disabled}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-readonly={readOnly || undefined}
      data-slot="rating-group"
      className={cn(
        "inline-flex items-center gap-1 data-[orientation=vertical]:flex-col",
        className
      )}
      onKeyDown={(event) => {
        if (disabled || readOnly) return
        const delta =
          event.key === "ArrowRight" || event.key === "ArrowUp"
            ? allowHalf
              ? 0.5
              : 1
            : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? allowHalf
                ? -0.5
                : -1
              : 0
        if (delta) {
          event.preventDefault()
          setCurrent(clamp(current + delta, 0, count))
        } else if (
          allowClear &&
          (event.key === "Delete" || event.key === "Backspace")
        ) {
          event.preventDefault()
          setCurrent(0)
        }
      }}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => {
        const index = i + 1
        const fill = clamp(current - i, 0, 1)
        return (
          <button
            key={index}
            type="button"
            role="radio"
            data-slot="rating-group-item"
            data-fill={fill === 0 ? "empty" : fill === 1 ? "full" : "partial"}
            aria-checked={
              current === index || (allowHalf && current === index - 0.5)
            }
            tabIndex={i === Math.max(0, Math.ceil(current) - 1) ? 0 : -1}
            disabled={disabled}
            onClick={(event) => choose(index, event)}
            className="relative size-8 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <EmptyIcon className="absolute inset-1 size-6" />
            <span
              data-slot="rating-group-item-fill"
              className="absolute inset-1 overflow-hidden"
              style={{ width: `${fill * 75}%` }}
            >
              <FilledIcon className="size-6 fill-warning text-warning" />
            </span>
            <span className="sr-only">
              {index} of {count}
            </span>
          </button>
        )
      })}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  )
}
export { RatingGroup, type RatingGroupProps }

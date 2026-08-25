"use client"

import * as React from "react"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type DateInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  minValue?: string
  maxValue?: string
  disabled?: boolean
  readOnly?: boolean
  name?: string
  locale?: string
}
function DateInput({
  value,
  defaultValue = today(getLocalTimeZone()).toString(),
  onValueChange,
  minValue,
  maxValue,
  disabled,
  readOnly,
  name,
  locale,
  className,
  ...props
}: DateInputProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  let date: CalendarDate
  try {
    date = parseDate(current)
  } catch {
    date = today(getLocalTimeZone())
  }
  const update = (part: "year" | "month" | "day", raw: number) => {
    if (disabled || readOnly || !Number.isFinite(raw)) return
    let next = date.set({ [part]: raw })
    if (minValue && next.compare(parseDate(minValue)) < 0)
      next = parseDate(minValue)
    if (maxValue && next.compare(parseDate(maxValue)) > 0)
      next = parseDate(maxValue)
    setCurrent(next.toString())
  }
  const order = new Intl.DateTimeFormat(locale)
    .formatToParts(new Date(2020, 10, 22))
    .filter(
      (part) =>
        part.type === "year" || part.type === "month" || part.type === "day"
    )
    .map((part) => part.type as "year" | "month" | "day")
  return (
    <div
      role="group"
      data-slot="date-input"
      aria-disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center rounded-2xl border border-border bg-muted px-2 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary",
        className
      )}
      {...props}
    >
      {order.map((part, index) => (
        <React.Fragment key={part}>
          <input
            inputMode="numeric"
            aria-label={part}
            disabled={disabled}
            readOnly={readOnly}
            value={date[part]}
            min={part === "year" ? 1 : 1}
            max={
              part === "month"
                ? 12
                : part === "day"
                  ? date.calendar.getDaysInMonth(date)
                  : 9999
            }
            onChange={(e) => update(part, Number(e.target.value))}
            className={cn(
              "w-9 bg-transparent text-center font-mono text-sm outline-none",
              part === "year" && "w-14"
            )}
          />
          {index < order.length - 1 && (
            <span aria-hidden className="text-muted-foreground">
              /
            </span>
          )}
        </React.Fragment>
      ))}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  )
}
export { DateInput }

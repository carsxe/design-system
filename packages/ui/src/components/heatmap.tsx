"use client"

import * as React from "react"

import { cn } from "@carsxe/design-system/lib/utils"

const CELL = 12
const GAP = 3
const GUTTER_LEFT = 28
const GUTTER_TOP = 18
const EDGE_PAD = 6
const MAX_SCALE = 1.25

const DEFAULT_COLORS = [
  "var(--heatmap-1)",
  "var(--heatmap-2)",
  "var(--heatmap-3)",
  "var(--heatmap-4)",
  "var(--heatmap-5)",
]

const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export type HeatmapDatum = {
  date: string | Date
  value: number
}

export type HeatmapProps = Omit<React.ComponentProps<"div">, "children"> & {
  ariaLabel: string
  data: HeatmapDatum[]
  description?: string
  startDate?: string | Date
  endDate?: string | Date
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  colors?: string[]
  emptyColor?: string
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  onCellSelect?: (datum: { date: Date; value: number }) => void
  emptyMessage?: string
}

type HeatmapCell = {
  date: Date
  key: string
  value: number
  x: number
  y: number
}

type TooltipState = {
  x: number
  y: number
  title: string
  detail?: React.ReactNode
} | null

function parseDay(input: string | Date) {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null
    return new Date(input.getFullYear(), input.getMonth(), input.getDate())
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function dayKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function interactiveProps<T>({
  datum,
  title,
  detail,
  x,
  y,
  setTooltip,
  onSelect,
}: {
  datum: T
  title: string
  detail?: React.ReactNode
  x: number
  y: number
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>
  onSelect?: (datum: T) => void
}) {
  const show = () => setTooltip({ x, y, title, detail })
  return {
    tabIndex: 0,
    role: "button",
    "aria-label": detail ? `${title}: ${String(detail)}` : title,
    onMouseEnter: show,
    onMouseLeave: () => setTooltip(null),
    onFocus: show,
    onBlur: () => setTooltip(null),
    onClick: () => onSelect?.(datum),
    onKeyDown: (event: React.KeyboardEvent<SVGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onSelect?.(datum)
      }
    },
  } as const
}

function Heatmap({
  ariaLabel,
  data,
  description,
  startDate,
  endDate,
  weekStartsOn = 0,
  colors = DEFAULT_COLORS,
  emptyColor = "var(--border)",
  valueFormatter = (value) => value.toLocaleString(),
  showLegend = true,
  onCellSelect,
  emptyMessage,
  className,
  ...props
}: HeatmapProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(640)
  const [tooltip, setTooltip] = React.useState<TooltipState>(null)

  React.useLayoutEffect(() => {
    const element = chartRef.current
    if (!element) return
    const update = () => setWidth(Math.max(element.clientWidth, 280))
    update()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const {
    cells,
    weekdayRows,
    monthLabels,
    maxValue,
    naturalWidth,
    naturalHeight,
  } = React.useMemo(() => {
    const values = new Map<string, number>()
    let minDate: Date | null = null
    let maxDate: Date | null = null
    for (const datum of data) {
      const day = parseDay(datum.date)
      if (!day) continue
      values.set(dayKey(day), datum.value)
      if (!minDate || day < minDate) minDate = day
      if (!maxDate || day > maxDate) maxDate = day
    }

    const empty = {
      cells: [] as HeatmapCell[],
      weekdayRows: [] as { row: number; label: string }[],
      monthLabels: [] as { col: number; label: string }[],
      maxValue: 0,
      naturalWidth: 0,
      naturalHeight: 0,
    }
    const rangeStart = (startDate ? parseDay(startDate) : null) ?? minDate
    const rangeEnd = (endDate ? parseDay(endDate) : null) ?? maxDate
    if (!rangeStart || !rangeEnd || rangeEnd < rangeStart) return empty

    const leadingOffset = (rangeStart.getDay() - weekStartsOn + 7) % 7
    const snappedStart = addDays(rangeStart, -leadingOffset)
    const totalDays =
      Math.round((rangeEnd.getTime() - snappedStart.getTime()) / 86400000) + 1
    const weeks = Math.ceil(totalDays / 7)

    const dayCells: HeatmapCell[] = []
    const columnMonths: (number | null)[] = Array.from(
      { length: weeks },
      () => null
    )
    let peak = 0
    for (let index = 0; index < totalDays; index++) {
      const date = addDays(snappedStart, index)
      if (date < rangeStart) continue
      const col = Math.floor(index / 7)
      const row = index % 7
      const value = values.get(dayKey(date)) ?? 0
      if (value > peak) peak = value
      if (columnMonths[col] === null) columnMonths[col] = date.getMonth()
      dayCells.push({
        date,
        key: dayKey(date),
        value,
        x: GUTTER_LEFT + col * (CELL + GAP),
        y: GUTTER_TOP + row * (CELL + GAP),
      })
    }

    const months: { col: number; label: string }[] = []
    let previousMonth: number | null = null
    let lastLabelCol = -3
    for (let col = 0; col < weeks; col++) {
      const month = columnMonths[col]
      if (month === null) continue
      if (month !== previousMonth && col - lastLabelCol >= 3) {
        months.push({ col, label: MONTH_LABELS[month] ?? "" })
        lastLabelCol = col
      }
      previousMonth = month
    }

    const weekdays: { row: number; label: string }[] = []
    for (let row = 0; row < 7; row++) {
      const weekday = (weekStartsOn + row) % 7
      if (weekday === 1 || weekday === 3 || weekday === 5) {
        weekdays.push({ row, label: DAY_INITIALS[weekday] ?? "" })
      }
    }

    return {
      cells: dayCells,
      weekdayRows: weekdays,
      monthLabels: months,
      maxValue: peak,
      naturalWidth: GUTTER_LEFT + weeks * (CELL + GAP) - GAP + EDGE_PAD,
      naturalHeight: GUTTER_TOP + 7 * (CELL + GAP) - GAP + EDGE_PAD,
    }
  }, [data, startDate, endDate, weekStartsOn])

  const levelCount = Math.max(colors.length, 1)
  const levelFor = (value: number) =>
    value <= 0 || maxValue <= 0
      ? 0
      : Math.max(
          1,
          Math.min(levelCount, Math.ceil((value / maxValue) * levelCount))
        )

  const empty = cells.length === 0
  const scale = empty
    ? 1
    : Math.min(width, naturalWidth * MAX_SCALE) / naturalWidth

  return (
    <div
      ref={chartRef}
      data-slot="heatmap"
      className={cn(
        "relative w-full overflow-hidden border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {empty ? (
        <div className="grid w-full place-items-center px-6 py-10 text-center text-sm text-muted-foreground">
          {emptyMessage ?? "No chart data available."}
        </div>
      ) : (
        <>
          <svg
            role="img"
            aria-label={ariaLabel}
            viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
            className="block h-auto w-full"
            style={{ maxWidth: naturalWidth * MAX_SCALE }}
          >
            <title>{ariaLabel}</title>
            {description ? <desc>{description}</desc> : null}
            {monthLabels.map((month) => (
              <text
                key={`month-${month.col}`}
                x={GUTTER_LEFT + month.col * (CELL + GAP)}
                y={GUTTER_TOP - 6}
                className="fill-muted-foreground text-[9px]"
              >
                {month.label}
              </text>
            ))}
            {weekdayRows.map((weekday) => (
              <text
                key={`weekday-${weekday.row}`}
                x={GUTTER_LEFT - 6}
                y={GUTTER_TOP + weekday.row * (CELL + GAP) + CELL / 2}
                dy="0.35em"
                textAnchor="end"
                className="fill-muted-foreground text-[9px]"
              >
                {weekday.label}
              </text>
            ))}
            {cells.map((cell) => {
              const level = levelFor(cell.value)
              return (
                <rect
                  key={cell.key}
                  x={cell.x}
                  y={cell.y}
                  width={CELL}
                  height={CELL}
                  fill={level === 0 ? emptyColor : colors[level - 1]}
                  className="cursor-pointer outline-none focus-visible:stroke-ring focus-visible:stroke-2"
                  {...interactiveProps({
                    datum: { date: cell.date, value: cell.value },
                    title: cell.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                    detail: valueFormatter(cell.value),
                    x: (cell.x + CELL / 2) * scale,
                    y: cell.y * scale,
                    setTooltip,
                    onSelect: onCellSelect,
                  })}
                />
              )
            })}
          </svg>
          {showLegend ? (
            <div className="flex items-center justify-end gap-1 px-3 pt-1 pb-2.5 text-[11px] text-muted-foreground">
              <span>Less</span>
              {colors.map((color, index) => (
                <span
                  key={`legend-${index}`}
                  aria-hidden="true"
                  className="size-2.5"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
              <span className="ml-1">· up to {valueFormatter(maxValue)}</span>
            </div>
          ) : null}
        </>
      )}
      {tooltip ? (
        <div
          role="status"
          className="pointer-events-none absolute z-10 min-w-28 border border-border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-lg"
          style={{
            left: Math.min(tooltip.x + 12, width - 148),
            top: Math.max(tooltip.y - 12, 8),
          }}
        >
          <p className="font-medium">{tooltip.title}</p>
          {tooltip.detail ? (
            <p className="mt-1 text-muted-foreground">{tooltip.detail}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { Heatmap }

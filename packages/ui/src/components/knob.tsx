"use client"

import * as React from "react"

import { cn } from "@carsxe/design-system/lib/utils"
import { clamp, useControllableState } from "../lib/use-controllable-state"

/** Degrees of travel; the remaining 90° form the gap at the bottom. */
const SWEEP = 270
/** Angle of the arc start, measured from 12 o'clock clockwise. */
const START = 225
const CENTER = 50

type KnobProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Outer diameter in pixels. */
  size?: number
  /** Arc thickness, in the same 100-unit space as the viewBox. */
  strokeWidth?: number
  showValue?: boolean
  /** Replaces the printed value; receives the current value. */
  children?: React.ReactNode | ((value: number) => React.ReactNode)
  valueColor?: string
  rangeColor?: string
  textColor?: string
  disabled?: boolean
  readOnly?: boolean
  name?: string
}

function polarToCartesian(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

function describeArc(radius: number, from: number, to: number) {
  const start = polarToCartesian(radius, from)
  const end = polarToCartesian(radius, to)
  const largeArc = to - from > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

function Knob({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  size = 96,
  strokeWidth = 14,
  showValue = true,
  children,
  valueColor,
  rangeColor,
  textColor,
  disabled,
  readOnly,
  name,
  className,
  style,
  ...props
}: KnobProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const ref = React.useRef<HTMLDivElement>(null)

  const span = max - min
  const fraction = span === 0 ? 0 : clamp((current - min) / span, 0, 1)
  const radius = CENTER - strokeWidth / 2
  const interactive = !disabled && !readOnly

  const commit = (next: number) => {
    setCurrent(clamp(Math.round(next / step) * step, min, max))
  }

  const update = (clientX: number, clientY: number) => {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const angle =
      (Math.atan2(
        clientY - (rect.top + rect.height / 2),
        clientX - (rect.left + rect.width / 2)
      ) *
        180) /
        Math.PI +
      90
    // Measured from the arc start, clockwise.
    const offset = (angle - START + 720) % 360
    if (offset > SWEEP) {
      // Pointer landed in the bottom gap: snap to whichever end is closer.
      commit(offset - SWEEP < 360 - offset ? max : min)
      return
    }
    commit(min + (offset / SWEEP) * span)
  }

  const text =
    typeof children === "function"
      ? children(current)
      : (children ?? String(current))

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={current}
      aria-valuetext={typeof text === "string" ? text : undefined}
      aria-disabled={disabled}
      aria-readonly={readOnly}
      data-slot="knob"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        "relative inline-flex touch-none items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:opacity-50",
        interactive && "cursor-pointer",
        className
      )}
      style={
        {
          width: size,
          height: size,
          "--knob-value": valueColor,
          "--knob-range": rangeColor,
          "--knob-text": textColor,
          ...style,
        } as React.CSSProperties
      }
      onPointerDown={(event) => {
        if (!interactive) return
        // Not every environment implements pointer capture (jsdom does not).
        if (typeof event.currentTarget.setPointerCapture === "function") {
          event.currentTarget.setPointerCapture(event.pointerId)
        }
        update(event.clientX, event.clientY)
      }}
      onPointerMove={(event) => {
        if (
          typeof event.currentTarget.hasPointerCapture === "function" &&
          event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
          update(event.clientX, event.clientY)
        }
      }}
      onKeyDown={(event) => {
        if (!interactive) return
        const delta =
          event.key === "ArrowRight" || event.key === "ArrowUp"
            ? step
            : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? -step
              : event.key === "PageUp"
                ? step * 10
                : event.key === "PageDown"
                  ? step * -10
                  : 0
        if (delta !== 0) {
          event.preventDefault()
          commit(current + delta)
        } else if (event.key === "Home") {
          event.preventDefault()
          commit(min)
        } else if (event.key === "End") {
          event.preventDefault()
          commit(max)
        }
      }}
      {...props}
    >
      <svg
        data-slot="knob-svg"
        viewBox="0 0 100 100"
        className="size-full overflow-visible"
        aria-hidden="true"
      >
        <path
          data-slot="knob-range"
          d={describeArc(radius, START, START + SWEEP)}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-(--knob-range,var(--color-muted))"
        />
        {fraction > 0 && (
          <path
            data-slot="knob-value"
            d={describeArc(radius, START, START + SWEEP * fraction)}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-(--knob-value,var(--color-primary))"
          />
        )}
      </svg>
      {showValue && (
        <span
          data-slot="knob-text"
          className="absolute font-medium text-(--knob-text,var(--color-foreground))"
          style={{ fontSize: Math.round(size * 0.2) }}
        >
          {text}
        </span>
      )}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  )
}

export { Knob, type KnobProps }

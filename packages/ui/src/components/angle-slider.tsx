"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { clamp, useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type AngleSliderProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  name?: string
}
function AngleSlider({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 360,
  step = 1,
  disabled,
  readOnly,
  name,
  className,
  ...props
}: AngleSliderProps) {
  const [angle, setAngle] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const update = (clientX: number, clientY: number) => {
    if (disabled || readOnly || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const degrees =
      ((Math.atan2(
        clientY - (rect.top + rect.height / 2),
        clientX - (rect.left + rect.width / 2)
      ) *
        180) /
        Math.PI +
        450) %
      360
    setAngle(clamp(Math.round(degrees / step) * step, min, max))
  }
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={angle}
      aria-disabled={disabled}
      data-readonly={readOnly || undefined}
      data-slot="angle-slider"
      className={cn(
        "relative size-32 touch-none rounded-full border border-border bg-muted shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        update(event.clientX, event.clientY)
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          update(event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        if (disabled || readOnly) return
        const delta =
          event.key === "ArrowRight" || event.key === "ArrowUp"
            ? step
            : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? -step
              : 0
        if (delta) {
          event.preventDefault()
          setAngle(clamp(angle + delta, min, max))
        } else if (event.key === "Home") setAngle(min)
        else if (event.key === "End") setAngle(max)
      }}
      {...props}
    >
      <motion.div
        data-slot="angle-slider-marker"
        className="absolute top-1/2 left-1/2 h-[44%] w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-primary"
        animate={{ rotate: angle }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 450, damping: 34 }
        }
      >
        <span className="absolute -top-1.5 -left-1.5 size-3.5 rounded-full bg-primary ring-4 ring-primary/15" />
      </motion.div>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm">
        {angle}°
      </span>
      {name && <input type="hidden" name={name} value={angle} />}
    </div>
  )
}
export { AngleSlider }

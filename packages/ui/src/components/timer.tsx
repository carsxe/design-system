"use client"

import * as React from "react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type TimerProps = Omit<React.ComponentProps<"time">, "onChange"> & {
  duration?: number
  elapsed?: number
  defaultElapsed?: number
  onElapsedChange?: (milliseconds: number) => void
  onComplete?: () => void
  running?: boolean
  countdown?: boolean
  interval?: number
  format?: (milliseconds: number) => React.ReactNode
}
function Timer({
  duration = 60_000,
  elapsed,
  defaultElapsed = 0,
  onElapsedChange,
  onComplete,
  running = true,
  countdown = true,
  interval = 100,
  format,
  className,
  ...props
}: TimerProps) {
  const [current, setCurrent] = useControllableState({
    value: elapsed,
    defaultValue: defaultElapsed,
    onChange: onElapsedChange,
  })
  const completed = React.useRef(false)
  const elapsedRef = React.useRef(current)
  elapsedRef.current = current
  React.useEffect(() => {
    if (!running) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      if (now - last >= interval) {
        const next = Math.min(duration, elapsedRef.current + (now - last))
        last = now
        setCurrent(next)
        if (next >= duration && !completed.current) {
          completed.current = true
          onComplete?.()
          return
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, interval, onComplete, running, setCurrent])
  const shown = countdown ? Math.max(0, duration - current) : current
  const defaultFormat = (ms: number) => {
    const total = Math.ceil(ms / 1000)
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
  }
  return (
    <time
      data-slot="timer"
      dateTime={`PT${Math.ceil(shown / 1000)}S`}
      className={cn("font-mono tabular-nums", className)}
      {...props}
    >
      {format ? format(shown) : defaultFormat(shown)}
    </time>
  )
}
export { Timer }

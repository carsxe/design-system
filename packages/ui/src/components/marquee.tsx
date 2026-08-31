"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@carsxe/design-system/lib/utils"

// Fallback for browsers without "scrollend" (Safari < 18.4): resume after
// scroll events have been quiet for this long, so touch momentum can finish.
const RESUME_DEBOUNCE_MS = 150

type MarqueeProps = React.ComponentProps<"div"> & {
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
}
function Marquee({
  children,
  duration = 24,
  reverse = false,
  pauseOnHover = true,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: MarqueeProps) {
  const reduced = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const firstCopyRef = React.useRef<HTMLDivElement>(null)
  const secondCopyRef = React.useRef<HTMLDivElement>(null)
  // Distance between the starts of two adjacent copies: one copy plus the gap.
  const strideRef = React.useRef(0)
  // Float source of truth for the auto-scroll position; scrollLeft rounds.
  const posRef = React.useRef(0)
  const pausedRef = React.useRef(false)
  const hoverRef = React.useRef(false)
  const focusRef = React.useRef(false)
  const waitingResumeRef = React.useRef(false)
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const [paused, setPaused] = React.useState(false)

  const clearResumeTimer = React.useCallback(() => {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const pause = React.useCallback(() => {
    waitingResumeRef.current = false
    clearResumeTimer()
    pausedRef.current = true
    setPaused(true)
  }, [clearResumeTimer])

  const resume = React.useCallback(() => {
    waitingResumeRef.current = false
    clearResumeTimer()
    const container = containerRef.current
    if (container) posRef.current = container.scrollLeft
    pausedRef.current = false
    setPaused(false)
  }, [clearResumeTimer])

  const scheduleResume = React.useCallback(() => {
    waitingResumeRef.current = true
    clearResumeTimer()
    resumeTimerRef.current = setTimeout(resume, RESUME_DEBOUNCE_MS)
  }, [clearResumeTimer, resume])

  const maybeResume = React.useCallback(() => {
    if (!hoverRef.current && !focusRef.current) scheduleResume()
  }, [scheduleResume])

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const first = firstCopyRef.current
    const second = secondCopyRef.current
    if (!container || !first || !second) return
    let initialized = false
    const measure = () => {
      strideRef.current = second.offsetLeft - first.offsetLeft
      if (!initialized && strideRef.current > 0) {
        initialized = true
        posRef.current = strideRef.current
        container.scrollLeft = strideRef.current
      }
    }
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(first)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (reduced) return
    const container = containerRef.current
    if (!container) return
    let raf = 0
    let last: number | null = null
    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dt = last === null ? 0 : Math.min(now - last, 100)
      last = now
      const stride = strideRef.current
      if (pausedRef.current || stride <= 0 || dt === 0) return
      let pos =
        posRef.current + ((reverse ? -1 : 1) * stride * dt) / (duration * 1000)
      if (pos >= 1.5 * stride) pos -= stride
      else if (pos < 0.5 * stride) pos += stride
      posRef.current = pos
      container.scrollLeft = pos
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [duration, reverse, reduced])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const stride = strideRef.current
      if (stride > 0) {
        // Keep the position inside the middle copy so manual scrolling never
        // reaches an edge in either direction.
        if (container.scrollLeft >= 1.5 * stride) container.scrollLeft -= stride
        else if (container.scrollLeft < 0.5 * stride)
          container.scrollLeft += stride
      }
      if (pausedRef.current) {
        posRef.current = container.scrollLeft
        if (waitingResumeRef.current) scheduleResume()
      }
    }
    const handleScrollEnd = () => {
      if (waitingResumeRef.current) resume()
    }
    const handleWheel = (event: WheelEvent) => {
      // Mouse wheels have no horizontal gesture; map the dominant vertical
      // delta onto the strip. Trackpad horizontal deltas scroll natively.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      container.scrollLeft += event.deltaY
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    container.addEventListener("scrollend", handleScrollEnd)
    if (pauseOnHover)
      // React's onWheel is passive and cannot preventDefault.
      container.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      container.removeEventListener("scroll", handleScroll)
      container.removeEventListener("scrollend", handleScrollEnd)
      container.removeEventListener("wheel", handleWheel)
      clearResumeTimer()
    }
  }, [pauseOnHover, resume, scheduleResume, clearResumeTimer])

  return (
    <div
      ref={containerRef}
      data-slot="marquee"
      data-paused={paused || undefined}
      tabIndex={0}
      className={cn(
        "group flex overflow-x-auto overscroll-x-contain",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (!pauseOnHover) return
        hoverRef.current = true
        pause()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        if (!pauseOnHover) return
        hoverRef.current = false
        maybeResume()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (!pauseOnHover) return
        focusRef.current = true
        pause()
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (!pauseOnHover) return
        if (event.currentTarget.contains(event.relatedTarget)) return
        focusRef.current = false
        maybeResume()
      }}
      {...props}
    >
      <div className="flex min-w-max items-center gap-6">
        <div
          ref={firstCopyRef}
          className="flex min-w-max items-center gap-6"
        >
          {children}
        </div>
        <div
          ref={secondCopyRef}
          aria-hidden
          className="flex min-w-max items-center gap-6"
        >
          {children}
        </div>
        <div aria-hidden className="flex min-w-max items-center gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}
export { Marquee }

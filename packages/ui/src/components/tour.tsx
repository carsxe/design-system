"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { XIcon } from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

export type TourStep = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  target?: string | HTMLElement | (() => HTMLElement | null)
  type?: "dialog" | "tooltip" | "floating"
  placement?: "top" | "right" | "bottom" | "left"
}
export type TourApi = {
  steps: TourStep[]
  open: boolean
  setOpen: (open: boolean) => void
  index: number
  setIndex: (index: number) => void
  step?: TourStep
  start: (id?: string, restoreFocusElement?: HTMLElement) => void
  next: () => void
  previous: () => void
  skip: () => void
  close: () => void
  restoreFocusElement: () => HTMLElement | null
}
type UseTourOptions = {
  steps: TourStep[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  stepIndex?: number
  defaultStepIndex?: number
  onStepChange?: (index: number) => void
  onComplete?: () => void
  onSkip?: () => void
}
function useTour({
  steps,
  open,
  defaultOpen = false,
  onOpenChange,
  stepIndex,
  defaultStepIndex = 0,
  onStepChange,
  onComplete,
  onSkip,
}: UseTourOptions): TourApi {
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)
  const [shown, setShown] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [index, setIndex] = useControllableState({
    value: stepIndex,
    defaultValue: defaultStepIndex,
    onChange: onStepChange,
  })
  const close = React.useCallback(() => setShown(false), [setShown])
  return {
    steps,
    open: shown,
    setOpen: setShown,
    index,
    setIndex,
    step: steps[index],
    start: (id, restoreFocusElement) => {
      restoreFocusRef.current =
        restoreFocusElement ?? (document.activeElement as HTMLElement | null)
      const found = id ? steps.findIndex((step) => step.id === id) : 0
      setIndex(found >= 0 ? found : 0)
      setShown(true)
    },
    next: () => {
      if (index >= steps.length - 1) {
        setShown(false)
        onComplete?.()
      } else setIndex(index + 1)
    },
    previous: () => setIndex(Math.max(0, index - 1)),
    skip: () => {
      setShown(false)
      onSkip?.()
    },
    close,
    restoreFocusElement: () => restoreFocusRef.current,
  }
}

const TourContext = React.createContext<{
  tour: TourApi
  rect: DOMRect | null
} | null>(null)
function useTourContext() {
  const context = React.useContext(TourContext)
  if (!context) throw new Error("Tour parts must be used inside Tour")
  return context
}
type TourProps = React.ComponentProps<"div"> & { tour: TourApi }
function Tour({ tour, children, ...props }: TourProps) {
  const [mounted, setMounted] = React.useState(false)
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const previousFocus = React.useRef<HTMLElement | null>(null)
  const tourRef = React.useRef(tour)
  tourRef.current = tour
  React.useEffect(() => setMounted(true), [])
  React.useEffect(() => {
    if (!tour.open) return
    previousFocus.current =
      tourRef.current.restoreFocusElement() ??
      (document.activeElement as HTMLElement)
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") tourRef.current.close()
      if (e.key === "ArrowRight") tourRef.current.next()
      if (e.key === "ArrowLeft") tourRef.current.previous()
    }
    window.addEventListener("keydown", key)
    return () => {
      window.removeEventListener("keydown", key)
      previousFocus.current?.focus()
      previousFocus.current = null
    }
  }, [tour.open])
  React.useEffect(() => {
    if (!tour.open) return
    const resolve = () => {
      const target = tourRef.current.step?.target
      const node =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : typeof target === "function"
            ? target()
            : target
      setRect(node?.getBoundingClientRect() ?? null)
      node?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
    resolve()
    const observer = new ResizeObserver(resolve)
    observer.observe(document.documentElement)
    window.addEventListener("scroll", resolve, true)
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", resolve, true)
    }
  }, [tour.index, tour.open])
  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {tour.open && tour.step && (
        <TourContext.Provider value={{ tour, rect }}>
          <div data-slot="tour" {...props}>
            {children ?? (
              <>
                <TourBackdrop />
                <TourSpotlight />
                <TourPositioner>
                  <TourContent>
                    <TourCloseTrigger />
                    <TourTitle />
                    <TourDescription />
                    <TourProgressText />
                    <TourActions>
                      <TourPreviousTrigger />
                      <TourSkipTrigger />
                      <TourNextTrigger />
                    </TourActions>
                  </TourContent>
                </TourPositioner>
              </>
            )}
          </div>
        </TourContext.Provider>
      )}
    </AnimatePresence>,
    document.body
  )
}
function TourBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      data-slot="tour-backdrop"
      className={cn("fixed inset-0 z-[70] bg-black/45", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      {...props}
    />
  )
}
function TourSpotlight({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const { rect } = useTourContext()
  const reduced = useReducedMotion()
  if (!rect) return null
  return (
    <motion.div
      data-slot="tour-spotlight"
      className={cn(
        "pointer-events-none fixed z-[71] rounded-2xl ring-[9999px] ring-black/45",
        className
      )}
      animate={{
        left: rect.left - 6,
        top: rect.top - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 38 }
      }
      {...props}
    />
  )
}
function TourPositioner({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { rect, tour } = useTourContext()
  const step = tour.step!
  let position: React.CSSProperties = {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  }
  if (rect && step.type !== "dialog") {
    const placement = step.placement ?? "bottom"
    position =
      placement === "bottom"
        ? {
            left: clampPosition(rect.left + rect.width / 2, 180),
            top: rect.bottom + 12,
            transform: "translateX(-50%)",
          }
        : placement === "top"
          ? {
              left: clampPosition(rect.left + rect.width / 2, 180),
              top: rect.top - 12,
              transform: "translate(-50%, -100%)",
            }
          : placement === "right"
            ? {
                left: rect.right + 12,
                top: rect.top + rect.height / 2,
                transform: "translateY(-50%)",
              }
            : {
                left: rect.left - 12,
                top: rect.top + rect.height / 2,
                transform: "translate(-100%, -50%)",
              }
  }
  return (
    <div
      data-slot="tour-positioner"
      className={cn("fixed z-[72]", className)}
      style={{ ...position, ...style }}
      {...props}
    />
  )
}
function clampPosition(value: number, padding: number) {
  return Math.min(innerWidth - padding, Math.max(padding, value))
}
function TourContent({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const reduced = useReducedMotion()
  const { tour } = useTourContext()
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={
        typeof tour.step?.title === "string" ? tour.step.title : undefined
      }
      aria-labelledby={`tour-title-${tour.step?.id}`}
      aria-describedby={
        tour.step?.description ? `tour-description-${tour.step.id}` : undefined
      }
      data-slot="tour-content"
      className={cn(
        "relative w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl",
        className
      )}
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      {...props}
    />
  )
}
function TourTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"h2">) {
  const { tour } = useTourContext()
  return (
    <h2
      id={`tour-title-${tour.step?.id}`}
      data-slot="tour-title"
      className={cn("pr-8 font-heading text-base font-semibold", className)}
      {...props}
    >
      {children ?? tour.step?.title}
    </h2>
  )
}
function TourDescription({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { tour } = useTourContext()
  return (
    <div
      id={`tour-description-${tour.step?.id}`}
      data-slot="tour-description"
      className={cn("mt-2 text-sm leading-6 text-muted-foreground", className)}
      {...props}
    >
      {children ?? tour.step?.description}
    </div>
  )
}
function TourProgressText({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { tour } = useTourContext()
  return (
    <div
      data-slot="tour-progress"
      className={cn("mt-4 text-xs text-muted-foreground", className)}
      {...props}
    >
      Step {tour.index + 1} of {tour.steps.length}
    </div>
  )
}
function TourActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tour-actions"
      className={cn("mt-4 flex items-center justify-end gap-2", className)}
      {...props}
    />
  )
}
const actionClass =
  "inline-flex h-9 items-center justify-center rounded-xl border border-border px-3 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
function TourPreviousTrigger(props: React.ComponentProps<"button">) {
  const { tour } = useTourContext()
  return (
    <button
      type="button"
      disabled={tour.index === 0}
      onClick={tour.previous}
      className={cn(
        actionClass,
        "mr-auto disabled:opacity-40",
        props.className
      )}
      {...props}
    >
      Previous
    </button>
  )
}
function TourNextTrigger(props: React.ComponentProps<"button">) {
  const { tour } = useTourContext()
  return (
    <button
      type="button"
      onClick={tour.next}
      className={cn(
        actionClass,
        "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        props.className
      )}
      {...props}
    >
      {tour.index === tour.steps.length - 1 ? "Finish" : "Next"}
    </button>
  )
}
function TourSkipTrigger(props: React.ComponentProps<"button">) {
  const { tour } = useTourContext()
  return (
    <button
      type="button"
      onClick={tour.skip}
      className={cn(actionClass, props.className)}
      {...props}
    >
      Skip
    </button>
  )
}
function TourCloseTrigger(props: React.ComponentProps<"button">) {
  const { tour } = useTourContext()
  return (
    <button
      type="button"
      aria-label="Close tour"
      onClick={tour.close}
      className={cn(
        "absolute top-3 right-3 size-8 rounded-lg hover:bg-accent",
        props.className
      )}
      {...props}
    >
      <XIcon className="m-auto size-4" />
    </button>
  )
}
export {
  Tour,
  TourActions,
  TourBackdrop,
  TourCloseTrigger,
  TourContent,
  TourDescription,
  TourNextTrigger,
  TourPositioner,
  TourPreviousTrigger,
  TourProgressText,
  TourSkipTrigger,
  TourSpotlight,
  TourTitle,
  useTour,
}

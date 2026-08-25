"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Maximize2Icon, MinusIcon, XIcon } from "lucide-react"
import { clamp, useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

export type FloatingPanelRect = {
  x: number
  y: number
  width: number
  height: number
}
type FloatingPanelProps = Omit<
  React.ComponentProps<typeof motion.div>,
  "onResize" | "children"
> & {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  rect?: FloatingPanelRect
  defaultRect?: FloatingPanelRect
  onRectChange?: (rect: FloatingPanelRect) => void
  title?: React.ReactNode
  draggable?: boolean
  resizable?: boolean
  minSize?: { width: number; height: number }
}
function FloatingPanel({
  open,
  defaultOpen = false,
  onOpenChange,
  rect,
  defaultRect = { x: 24, y: 24, width: 420, height: 320 },
  onRectChange,
  title,
  draggable = true,
  resizable = true,
  minSize = { width: 240, height: 160 },
  children,
  className,
  ...props
}: FloatingPanelProps) {
  const [shown, setShown] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [frame, setFrame] = useControllableState({
    value: rect,
    defaultValue: defaultRect,
    onChange: onRectChange,
  })
  const [stage, setStage] = React.useState<
    "normal" | "minimized" | "maximized"
  >("normal")
  const previous = React.useRef(frame)
  const reduced = useReducedMotion()
  const drag = React.useRef<{
    x: number
    y: number
    frame: FloatingPanelRect
  } | null>(null)
  React.useEffect(() => {
    if (!shown) return
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShown(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [setShown, shown])
  const move = (e: React.PointerEvent, resize = false) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x,
      dy = e.clientY - drag.current.y
    const source = drag.current.frame
    setFrame(
      resize
        ? {
            ...source,
            width: Math.max(minSize.width, source.width + dx),
            height: Math.max(minSize.height, source.height + dy),
          }
        : {
            ...source,
            x: clamp(source.x + dx, 0, Math.max(0, innerWidth - source.width)),
            y: clamp(source.y + dy, 0, Math.max(0, innerHeight - 48)),
          }
    )
  }
  const toggleMax = () => {
    if (stage === "maximized") {
      setFrame(previous.current)
      setStage("normal")
    } else {
      previous.current = frame
      setFrame({
        x: 12,
        y: 12,
        width: innerWidth - 24,
        height: innerHeight - 24,
      })
      setStage("maximized")
    }
  }
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label={typeof title === "string" ? title : "Floating panel"}
          data-slot="floating-panel"
          data-stage={stage}
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: stage === "minimized" ? 48 : frame.height,
          }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 36 }
          }
          className={cn(
            "fixed top-0 left-0 z-50 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl",
            className
          )}
          {...props}
        >
          <div
            data-slot="floating-panel-header"
            className="flex h-12 touch-none items-center border-b border-border px-4"
            onPointerDown={(e) => {
              if (!draggable || stage !== "normal") return
              e.currentTarget.setPointerCapture(e.pointerId)
              drag.current = { x: e.clientX, y: e.clientY, frame }
            }}
            onPointerMove={(e) => move(e)}
            onPointerUp={() => {
              drag.current = null
            }}
          >
            <div className="min-w-0 flex-1 font-heading text-sm font-medium">
              {title}
            </div>
            <button
              type="button"
              aria-label={stage === "minimized" ? "Restore" : "Minimize"}
              onClick={() =>
                setStage(stage === "minimized" ? "normal" : "minimized")
              }
              className="size-8 rounded-lg hover:bg-accent"
            >
              <MinusIcon className="m-auto size-4" />
            </button>
            <button
              type="button"
              aria-label={stage === "maximized" ? "Restore" : "Maximize"}
              onClick={toggleMax}
              className="size-8 rounded-lg hover:bg-accent"
            >
              <Maximize2Icon className="m-auto size-4" />
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShown(false)}
              className="size-8 rounded-lg hover:bg-accent"
            >
              <XIcon className="m-auto size-4" />
            </button>
          </div>
          {stage !== "minimized" && (
            <div
              data-slot="floating-panel-body"
              className="h-[calc(100%-3rem)] overflow-auto p-4"
            >
              {children}
            </div>
          )}
          {resizable && stage === "normal" && (
            <div
              role="separator"
              aria-label="Resize panel"
              className="absolute right-0 bottom-0 size-5 cursor-se-resize touch-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                drag.current = { x: e.clientX, y: e.clientY, frame }
              }}
              onPointerMove={(e) => move(e, true)}
              onPointerUp={() => {
                drag.current = null
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export { FloatingPanel }

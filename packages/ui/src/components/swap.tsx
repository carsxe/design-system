"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@carsxe/design-system/lib/utils"

type SwapProps = React.ComponentProps<"span"> & {
  value: string | number
  children: React.ReactNode
  mode?: "fade" | "scale" | "slide"
}
function Swap({
  value,
  children,
  mode = "fade",
  className,
  ...props
}: SwapProps) {
  const reduced = useReducedMotion()
  const variants =
    reduced || mode === "fade"
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
      : mode === "scale"
        ? {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1.05 },
          }
        : {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -8 },
          }
  return (
    <span
      data-slot="swap"
      className={cn(
        "relative inline-grid overflow-hidden align-middle",
        className
      )}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          className="col-start-1 row-start-1"
          {...variants}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
export { Swap }

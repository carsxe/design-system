"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@carsxe/design-system/lib/utils"

type MarqueeProps = React.ComponentProps<"div"> & {
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
}
function Marquee({
  children,
  duration = 24,
  reverse,
  pauseOnHover = true,
  className,
  ...props
}: MarqueeProps) {
  const reduced = useReducedMotion()
  return (
    <div
      data-slot="marquee"
      data-pauses-on-hover={pauseOnHover || undefined}
      className={cn("group flex overflow-hidden", className)}
      {...props}
    >
      <motion.div
        className="flex min-w-max items-center gap-6 pr-6 group-data-[pauses-on-hover]:group-focus-within:[animation-play-state:paused] group-data-[pauses-on-hover]:group-hover:[animation-play-state:paused]"
        animate={
          reduced ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
        }
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {children}
        <div aria-hidden className="contents">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
export { Marquee }

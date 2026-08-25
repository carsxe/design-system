"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type Step = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}
type StepsProps = Omit<React.ComponentProps<"ol">, "onChange"> & {
  steps: Step[]
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
}
function Steps({
  steps,
  value,
  defaultValue = 0,
  onValueChange,
  orientation = "horizontal",
  className,
  ...props
}: StepsProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const reduced = useReducedMotion()
  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      className={cn(
        "flex gap-3 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const state =
          index < current
            ? "complete"
            : index === current
              ? "current"
              : "upcoming"
        return (
          <li
            key={step.id}
            data-state={state}
            className="group relative flex flex-1 items-start gap-3"
          >
            <button
              type="button"
              disabled={step.disabled}
              aria-current={state === "current" ? "step" : undefined}
              onClick={() => setCurrent(index)}
              className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold outline-none group-data-[state=complete]:border-primary group-data-[state=complete]:text-primary group-data-[state=current]:border-primary group-data-[state=current]:bg-primary group-data-[state=current]:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {state === "complete" ? (
                <CheckIcon className="size-4" />
              ) : (
                index + 1
              )}
            </button>
            <div className="pt-1">
              <div className="text-sm font-medium">{step.title}</div>
              {step.description && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="absolute top-4 left-8 h-px w-[calc(100%-2rem)] bg-border group-data-[orientation=vertical]:hidden">
                <motion.div
                  className="h-full origin-left bg-primary"
                  initial={false}
                  animate={{ scaleX: index < current ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.25 }}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
export { Steps, type Step }

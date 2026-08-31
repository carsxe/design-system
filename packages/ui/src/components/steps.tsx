"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { clamp, useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type Step = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}
type StepsHelpers = {
  steps: Step[]
  /** Index of the active step. */
  index: number
  /** Id of the active step. */
  value?: string
  isFirst: boolean
  isLast: boolean
  linear: boolean
  next: () => void
  prev: () => void
  goTo: (step: number | string) => void
}

type StepsContextValue = {
  steps: Step[]
  index: number
  setIndex: (index: number) => void
  linear: boolean
}

const StepsContext = React.createContext<StepsContextValue | null>(null)

type StepsRootProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  steps: Step[]
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Blocks clicking a step ahead of the current one. */
  linear?: boolean
}

/**
 * Owns the active step for a `Steps` indicator and its panels. `Steps` works
 * standalone too, and keeps its own state when given `value` or `defaultValue`.
 */
function StepsRoot({
  steps,
  value,
  defaultValue = 0,
  onValueChange,
  linear = false,
  className,
  ...props
}: StepsRootProps) {
  const [index, setIndex] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const context = React.useMemo<StepsContextValue>(
    () => ({
      steps,
      index,
      linear,
      setIndex: (next) => setIndex(clamp(next, 0, steps.length - 1)),
    }),
    [steps, index, linear, setIndex]
  )
  return (
    <StepsContext.Provider value={context}>
      <div
        data-slot="steps-root"
        data-linear={linear || undefined}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      />
    </StepsContext.Provider>
  )
}

/** Navigation helpers for the surrounding `StepsRoot`. */
function useSteps(): StepsHelpers {
  const context = React.useContext(StepsContext)
  if (!context) {
    throw new Error("useSteps must be used inside a StepsRoot.")
  }
  const { steps, index, setIndex, linear } = context
  const goTo = (step: number | string) =>
    setIndex(
      typeof step === "number"
        ? step
        : steps.findIndex((entry) => entry.id === step)
    )
  return {
    steps,
    index,
    value: steps.at(index)?.id,
    isFirst: index === 0,
    isLast: index === steps.length - 1,
    linear,
    next: () => setIndex(index + 1),
    prev: () => setIndex(index - 1),
    goTo,
  }
}

type StepsProps = Omit<React.ComponentProps<"ol">, "onChange"> & {
  /** Optional inside a `StepsRoot`, which supplies the steps. */
  steps?: Step[]
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
  /** Blocks clicking a step ahead of the current one. */
  linear?: boolean
}
function Steps({
  steps: stepsProp,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  linear,
  className,
  ...props
}: StepsProps) {
  const context = React.useContext(StepsContext)
  // Own the state unless a root provides it and no state props were given.
  const owned = !context || value !== undefined || defaultValue !== undefined
  const [internal, setInternal] = useControllableState({
    value,
    defaultValue: defaultValue ?? 0,
    onChange: onValueChange,
  })
  const steps = stepsProp ?? context?.steps ?? []
  const current = owned ? internal : context.index
  const setCurrent = (next: number) => {
    if (owned) setInternal(next)
    else {
      context.setIndex(next)
      onValueChange?.(next)
    }
  }
  const isLinear = linear ?? context?.linear ?? false
  const reduced = useReducedMotion()
  const uid = React.useId()
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
        const titleId = `${uid}-${step.id}`
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
              data-slot="steps-trigger"
              // The visible title labels the indicator, which is icon-only once complete.
              aria-labelledby={titleId}
              disabled={step.disabled || (isLinear && index > current)}
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
              <div id={titleId} className="text-sm font-medium">
                {step.title}
              </div>
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
function StepsContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="steps-content"
      className={cn("relative", className)}
      {...props}
    />
  )
}

type StepsPanelProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Id of the step this panel belongs to. */
  step: string
  children?: React.ReactNode | ((helpers: StepsHelpers) => React.ReactNode)
}

/** Inactive panels stay mounted but hidden, so form state survives navigation. */
function StepsPanel({ step, children, className, ...props }: StepsPanelProps) {
  const helpers = useSteps()
  const active = helpers.value === step
  return (
    <div
      data-slot="steps-panel"
      data-state={active ? "active" : "inactive"}
      hidden={!active}
      className={cn("outline-none", className)}
      {...props}
    >
      {typeof children === "function" ? children(helpers) : children}
    </div>
  )
}

export {
  Steps,
  StepsContent,
  StepsPanel,
  StepsRoot,
  useSteps,
  type Step,
  type StepsHelpers,
  type StepsPanelProps,
  type StepsProps,
  type StepsRootProps,
}

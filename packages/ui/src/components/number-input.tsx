"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { clamp, useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}
function NumberInput({
  value,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled,
  readOnly,
  className,
  ...props
}: NumberInputProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const update = (next: number) =>
    setCurrent(
      clamp(
        Number.isFinite(next) ? next : min === -Infinity ? 0 : min,
        min,
        max
      )
    )
  return (
    <div
      data-slot="number-input"
      className={cn(
        "inline-flex h-10 items-stretch rounded-2xl border border-border bg-muted focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease value"
        disabled={disabled || readOnly || current <= min}
        onClick={() => update(current - step)}
        className="flex w-9 items-center justify-center rounded-l-2xl hover:bg-accent disabled:opacity-40"
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        role="spinbutton"
        type="number"
        value={current}
        min={min === -Infinity ? undefined : min}
        max={max === Infinity ? undefined : max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event) => update(event.currentTarget.valueAsNumber)}
        className="w-20 [appearance:textfield] border-x border-border bg-transparent px-2 text-center text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none"
        {...props}
      />
      <button
        type="button"
        aria-label="Increase value"
        disabled={disabled || readOnly || current >= max}
        onClick={() => update(current + step)}
        className="flex w-9 items-center justify-center rounded-r-2xl hover:bg-accent disabled:opacity-40"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  )
}
export { NumberInput }

"use client"

import * as React from "react"
import { converter, formatHex8, parse } from "culori"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

const toHsv = converter("hsv")
type ColorPickerProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  readOnly?: boolean
  swatches?: string[]
  name?: string
}
function ColorPicker({
  value,
  defaultValue = "#065774",
  onValueChange,
  disabled,
  readOnly,
  swatches = [],
  name,
  className,
  ...props
}: ColorPickerProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const parsed = toHsv(
    parse(current) ?? { mode: "rgb", r: 0, g: 0, b: 0 }
  )
  const alpha = parsed.alpha ?? 1
  const update = (candidate: string) => {
    const color = parse(candidate)
    if (color && !disabled && !readOnly) setCurrent(formatHex8(color))
  }
  const setChannel = (
    channel: "h" | "s" | "v" | "alpha",
    channelValue: number
  ) => update(formatHex8({ ...parsed, mode: "hsv", [channel]: channelValue }))
  return (
    <div
      data-slot="color-picker"
      aria-disabled={disabled}
      className={cn(
        "grid w-72 gap-3 rounded-2xl border border-border bg-popover p-4 shadow-lg",
        className
      )}
      {...props}
    >
      <div
        role="img"
        className="h-16 rounded-xl border border-border"
        style={{ background: current }}
        aria-label={`Color preview ${current}`}
      />
      <label className="grid gap-1 text-xs text-muted-foreground">
        Color
        <input
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e) => {
            if (parse(e.target.value)) update(e.target.value)
            else if (!disabled && !readOnly) setCurrent(e.target.value)
          }}
          onBlur={() => {
            if (!parse(current)) setCurrent(defaultValue)
          }}
          className="h-9 rounded-xl border border-border bg-muted px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
        />
      </label>
      {(
        [
          ["h", "Hue", parsed.h, 0, 360],
          ["s", "Saturation", parsed.s, 0, 1],
          ["v", "Brightness", parsed.v, 0, 1],
          ["alpha", "Alpha", alpha, 0, 1],
        ] as const
      ).map(([key, label, channel, min, max]) => (
        <label
          key={key}
          className="grid grid-cols-[5rem_1fr] items-center gap-2 text-xs text-muted-foreground"
        >
          {label}
          <input
            type="range"
            min={min}
            max={max}
            step={key === "h" ? 1 : 0.01}
            value={channel}
            disabled={disabled || readOnly}
            onChange={(e) => setChannel(key, Number(e.target.value))}
            aria-label={label}
            className="accent-primary"
          />
        </label>
      ))}
      {swatches.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Color swatches">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              disabled={disabled || readOnly}
              aria-label={`Use ${swatch}`}
              onClick={() => update(swatch)}
              className="size-7 rounded-full border border-border ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: swatch }}
            />
          ))}
        </div>
      )}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  )
}
export { ColorPicker }

"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

export type ListboxItem = {
  value: string
  label: React.ReactNode
  textValue?: string
  disabled?: boolean
}
type ListboxProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  items: ListboxItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  multiple?: boolean
  disabled?: boolean
  name?: string
}
function Listbox({
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple,
  disabled,
  name,
  className,
  ...props
}: ListboxProps) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [active, setActive] = React.useState(
    Math.max(
      0,
      items.findIndex((item) => !item.disabled)
    )
  )
  const typeahead = React.useRef("")
  const timer = React.useRef<number | undefined>(undefined)
  const choose = (item: ListboxItem) => {
    if (disabled || item.disabled) return
    setSelected(
      multiple
        ? selected.includes(item.value)
          ? selected.filter((v) => v !== item.value)
          : [...selected, item.value]
        : [item.value]
    )
  }
  return (
    <div
      role="listbox"
      aria-multiselectable={multiple || undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      data-slot="listbox"
      className={cn(
        "max-h-72 min-w-48 overflow-auto rounded-2xl border border-border bg-popover p-1 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-activedescendant={
        items[active] ? `listbox-${items[active].value}` : undefined
      }
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault()
          const direction = e.key === "ArrowDown" ? 1 : -1
          let next = active
          do {
            next = (next + direction + items.length) % items.length
          } while (items[next]?.disabled && next !== active)
          setActive(next)
        } else if (e.key === "Home") setActive(0)
        else if (e.key === "End") setActive(items.length - 1)
        else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (items[active]) choose(items[active])
        } else if (e.key.length === 1) {
          window.clearTimeout(timer.current)
          typeahead.current += e.key.toLowerCase()
          const index = items.findIndex(
            (item) =>
              !item.disabled &&
              (item.textValue ?? String(item.label))
                .toLowerCase()
                .startsWith(typeahead.current)
          )
          if (index >= 0) setActive(index)
          timer.current = window.setTimeout(() => {
            typeahead.current = ""
          }, 500)
        }
      }}
      {...props}
    >
      {items.map((item, index) => (
        <div
          id={`listbox-${item.value}`}
          key={item.value}
          role="option"
          aria-selected={selected.includes(item.value)}
          aria-disabled={item.disabled}
          data-active={active === index || undefined}
          onPointerMove={() => !item.disabled && setActive(index)}
          onClick={() => choose(item)}
          className="flex min-h-9 cursor-default items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm outline-none aria-disabled:opacity-40 data-[active]:bg-accent data-[active]:text-accent-foreground"
        >
          <span>{item.label}</span>
          {selected.includes(item.value) && <CheckIcon className="size-4" />}
        </div>
      ))}
      {name &&
        selected.map((entry) => (
          <input key={entry} type="hidden" name={name} value={entry} />
        ))}
    </div>
  )
}
export { Listbox }

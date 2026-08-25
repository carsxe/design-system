"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

export type TreeViewItem = {
  id: string
  label: React.ReactNode
  textValue?: string
  disabled?: boolean
  children?: TreeViewItem[]
}
type TreeViewProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  items: TreeViewItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (value: string[]) => void
  multiple?: boolean
  disabled?: boolean
}
function TreeView({
  items,
  value,
  defaultValue = [],
  onValueChange,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  multiple,
  disabled,
  className,
  ...props
}: TreeViewProps) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [open, setOpen] = useControllableState({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const root = React.useRef<HTMLDivElement>(null)
  const select = (item: TreeViewItem) => {
    if (disabled || item.disabled) return
    setSelected(
      multiple
        ? selected.includes(item.id)
          ? selected.filter((id) => id !== item.id)
          : [...selected, item.id]
        : [item.id]
    )
  }
  const toggle = (id: string) =>
    setOpen(
      open.includes(id) ? open.filter((entry) => entry !== id) : [...open, id]
    )
  const branch = (nodes: TreeViewItem[], level: number) =>
    nodes.map((item) => {
      const isExpanded = open.includes(item.id)
      const hasChildren = !!item.children?.length
      return (
        <div
          key={item.id}
          role="treeitem"
          aria-level={level}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={selected.includes(item.id)}
          aria-disabled={item.disabled}
          tabIndex={
            selected.includes(item.id) || (!selected.length && level === 1)
              ? 0
              : -1
          }
          data-id={item.id}
          className="outline-none"
          onKeyDown={(e) => {
            const visible = Array.from(
              root.current?.querySelectorAll<HTMLElement>("[role=treeitem]") ??
                []
            )
            const index = visible.indexOf(e.currentTarget)
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault()
              visible[index + (e.key === "ArrowDown" ? 1 : -1)]?.focus()
            } else if (e.key === "ArrowRight" && hasChildren) {
              e.preventDefault()
              if (!isExpanded) toggle(item.id)
              else visible[index + 1]?.focus()
            } else if (e.key === "ArrowLeft" && isExpanded) {
              e.preventDefault()
              toggle(item.id)
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              select(item)
            }
          }}
        >
          <div
            className="flex min-h-9 items-center rounded-xl px-2 text-sm hover:bg-accent aria-selected:bg-accent aria-selected:text-primary"
            style={{ paddingInlineStart: `${8 + (level - 1) * 16}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                aria-label={isExpanded ? "Collapse" : "Expand"}
                onClick={() => toggle(item.id)}
                className="mr-1 size-6"
              >
                <ChevronRightIcon
                  className={cn(
                    "m-auto size-4 transition-transform",
                      isExpanded && "rotate-90"
                  )}
                />
              </button>
            ) : (
              <span className="mr-1 size-6" />
            )}
            <button
              type="button"
              disabled={disabled || item.disabled}
              onClick={() => select(item)}
              className="min-w-0 flex-1 text-left outline-none"
            >
              {item.label}
            </button>
          </div>
          {hasChildren && isExpanded && (
            <div role="group">{branch(item.children!, level + 1)}</div>
          )}
        </div>
      )
    })
  return (
    <div
      ref={root}
      role="tree"
      aria-multiselectable={multiple || undefined}
      aria-disabled={disabled}
      data-slot="tree-view"
      className={cn(
        "min-w-56 rounded-2xl border border-border bg-card p-1",
        className
      )}
      {...props}
    >
      {branch(items, 1)}
    </div>
  )
}
export { TreeView }

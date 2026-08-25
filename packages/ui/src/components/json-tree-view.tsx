"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@carsxe/design-system/lib/utils"

type JsonTreeViewProps = React.ComponentProps<"div"> & {
  data: unknown
  defaultExpandedDepth?: number
  renderValue?: (value: unknown, path: string[]) => React.ReactNode
}
function JsonTreeView({
  data,
  defaultExpandedDepth = 1,
  renderValue,
  className,
  ...props
}: JsonTreeViewProps) {
  const seen = new WeakSet<object>()
  const renderNode = (
    value: unknown,
    path: string[],
    depth: number,
    label?: string
  ): React.ReactNode => {
    const complex = value !== null && typeof value === "object"
    if (complex) {
      if (seen.has(value))
        return (
          <div className="pl-5 text-destructive">
            {label && <span className="text-foreground">{label}: </span>}
            [Circular]
          </div>
        )
      seen.add(value)
    }
    if (!complex) {
      const fallback = typeof value === "string" ? `"${value}"` : String(value)
      return (
        <div role="treeitem" tabIndex={-1} className="min-h-6 pl-5">
          <span className="text-primary">{label}</span>
          {label && ": "}
          <span
            className={cn(
              typeof value === "string" ? "text-success" : "text-warning"
            )}
          >
            {renderValue?.(value, path) ?? fallback}
          </span>
        </div>
      )
    }
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <JsonBranch
        key={path.join(".")}
        label={label}
        count={entries.length}
        defaultOpen={depth < defaultExpandedDepth}
      >
        {entries.map(([key, child]) => (
          <React.Fragment key={key}>
            {renderNode(child, [...path, key], depth + 1, key)}
          </React.Fragment>
        ))}
      </JsonBranch>
    )
  }
  return (
    <div
      role="tree"
      data-slot="json-tree-view"
      className={cn(
        "overflow-auto rounded-2xl border border-border bg-card p-3 font-mono text-xs",
        className
      )}
      onKeyDown={(e) => {
        const items = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>("[role=treeitem]")
        )
        const index = items.indexOf(document.activeElement as HTMLElement)
        if (e.key === "ArrowDown") {
          e.preventDefault()
          items[Math.min(items.length - 1, index + 1)]?.focus()
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          items[Math.max(0, index - 1)]?.focus()
        }
      }}
      {...props}
    >
      {renderNode(data, [], 0)}
    </div>
  )
}
function JsonBranch({
  label,
  count,
  defaultOpen,
  children,
}: {
  label?: string
  count: number
  defaultOpen: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div role="treeitem" aria-expanded={open} tabIndex={0}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-6 items-center gap-1 outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <ChevronRightIcon
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
        />
        <span className="text-primary">{label}</span>
        {label && ": "}
        <span className="text-muted-foreground">
          {count ? `{${count}}` : "{}"}
        </span>
      </button>
      {open && (
        <div role="group" className="ml-2 border-l border-border pl-2">
          {children}
        </div>
      )}
    </div>
  )
}
export { JsonTreeView }

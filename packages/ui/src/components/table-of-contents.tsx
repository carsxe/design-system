"use client"

import * as React from "react"
import { cn } from "@carsxe/design-system/lib/utils"

export type TableOfContentsItem = {
  id: string
  title: React.ReactNode
  level?: number
  children?: TableOfContentsItem[]
}
type TableOfContentsProps = React.ComponentProps<"nav"> & {
  items?: TableOfContentsItem[]
  selector?: string
  onActiveChange?: (id: string) => void
}
function TableOfContents({
  items,
  selector = "h2[id], h3[id]",
  onActiveChange,
  className,
  ...props
}: TableOfContentsProps) {
  const [resolved, setResolved] = React.useState<TableOfContentsItem[]>(
    items ?? []
  )
  const [active, setActive] = React.useState("")
  React.useEffect(() => {
    if (!items)
      setResolved(
        Array.from(document.querySelectorAll<HTMLElement>(selector)).map(
          (node) => ({
            id: node.id,
            title: node.textContent,
            level: Number(node.tagName.slice(1)) || 2,
          })
        )
      )
  }, [items, selector])
  React.useEffect(() => {
    const nodes = resolved
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .slice()
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          .find((entry) => entry.isIntersecting)
        if (visible) {
          setActive(visible.target.id)
          onActiveChange?.(visible.target.id)
        }
      },
      { rootMargin: "-10% 0px -75%" }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [onActiveChange, resolved])
  const render = (entries: TableOfContentsItem[]) => (
    <ul className="grid gap-1">
      {entries.map((item) => (
        <li key={item.id}>
          <a
            href={`#${encodeURIComponent(item.id)}`}
            aria-current={active === item.id ? "location" : undefined}
            className="block rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=location]:bg-accent aria-[current=location]:font-medium aria-[current=location]:text-primary"
            style={{
              paddingInlineStart: `${12 + Math.max(0, (item.level ?? 2) - 2) * 12}px`,
            }}
          >
            {item.title}
          </a>
          {item.children && render(item.children)}
        </li>
      ))}
    </ul>
  )
  return (
    <nav
      aria-label="Table of contents"
      data-slot="table-of-contents"
      className={cn("border-l border-border pl-2", className)}
      {...props}
    >
      {render(resolved)}
    </nav>
  )
}
export { TableOfContents }

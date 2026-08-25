import * as React from "react"
import { cn } from "@carsxe/design-system/lib/utils"

type HighlightProps = React.ComponentProps<"span"> & {
  text: string
  query: string | string[]
  matchAll?: boolean
}
function Highlight({
  text,
  query,
  matchAll = true,
  className,
  ...props
}: HighlightProps) {
  const terms = (Array.isArray(query) ? query : [query])
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  if (!terms.length)
    return (
      <span data-slot="highlight" className={className} {...props}>
        {text}
      </span>
    )
  const expression = new RegExp(
    `(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    matchAll ? "gi" : "i"
  )
  const parts = text.split(expression)
  const normalized = new Set(terms.map((term) => term.toLocaleLowerCase()))
  return (
    <span data-slot="highlight" className={className} {...props}>
      {parts.map((part, index) =>
        normalized.has(part.toLocaleLowerCase()) ? (
          <mark
            key={index}
            className={cn("bg-warning-muted text-foreground", className)}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}
export { Highlight }

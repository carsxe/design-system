"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type TagsInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  max?: number
  delimiter?: string
  allowDuplicates?: boolean
  disabled?: boolean
  readOnly?: boolean
  name?: string
  placeholder?: string
}
function TagsInput({
  value,
  defaultValue = [],
  onValueChange,
  max = Infinity,
  delimiter = ",",
  allowDuplicates = false,
  disabled,
  readOnly,
  name,
  placeholder = "Add tag…",
  className,
  ...props
}: TagsInputProps) {
  const [tags, setTags] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [draft, setDraft] = React.useState("")
  const add = (raw: string) => {
    const next = raw.trim()
    if (
      !next ||
      tags.length >= max ||
      (!allowDuplicates && tags.includes(next))
    )
      return
    setTags([...tags, next])
    setDraft("")
  }
  const remove = (index: number) => {
    if (!disabled && !readOnly) setTags(tags.filter((_, i) => i !== index))
  }
  return (
    <div
      data-slot="tags-input"
      aria-disabled={disabled}
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-muted p-1.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary",
        className
      )}
      {...props}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex h-7 items-center gap-1 rounded-xl bg-secondary px-2 text-xs font-medium"
        >
          {tag}
          {!readOnly && (
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              disabled={disabled}
              onClick={() => remove(index)}
            >
              <XIcon className="size-3" />
            </button>
          )}
        </span>
      ))}
      {!readOnly && (
        <input
          value={draft}
          disabled={disabled}
          placeholder={tags.length ? undefined : placeholder}
          onChange={(e) => {
            const next = e.target.value
            if (next.includes(delimiter)) add(next.split(delimiter)[0] ?? "")
            else setDraft(next)
          }}
          onBlur={() => add(draft)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              add(draft)
            } else if (e.key === "Backspace" && !draft && tags.length)
              remove(tags.length - 1)
          }}
          className="h-7 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none"
        />
      )}
      {name &&
        tags.map((tag, index) => (
          <input key={index} type="hidden" name={name} value={tag} />
        ))}
    </div>
  )
}
export { TagsInput }

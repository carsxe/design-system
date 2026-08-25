"use client"

import * as React from "react"
import { CheckIcon, PencilIcon, XIcon } from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

type EditableProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  submitMode?: "enter" | "blur" | "both"
}
function Editable({
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Click to edit",
  disabled,
  readOnly,
  submitMode = "both",
  className,
  ...props
}: EditableProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(current)
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])
  const begin = () => {
    if (!disabled && !readOnly) {
      setDraft(current)
      setEditing(true)
    }
  }
  const submit = () => {
    setCurrent(draft)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(current)
    setEditing(false)
  }
  return (
    <div
      data-slot="editable"
      data-editing={editing || undefined}
      className={cn("flex min-h-10 items-center gap-1", className)}
      {...props}
    >
      {editing ? (
        <>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              if (submitMode === "blur" || submitMode === "both") submit()
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel()
              if (
                e.key === "Enter" &&
                (submitMode === "enter" || submitMode === "both")
              )
                submit()
            }}
            className="h-10 min-w-0 flex-1 rounded-2xl border border-primary bg-card px-3 text-sm ring-1 ring-primary outline-none"
          />
          <button
            type="button"
            aria-label="Save"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submit}
            className="size-9 rounded-xl hover:bg-accent"
          >
            <CheckIcon className="m-auto size-4" />
          </button>
          <button
            type="button"
            aria-label="Cancel"
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancel}
            className="size-9 rounded-xl hover:bg-accent"
          >
            <XIcon className="m-auto size-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={begin}
          className="flex h-10 min-w-0 flex-1 items-center justify-between rounded-2xl px-3 text-left text-sm hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className={cn(!current && "text-muted-foreground")}>
            {current || placeholder}
          </span>
          {!readOnly && <PencilIcon className="size-4 text-muted-foreground" />}
        </button>
      )}
    </div>
  )
}
export { Editable }

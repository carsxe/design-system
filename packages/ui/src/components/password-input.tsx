"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@carsxe/design-system/lib/utils"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
}
function PasswordInput({
  className,
  defaultVisible = false,
  visible,
  onVisibleChange,
  disabled,
  ...props
}: PasswordInputProps) {
  const [internal, setInternal] = React.useState(defaultVisible)
  const shown = visible ?? internal
  const setShown = (next: boolean) => {
    if (visible === undefined) setInternal(next)
    onVisibleChange?.(next)
  }
  return (
    <div data-slot="password-input" className="relative w-full">
      <input
        type={shown ? "text" : "password"}
        disabled={disabled}
        className={cn(
          "h-10 w-full rounded-2xl border border-border bg-muted px-3 pr-10 text-sm outline-none focus-visible:border-primary focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary disabled:text-muted-foreground",
          className
        )}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        onClick={() => setShown(!shown)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {shown ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  )
}
export { PasswordInput }

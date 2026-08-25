"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { cn } from "@carsxe/design-system/lib/utils"

type ClipboardProps = Omit<
  React.ComponentProps<"button">,
  "value" | "onError"
> & {
  value: string
  copiedDuration?: number
  onCopy?: (value: string) => void
  onCopyError?: (error: unknown) => void
}
function Clipboard({
  value,
  copiedDuration = 1500,
  onCopy,
  onCopyError,
  className,
  children,
  ...props
}: ClipboardProps) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), copiedDuration)
    return () => window.clearTimeout(timer)
  }, [copied, copiedDuration])
  async function copy() {
    try {
      if (!window.isSecureContext)
        throw new Error("Clipboard access requires a secure context")
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopy?.(value)
    } catch (error) {
      setCopied(false)
      onCopyError?.(error)
    }
  }
  return (
    <button
      type="button"
      data-slot="clipboard"
      data-copied={copied || undefined}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50",
        className
      )}
      onClick={copy}
      {...props}
    >
      {children ??
        (copied ? (
          <>
            <CheckIcon className="size-4" />
            Copied
          </>
        ) : (
          <>
            <ClipboardIcon className="size-4" />
            Copy
          </>
        ))}
    </button>
  )
}
export { Clipboard }

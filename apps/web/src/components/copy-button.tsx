import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@carsxe/design-system/components/button"

export function CopyButton({
  text,
  label,
  copiedLabel = "Copied",
}: {
  text: string
  label?: string
  copiedLabel?: string
}) {
  const [copied, setCopied] = useState(false)
  const iconOnly = label === undefined

  return (
    <Button
      size={iconOnly ? "icon-xs" : "sm"}
      variant={iconOnly ? "ghost" : "outline"}
      type="button"
      aria-label={iconOnly ? (copied ? copiedLabel : "Copy") : undefined}
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }}
    >
      {iconOnly ? (
        copied ? (
          <CheckIcon />
        ) : (
          <CopyIcon />
        )
      ) : copied ? (
        copiedLabel
      ) : (
        label
      )}
    </Button>
  )
}

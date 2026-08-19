import { useState } from "react"

import { Button } from "@carsxe/design-system/components/button"

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
}: {
  text: string
  label?: string
  copiedLabel?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      size="sm"
      variant="outline"
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? copiedLabel : label}
    </Button>
  )
}

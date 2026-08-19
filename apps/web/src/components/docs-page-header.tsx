import type { ReactNode } from "react"

import { CopyButton } from "@/components/copy-button"

export function DocsPageHeader({
  title,
  description,
  markdown,
}: {
  title: string
  description?: ReactNode
  markdown: string
}) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <CopyButton
          text={markdown}
          label="Copy page"
          copiedLabel="Copied"
        />
      </div>
      {description ? (
        <div className="text-muted-foreground">{description}</div>
      ) : null}
    </header>
  )
}

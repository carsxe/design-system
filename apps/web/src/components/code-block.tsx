import { useEffect, useState } from "react"

import { CopyButton } from "@/components/copy-button"
import { highlightCode } from "@/lib/highlight"

export function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string
  lang?: string
}) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    highlightCode(code, lang).then((result) => {
      if (!cancelled) setHtml(result)
    })
    return () => {
      cancelled = true
    }
  }, [code, lang])

  return (
    <div className="overflow-hidden border border-border bg-muted">
      <div className="flex h-9 items-center justify-end border-b border-border px-1.5">
        <CopyButton text={code} />
      </div>
      <div className="overflow-x-auto p-4">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre
            className={
              lang === "plaintext" || lang === "txt" || lang === "text"
                ? "font-mono text-[13px] leading-relaxed whitespace-pre-wrap"
                : "font-mono text-[13px] leading-relaxed whitespace-pre"
            }
          >
            {code}
          </pre>
        )}
      </div>
    </div>
  )
}

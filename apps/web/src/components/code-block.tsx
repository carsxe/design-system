import { CopyButton } from "@/components/copy-button"

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative border border-border bg-muted">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm">{code}</pre>
    </div>
  )
}

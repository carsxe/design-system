import type { PropRow } from "@/docs/components/types"

export function PropsTable({ rows }: { rows: PropRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Native element props are forwarded. There are no extra variant props.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Prop</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border last:border-0">
              <td className="px-3 py-2 font-mono text-xs">{row.name}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                {row.type}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                {row.defaultValue ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

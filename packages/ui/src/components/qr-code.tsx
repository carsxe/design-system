import * as React from "react"
import { encode } from "uqr"
import { cn } from "@carsxe/design-system/lib/utils"

type QrCodeProps = Omit<React.ComponentProps<"svg">, "children"> & {
  value: string
  size?: number
  foreground?: string
  background?: string
  ecc?: "L" | "M" | "Q" | "H"
  border?: number
  overlay?: React.ReactNode
}
function QrCode({
  value,
  size = 160,
  foreground = "currentColor",
  background = "transparent",
  ecc = "M",
  border = 2,
  overlay,
  className,
  ...props
}: QrCodeProps) {
  const qr = encode(value, { ecc })
  const dimension = qr.size + border * 2
  return (
    <span
      data-slot="qr-code"
      className="relative inline-grid"
      style={{ width: size, height: size }}
    >
      <svg
        role="img"
        aria-label={`QR code for ${value}`}
        viewBox={`0 0 ${dimension} ${dimension}`}
        width={size}
        height={size}
        className={cn("col-start-1 row-start-1", className)}
        shapeRendering="crispEdges"
        {...props}
      >
        <rect width={dimension} height={dimension} fill={background} />
        {qr.data.map((row, y) =>
          row.map((dark, x) =>
            dark ? (
              <rect
                key={`${x}-${y}`}
                x={x + border}
                y={y + border}
                width="1"
                height="1"
                fill={foreground}
              />
            ) : null
          )
        )}
      </svg>
      {overlay && (
        <span
          data-slot="qr-code-overlay"
          className="pointer-events-none col-start-1 row-start-1 place-self-center bg-background p-1"
        >
          {overlay}
        </span>
      )}
    </span>
  )
}
export { QrCode }

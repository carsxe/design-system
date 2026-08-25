"use client"

import * as React from "react"
import { Redo2Icon, RotateCcwIcon, Undo2Icon } from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

export type SignaturePoint = { x: number; y: number; pressure: number }
export type SignaturePath = SignaturePoint[]
export type SignaturePadHandle = {
  clear: () => void
  undo: () => void
  redo: () => void
  toDataURL: (type?: string) => Promise<string>
  toSVG: () => string
}
type SignaturePadProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  paths?: SignaturePath[]
  defaultPaths?: SignaturePath[]
  onPathsChange?: (paths: SignaturePath[]) => void
  disabled?: boolean
  readOnly?: boolean
  stroke?: string
  strokeWidth?: number
  name?: string
  ref?: React.Ref<SignaturePadHandle>
}
function SignaturePad({
  paths,
  defaultPaths = [],
  onPathsChange,
  disabled,
  readOnly,
  stroke = "currentColor",
  strokeWidth = 2,
  name,
  className,
  ref,
  ...props
}: SignaturePadProps) {
  const [value, setValue] = useControllableState({
    value: paths,
    defaultValue: defaultPaths,
    onChange: onPathsChange,
  })
  const [redo, setRedo] = React.useState<SignaturePath[]>([])
  const [drawing, setDrawing] = React.useState<SignaturePath | null>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const point = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pressure || 0.5,
    }
  }
  const pathData = (path: SignaturePath) =>
    path
      .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ")
  const undo = () => {
    const last = value.at(-1)
    if (last) {
      setValue(value.slice(0, -1))
      setRedo([...redo, last])
    }
  }
  const redoPath = () => {
    const last = redo.at(-1)
    if (last) {
      setValue([...value, last])
      setRedo(redo.slice(0, -1))
    }
  }
  const clear = () => {
    setValue([])
    setRedo([])
  }
  const toSVG = () => new XMLSerializer().serializeToString(svgRef.current!)
  const toDataURL = async (type = "image/png") => {
    const svg = toSVG()
    if (type === "image/svg+xml")
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    const canvas = document.createElement("canvas")
    const rect = svgRef.current!.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const image = new Image()
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    await image.decode()
    const context = canvas.getContext("2d")
    context?.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL(type)
  }
  React.useImperativeHandle(ref, () => ({
    clear,
    undo,
    redo: redoPath,
    toDataURL,
    toSVG,
  }))
  return (
    <div
      data-slot="signature-pad"
      className={cn("grid gap-2", className)}
      {...props}
    >
      <svg
        ref={svgRef}
        role="img"
        aria-label="Signature drawing area"
        tabIndex={disabled ? -1 : 0}
        className="h-48 w-full touch-none rounded-2xl border border-border bg-card text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onPointerDown={(e) => {
          if (disabled || readOnly) return
          e.currentTarget.setPointerCapture(e.pointerId)
          setDrawing([point(e)])
        }}
        onPointerMove={(e) => {
          if (drawing && e.currentTarget.hasPointerCapture(e.pointerId))
            setDrawing([...drawing, point(e)])
        }}
        onPointerUp={(e) => {
          if (!drawing) return
          e.currentTarget.releasePointerCapture(e.pointerId)
          setValue([...value, drawing])
          setDrawing(null)
          setRedo([])
        }}
      >
        {[...value, ...(drawing ? [drawing] : [])].map((entry, index) => (
          <path
            key={index}
            d={pathData(entry)}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="flex gap-1">
        <button
          type="button"
          aria-label="Undo"
          disabled={!value.length || disabled || readOnly}
          onClick={undo}
          className="size-9 rounded-xl border border-border hover:bg-accent disabled:opacity-40"
        >
          <Undo2Icon className="m-auto size-4" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          disabled={!redo.length || disabled || readOnly}
          onClick={redoPath}
          className="size-9 rounded-xl border border-border hover:bg-accent disabled:opacity-40"
        >
          <Redo2Icon className="m-auto size-4" />
        </button>
        <button
          type="button"
          aria-label="Clear signature"
          disabled={!value.length || disabled || readOnly}
          onClick={clear}
          className="size-9 rounded-xl border border-border hover:bg-accent disabled:opacity-40"
        >
          <RotateCcwIcon className="m-auto size-4" />
        </button>
      </div>
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}
    </div>
  )
}
export { SignaturePad }

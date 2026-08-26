"use client"

import * as React from "react"
import { Redo2Icon, RotateCcwIcon, Undo2Icon } from "lucide-react"

import { Button } from "@carsxe/design-system/components/button"
import { cn } from "@carsxe/design-system/lib/utils"
import { useControllableState } from "../lib/use-controllable-state"

export type SignaturePoint = { x: number; y: number; pressure: number }
export type SignaturePath = SignaturePoint[]
export type SignatureDrawingOptions = {
  size?: number
  simulatePressure?: boolean
}
export type SignaturePadTranslations = {
  label?: string
  clear?: string
  undo?: string
  redo?: string
  guide?: string
}
export type SignatureDrawDetails = {
  paths: SignaturePath[]
  currentPath: SignaturePath
}
export type SignatureDrawEndDetails = {
  paths: SignaturePath[]
  path: SignaturePath
}
export type SignaturePadHandle = {
  clear: () => void
  undo: () => void
  redo: () => void
  toDataURL: (type?: string, quality?: number) => Promise<string>
  toSVG: () => string
}

export type SignaturePadStateOptions = {
  paths?: SignaturePath[]
  defaultPaths?: SignaturePath[]
  onPathsChange?: (paths: SignaturePath[]) => void
  onDraw?: (details: SignatureDrawDetails) => void
  onDrawEnd?: (details: SignatureDrawEndDetails) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  stroke?: string
  strokeWidth?: number
  drawing?: SignatureDrawingOptions
  translations?: SignaturePadTranslations
}

export type SignaturePadApi = SignaturePadHandle & {
  paths: SignaturePath[]
  currentPath: SignaturePath | null
  empty: boolean
  isDrawing: boolean
  canUndo: boolean
  canRedo: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
  name?: string
  stroke: string
  drawing: Required<SignatureDrawingOptions>
  translations: Required<SignaturePadTranslations>
  ids: {
    root: string
    label: string
    control: string
    segment: string
    input: string
  }
  svgRef: React.RefObject<SVGSVGElement | null>
  startDrawing: (event: React.PointerEvent<SVGSVGElement>) => void
  continueDrawing: (event: React.PointerEvent<SVGSVGElement>) => void
  endDrawing: (event: React.PointerEvent<SVGSVGElement>) => void
  cancelDrawing: (event: React.PointerEvent<SVGSVGElement>) => void
}

const VIEWBOX_WIDTH = 1000
const VIEWBOX_HEIGHT = 300
const DEFAULT_TRANSLATIONS: Required<SignaturePadTranslations> = {
  label: "Signature",
  clear: "Clear signature",
  undo: "Undo signature stroke",
  redo: "Redo signature stroke",
  guide: "Sign above the line",
}

const SignaturePadContext = React.createContext<SignaturePadApi | null>(null)

function useSignaturePadContext() {
  const context = React.useContext(SignaturePadContext)
  if (!context) {
    throw new Error(
      "Signature Pad components must be used within <SignaturePadRoot>."
    )
  }
  return context
}

function pointFromEvent(event: React.PointerEvent<SVGSVGElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / Math.max(rect.width, 1)) * VIEWBOX_WIDTH,
    y: ((event.clientY - rect.top) / Math.max(rect.height, 1)) * VIEWBOX_HEIGHT,
    pressure: event.pressure || 0.5,
  }
}

function useSignaturePad({
  paths,
  defaultPaths = [],
  onPathsChange,
  onDraw,
  onDrawEnd,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  stroke = "currentColor",
  strokeWidth = 2,
  drawing,
  translations,
}: SignaturePadStateOptions = {}): SignaturePadApi {
  const [value, setValue] = useControllableState({
    value: paths,
    defaultValue: defaultPaths,
    onChange: onPathsChange,
  })
  const [redoPaths, setRedoPaths] = React.useState<SignaturePath[]>([])
  const [currentPath, setCurrentPath] = React.useState<SignaturePath | null>(
    null
  )
  const svgRef = React.useRef<SVGSVGElement>(null)
  const baseId = React.useId().replace(/:/g, "")
  const valueRef = React.useRef(value)
  const currentPathRef = React.useRef(currentPath)
  valueRef.current = value
  currentPathRef.current = currentPath

  const resolvedDrawing = React.useMemo(
    () => ({
      size: drawing?.size ?? strokeWidth,
      simulatePressure: drawing?.simulatePressure ?? true,
    }),
    [drawing?.simulatePressure, drawing?.size, strokeWidth]
  )
  const resolvedTranslations = React.useMemo(
    () => ({ ...DEFAULT_TRANSLATIONS, ...translations }),
    [translations]
  )

  const undo = React.useCallback(() => {
    const last = valueRef.current.at(-1)
    if (!last || disabled || readOnly) return
    setValue(valueRef.current.slice(0, -1))
    setRedoPaths((previous) => [...previous, last])
  }, [disabled, readOnly, setValue])

  const redo = React.useCallback(() => {
    if (disabled || readOnly) return
    setRedoPaths((previous) => {
      const last = previous.at(-1)
      if (!last) return previous
      setValue([...valueRef.current, last])
      return previous.slice(0, -1)
    })
  }, [disabled, readOnly, setValue])

  const clear = React.useCallback(() => {
    if (disabled || readOnly) return
    setValue([])
    setRedoPaths([])
    setCurrentPath(null)
  }, [disabled, readOnly, setValue])

  const toSVG = React.useCallback(() => {
    if (!svgRef.current) return ""
    return new XMLSerializer().serializeToString(svgRef.current)
  }, [])

  const toDataURL = React.useCallback(
    async (type = "image/png", quality?: number) => {
      const svg = toSVG()
      if (!svg) return ""
      const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
      if (type === "image/svg+xml") return encoded

      const canvas = document.createElement("canvas")
      canvas.width = VIEWBOX_WIDTH
      canvas.height = VIEWBOX_HEIGHT
      const image = new Image()
      image.src = encoded
      await image.decode()
      canvas.getContext("2d")?.drawImage(image, 0, 0)
      return canvas.toDataURL(type, quality)
    },
    [toSVG]
  )

  const startDrawing = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (disabled || readOnly) return
      event.currentTarget.setPointerCapture(event.pointerId)
      const nextPath = [pointFromEvent(event)]
      currentPathRef.current = nextPath
      setCurrentPath(nextPath)
      onDraw?.({ paths: valueRef.current, currentPath: nextPath })
    },
    [disabled, onDraw, readOnly]
  )

  const continueDrawing = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (
        !currentPathRef.current ||
        !event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        return
      }
      const nextPath = [...currentPathRef.current, pointFromEvent(event)]
      currentPathRef.current = nextPath
      setCurrentPath(nextPath)
      onDraw?.({ paths: valueRef.current, currentPath: nextPath })
    },
    [onDraw]
  )

  const endDrawing = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const completedPath = currentPathRef.current
      if (!completedPath) return
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      const nextPaths = [...valueRef.current, completedPath]
      setValue(nextPaths)
      setCurrentPath(null)
      currentPathRef.current = null
      setRedoPaths([])
      onDrawEnd?.({ paths: nextPaths, path: completedPath })
    },
    [onDrawEnd, setValue]
  )

  const cancelDrawing = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      currentPathRef.current = null
      setCurrentPath(null)
    },
    []
  )

  return React.useMemo(
    () => ({
      paths: value,
      currentPath,
      empty: value.length === 0,
      isDrawing: currentPath !== null,
      canUndo: value.length > 0,
      canRedo: redoPaths.length > 0,
      disabled,
      readOnly,
      required,
      name,
      stroke,
      drawing: resolvedDrawing,
      translations: resolvedTranslations,
      ids: {
        root: `${baseId}-signature-root`,
        label: `${baseId}-signature-label`,
        control: `${baseId}-signature-control`,
        segment: `${baseId}-signature-segment`,
        input: `${baseId}-signature-input`,
      },
      svgRef,
      clear,
      undo,
      redo,
      toDataURL,
      toSVG,
      startDrawing,
      continueDrawing,
      endDrawing,
      cancelDrawing,
    }),
    [
      baseId,
      cancelDrawing,
      clear,
      continueDrawing,
      currentPath,
      disabled,
      endDrawing,
      name,
      readOnly,
      redo,
      redoPaths.length,
      required,
      resolvedDrawing,
      resolvedTranslations,
      startDrawing,
      stroke,
      toDataURL,
      toSVG,
      undo,
      value,
    ]
  )
}

export type SignaturePadRootProviderProps = React.ComponentProps<"div"> & {
  value: SignaturePadApi
}

function SignaturePadRootProvider({
  value,
  className,
  ...props
}: SignaturePadRootProviderProps) {
  return (
    <SignaturePadContext.Provider value={value}>
      <div
        id={value.ids.root}
        data-slot="signature-pad"
        data-scope="signature-pad"
        data-part="root"
        data-disabled={value.disabled ? "" : undefined}
        data-readonly={value.readOnly ? "" : undefined}
        data-empty={value.empty ? "" : undefined}
        className={cn("grid gap-2", className)}
        {...props}
      />
    </SignaturePadContext.Provider>
  )
}

export type SignaturePadRootProps = React.ComponentProps<"div"> &
  SignaturePadStateOptions

function SignaturePadRoot({
  paths,
  defaultPaths,
  onPathsChange,
  onDraw,
  onDrawEnd,
  disabled,
  readOnly,
  required,
  name,
  stroke,
  strokeWidth,
  drawing,
  translations,
  ...props
}: SignaturePadRootProps) {
  const value = useSignaturePad({
    paths,
    defaultPaths,
    onPathsChange,
    onDraw,
    onDrawEnd,
    disabled,
    readOnly,
    required,
    name,
    stroke,
    strokeWidth,
    drawing,
    translations,
  })
  return <SignaturePadRootProvider value={value} {...props} />
}

function SignaturePadLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  const signature = useSignaturePadContext()
  return (
    <label
      id={signature.ids.label}
      htmlFor={signature.ids.segment}
      data-slot="signature-pad-label"
      data-scope="signature-pad"
      data-part="label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function SignaturePadControl({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signature = useSignaturePadContext()
  return (
    <div
      id={signature.ids.control}
      data-slot="signature-pad-control"
      data-scope="signature-pad"
      data-part="control"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function segmentPath(path: SignaturePath, index: number) {
  const point = path[index]
  const previous = path[Math.max(0, index - 1)]
  if (index === 0) return `M${point.x} ${point.y}l0.01 0.01`
  const midpointX = (previous.x + point.x) / 2
  const midpointY = (previous.y + point.y) / 2
  return `M${previous.x} ${previous.y} Q${previous.x} ${previous.y} ${midpointX} ${midpointY} T${point.x} ${point.y}`
}

function SignatureStroke({
  path,
  stroke,
  size,
  simulatePressure,
}: {
  path: SignaturePath
  stroke: string
  size: number
  simulatePressure: boolean
}) {
  return path.map((point, index) => (
    <path
      key={index}
      d={segmentPath(path, index)}
      fill="none"
      stroke={stroke}
      strokeWidth={
        size * (simulatePressure ? 0.5 + Math.max(0.1, point.pressure) : 1)
      }
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  ))
}

function SignaturePadSegment({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  const signature = useSignaturePadContext()
  const allPaths = signature.currentPath
    ? [...signature.paths, signature.currentPath]
    : signature.paths

  return (
    <svg
      ref={signature.svgRef}
      id={signature.ids.segment}
      role="img"
      aria-label={signature.translations.label}
      aria-labelledby={signature.ids.label}
      aria-disabled={signature.disabled || undefined}
      aria-readonly={signature.readOnly || undefined}
      tabIndex={signature.disabled ? -1 : 0}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="none"
      data-slot="signature-pad-segment"
      data-scope="signature-pad"
      data-part="segment"
      className={cn(
        "h-48 w-full touch-none border border-border bg-card text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        signature.disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onPointerDown={signature.startDrawing}
      onPointerMove={signature.continueDrawing}
      onPointerUp={signature.endDrawing}
      onPointerCancel={signature.cancelDrawing}
      {...props}
    >
      {allPaths.map((path, index) => (
        <SignatureStroke
          key={index}
          path={path}
          stroke={signature.stroke}
          size={signature.drawing.size}
          simulatePressure={signature.drawing.simulatePressure}
        />
      ))}
    </svg>
  )
}

function SignaturePadGuide({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signature = useSignaturePadContext()
  return (
    <div
      aria-hidden="true"
      data-slot="signature-pad-guide"
      data-scope="signature-pad"
      data-part="guide"
      className={cn(
        "pointer-events-none absolute inset-x-[8%] bottom-[24%] flex items-end border-b border-dashed border-muted-foreground/45 pb-1 text-[10px] text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? signature.translations.guide}
    </div>
  )
}

function SignaturePadClearTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const signature = useSignaturePadContext()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={signature.translations.clear}
      disabled={signature.empty || signature.disabled || signature.readOnly}
      onClick={signature.clear}
      data-slot="signature-pad-clear-trigger"
      data-scope="signature-pad"
      data-part="clear-trigger"
      className={className}
      {...props}
    >
      {children ?? <RotateCcwIcon />}
    </Button>
  )
}

function SignaturePadUndoTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const signature = useSignaturePadContext()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={signature.translations.undo}
      disabled={!signature.canUndo || signature.disabled || signature.readOnly}
      onClick={signature.undo}
      data-slot="signature-pad-undo-trigger"
      data-scope="signature-pad"
      data-part="undo-trigger"
      className={className}
      {...props}
    >
      {children ?? <Undo2Icon />}
    </Button>
  )
}

function SignaturePadRedoTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const signature = useSignaturePadContext()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={signature.translations.redo}
      disabled={!signature.canRedo || signature.disabled || signature.readOnly}
      onClick={signature.redo}
      data-slot="signature-pad-redo-trigger"
      data-scope="signature-pad"
      data-part="redo-trigger"
      className={className}
      {...props}
    >
      {children ?? <Redo2Icon />}
    </Button>
  )
}

function SignaturePadHiddenInput(
  props: Omit<React.ComponentProps<"input">, "type" | "value">
) {
  const signature = useSignaturePadContext()
  if (!signature.name && !props.name) return null
  return (
    <input
      id={signature.ids.input}
      type="hidden"
      name={signature.name}
      value={JSON.stringify(signature.paths)}
      required={signature.required}
      disabled={signature.disabled}
      data-slot="signature-pad-hidden-input"
      data-scope="signature-pad"
      data-part="hidden-input"
      {...props}
    />
  )
}

function SignaturePadHandleBridge({
  ref,
}: {
  ref?: React.Ref<SignaturePadHandle>
}) {
  const signature = useSignaturePadContext()
  React.useImperativeHandle(ref, () => ({
    clear: signature.clear,
    undo: signature.undo,
    redo: signature.redo,
    toDataURL: signature.toDataURL,
    toSVG: signature.toSVG,
  }))
  return null
}

export type SignaturePadProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "ref"
> &
  SignaturePadStateOptions & {
    label?: React.ReactNode
    ref?: React.Ref<SignaturePadHandle>
  }

function SignaturePad({
  paths,
  defaultPaths,
  onPathsChange,
  onDraw,
  onDrawEnd,
  disabled,
  readOnly,
  required,
  stroke,
  strokeWidth,
  drawing,
  translations,
  name,
  label,
  className,
  ref,
  ...props
}: SignaturePadProps) {
  return (
    <SignaturePadRoot
      paths={paths}
      defaultPaths={defaultPaths}
      onPathsChange={onPathsChange}
      onDraw={onDraw}
      onDrawEnd={onDrawEnd}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      stroke={stroke}
      strokeWidth={strokeWidth}
      drawing={drawing}
      translations={translations}
      name={name}
      className={className}
      {...props}
    >
      <SignaturePadHandleBridge ref={ref} />
      {label ? <SignaturePadLabel>{label}</SignaturePadLabel> : null}
      <SignaturePadControl>
        <SignaturePadSegment />
        <SignaturePadGuide />
      </SignaturePadControl>
      <div className="flex gap-1" data-slot="signature-pad-actions">
        <SignaturePadUndoTrigger />
        <SignaturePadRedoTrigger />
        <SignaturePadClearTrigger />
      </div>
      <SignaturePadHiddenInput />
    </SignaturePadRoot>
  )
}

export {
  SignaturePad,
  SignaturePadClearTrigger,
  SignaturePadControl,
  SignaturePadGuide,
  SignaturePadHiddenInput,
  SignaturePadLabel,
  SignaturePadRedoTrigger,
  SignaturePadRoot,
  SignaturePadRootProvider,
  SignaturePadSegment,
  SignaturePadUndoTrigger,
  useSignaturePad,
}

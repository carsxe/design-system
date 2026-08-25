"use client"

import * as React from "react"
import { clamp, useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"

export type CropRect = { x: number; y: number; width: number; height: number }
export type ImageCropperHandle = {
  reset: () => void
  getCroppedImage: (options?: {
    type?: string
    quality?: number
    output?: "blob" | "dataUrl"
  }) => Promise<Blob | string | null>
}
type ImageCropperProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  src: string
  alt?: string
  crop?: CropRect
  defaultCrop?: CropRect
  onCropChange?: (crop: CropRect) => void
  zoom?: number
  defaultZoom?: number
  onZoomChange?: (zoom: number) => void
  rotation?: number
  defaultRotation?: number
  onRotationChange?: (rotation: number) => void
  flip?: { horizontal?: boolean; vertical?: boolean }
  aspectRatio?: number
  cropShape?: "rectangle" | "circle"
  fixedCropArea?: boolean
  minZoom?: number
  maxZoom?: number
  disabled?: boolean
  ref?: React.Ref<ImageCropperHandle>
}
function ImageCropper({
  src,
  alt = "Image to crop",
  crop,
  defaultCrop = { x: 10, y: 10, width: 80, height: 80 },
  onCropChange,
  zoom,
  defaultZoom = 1,
  onZoomChange,
  rotation,
  defaultRotation = 0,
  onRotationChange,
  flip = {},
  aspectRatio,
  cropShape = "rectangle",
  fixedCropArea,
  minZoom = 1,
  maxZoom = 5,
  disabled,
  ref,
  className,
  ...props
}: ImageCropperProps) {
  const [selection, setSelection] = useControllableState({
    value: crop,
    defaultValue: defaultCrop,
    onChange: onCropChange,
  })
  const [scale, setScale] = useControllableState({
    value: zoom,
    defaultValue: defaultZoom,
    onChange: onZoomChange,
  })
  const [angle, setAngle] = useControllableState({
    value: rotation,
    defaultValue: defaultRotation,
    onChange: onRotationChange,
  })
  const imageRef = React.useRef<HTMLImageElement>(null)
  const drag = React.useRef<{
    x: number
    y: number
    crop: CropRect
    mode: "move" | "resize"
  } | null>(null)
  const reset = () => {
    setSelection(defaultCrop)
    setScale(defaultZoom)
    setAngle(defaultRotation)
  }
  const getCroppedImage = async ({
    type = "image/png",
    quality = 0.92,
    output = "blob",
  }: { type?: string; quality?: number; output?: "blob" | "dataUrl" } = {}) => {
    const image = imageRef.current
    if (!image?.complete) return null
    const sx = (image.naturalWidth * selection.x) / 100,
      sy = (image.naturalHeight * selection.y) / 100,
      sw = (image.naturalWidth * selection.width) / 100,
      sh = (image.naturalHeight * selection.height) / 100
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(sw))
    canvas.height = Math.max(1, Math.round(sh))
    const context = canvas.getContext("2d")
    if (!context) return null
    context.save()
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((angle * Math.PI) / 180)
    context.scale(
      flip.horizontal ? -scale : scale,
      flip.vertical ? -scale : scale
    )
    context.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    )
    context.restore()
    if (output === "dataUrl") return canvas.toDataURL(type, quality)
    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, quality)
    )
  }
  React.useImperativeHandle(ref, () => ({ reset, getCroppedImage }))
  const pointer = (e: React.PointerEvent) => {
    if (!drag.current) return
    const host = e.currentTarget.parentElement!.getBoundingClientRect(),
      dx = ((e.clientX - drag.current.x) / host.width) * 100,
      dy = ((e.clientY - drag.current.y) / host.height) * 100,
      source = drag.current.crop
    if (drag.current.mode === "move")
      setSelection({
        ...source,
        x: clamp(source.x + dx, 0, 100 - source.width),
        y: clamp(source.y + dy, 0, 100 - source.height),
      })
    else {
      const width = clamp(source.width + dx, 5, 100 - source.x)
      let height = clamp(source.height + dy, 5, 100 - source.y)
      if (aspectRatio)
        height = ((width / aspectRatio) * host.width) / host.height
      setSelection({
        ...source,
        width,
        height: clamp(height, 5, 100 - source.y),
      })
    }
  }
  return (
    <div
      data-slot="image-cropper"
      className={cn("grid gap-3", className)}
      {...props}
    >
      <div
        data-slot="image-cropper-viewport"
        className="relative aspect-video overflow-hidden rounded-2xl bg-foreground/10"
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          draggable={false}
          className="size-full object-contain transition-transform"
          style={{
            transform: `scale(${scale * (flip.horizontal ? -1 : 1)}, ${scale * (flip.vertical ? -1 : 1)}) rotate(${angle}deg)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/45"
        />
        <div
          role="group"
          aria-label="Crop selection"
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "absolute touch-none border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,.35)] outline-none focus-visible:ring-2 focus-visible:ring-primary",
            cropShape === "circle" && "rounded-full"
          )}
          style={{
            left: `${selection.x}%`,
            top: `${selection.y}%`,
            width: `${selection.width}%`,
            height: `${selection.height}%`,
          }}
          onPointerDown={(e) => {
            if (disabled || fixedCropArea) return
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = {
              x: e.clientX,
              y: e.clientY,
              crop: selection,
              mode: "move",
            }
          }}
          onPointerMove={pointer}
          onPointerUp={() => {
            drag.current = null
          }}
          onKeyDown={(e) => {
            if (disabled || fixedCropArea) return
            const dx =
                e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0,
              dy = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0
            if (dx || dy) {
              e.preventDefault()
              setSelection({
                ...selection,
                x: clamp(selection.x + dx, 0, 100 - selection.width),
                y: clamp(selection.y + dy, 0, 100 - selection.height),
              })
            }
          }}
        >
          {!fixedCropArea && (
            <button
              type="button"
              aria-label="Resize crop"
              className="absolute -right-2 -bottom-2 size-5 cursor-se-resize rounded-full border-2 border-white bg-primary"
              onPointerDown={(e) => {
                e.stopPropagation()
                e.currentTarget.setPointerCapture(e.pointerId)
                drag.current = {
                  x: e.clientX,
                  y: e.clientY,
                  crop: selection,
                  mode: "resize",
                }
              }}
              onPointerMove={pointer}
              onPointerUp={() => {
                drag.current = null
              }}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs text-muted-foreground">
        <span>Zoom</span>
        <input
          aria-label="Zoom"
          type="range"
          min={minZoom}
          max={maxZoom}
          step="0.01"
          value={scale}
          disabled={disabled}
          onChange={(e) => setScale(Number(e.target.value))}
          className="accent-primary"
        />
        <output>{scale.toFixed(2)}×</output>
        <span>Rotate</span>
        <input
          aria-label="Rotation"
          type="range"
          min="-180"
          max="180"
          value={angle}
          disabled={disabled}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="accent-primary"
        />
        <output>{angle}°</output>
      </div>
    </div>
  )
}
export { ImageCropper }

"use client"

import * as React from "react"
import {
  Chart,
  type ChartConfiguration,
  type InteractionItem,
  type ScriptableContext,
} from "chart.js"
import {
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
} from "chartjs-chart-geo"
import { whereAlpha2, whereAlpha3, whereNumeric } from "iso-3166-1"
import { feature } from "topojson-client"
import type { Feature } from "geojson"
import type {
  GeometryCollection,
  Objects,
  Topology,
} from "topojson-specification"
import worldAtlas from "world-atlas/countries-110m.json"

import { cn } from "@carsxe/design-system/lib/utils"

Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale)

const DEFAULT_COLORS = [
  "color-mix(in srgb, var(--chart-2) 24%, var(--card))",
  "color-mix(in srgb, var(--chart-2) 55%, var(--card))",
  "var(--chart-2)",
  "var(--chart-1)",
  "var(--chart-5)",
]

type AtlasProperties = { name?: string }
type AtlasObjects = Objects<AtlasProperties> & {
  countries: GeometryCollection<AtlasProperties>
  land: GeometryCollection<AtlasProperties>
}

const topology = worldAtlas as unknown as Topology<AtlasObjects>
const countryFeatures = feature(topology, topology.objects.countries).features
const landFeatures = feature(topology, topology.objects.land).features
const atlasIds = new Set(countryFeatures.map((country) => String(country.id)))

export type WorldMapDatum = {
  countryCode: string
  value: number
  label?: string
}

export type WorldMapCountry = WorldMapDatum & {
  name: string
  alpha2: string
  alpha3: string
  numeric: string
}

export type WorldMapChartProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  ariaLabel: string
  data: WorldMapDatum[]
  description?: string
  height?: number
  colors?: string[]
  missingColor?: string
  showLegend?: boolean
  valueFormatter?: (value: number, datum: WorldMapDatum) => string
  selectedCountryCode?: string
  defaultSelectedCountryCode?: string
  onCountrySelect?: (country: WorldMapCountry) => void
  emptyMessage?: string
}

type NormalizedWorldMapDatum = WorldMapCountry & {
  featureIndex: number
}

type TooltipState = {
  country: NormalizedWorldMapDatum
  x: number
  y: number
} | null

function resolveCountry(code: string) {
  const candidate = code.trim()
  if (!candidate) return undefined
  if (/^\d+$/.test(candidate)) {
    return whereNumeric(candidate.padStart(3, "0"))
  }
  if (candidate.length === 2) return whereAlpha2(candidate)
  if (candidate.length === 3) return whereAlpha3(candidate)
  return undefined
}

function normalizeData(data: WorldMapDatum[]) {
  const byNumeric = new Map<string, WorldMapCountry>()
  const order: string[] = []

  for (const datum of data) {
    if (!Number.isFinite(datum.value)) continue
    const country = resolveCountry(datum.countryCode)
    if (!country || !atlasIds.has(country.numeric)) continue
    if (!byNumeric.has(country.numeric)) order.push(country.numeric)
    byNumeric.set(country.numeric, {
      ...datum,
      name: country.country,
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      numeric: country.numeric,
    })
  }

  const featureIndexById = new Map(
    countryFeatures.map((country, index) => [String(country.id), index])
  )

  return order.flatMap((numeric) => {
    const datum = byNumeric.get(numeric)
    const featureIndex = featureIndexById.get(numeric)
    return datum && featureIndex !== undefined
      ? [{ ...datum, featureIndex }]
      : []
  })
}

function normalizeCountryCode(code?: string) {
  if (!code) return undefined
  const country = resolveCountry(code)
  return country && atlasIds.has(country.numeric) ? country.numeric : undefined
}

function resolveCssColor(element: HTMLElement, color: string) {
  const probe = document.createElement("span")
  probe.style.color = color
  probe.style.display = "none"
  element.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved || color
}

function colorForValue(
  value: number,
  min: number,
  max: number,
  colors: string[]
) {
  if (colors.length === 1 || min === max) return colors.at(-1) ?? "transparent"
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const index = Math.min(
    colors.length - 1,
    Math.floor(normalized * colors.length)
  )
  return colors[index]
}

function WorldMapChart({
  ariaLabel,
  data,
  description,
  height = 360,
  colors = DEFAULT_COLORS,
  missingColor = "var(--border)",
  showLegend = true,
  valueFormatter = (value) => value.toLocaleString(),
  selectedCountryCode,
  defaultSelectedCountryCode,
  onCountrySelect,
  emptyMessage,
  className,
  style,
  ...props
}: WorldMapChartProps) {
  const id = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const chartRef = React.useRef<Chart<"choropleth"> | null>(null)
  const [themeRevision, setThemeRevision] = React.useState(0)
  const [tooltip, setTooltip] = React.useState<TooltipState>(null)
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null)
  const [internalSelection, setInternalSelection] = React.useState(() =>
    normalizeCountryCode(defaultSelectedCountryCode)
  )

  const normalizedData = React.useMemo(() => normalizeData(data), [data])
  const hasData = normalizedData.length > 0
  const dataByNumeric = React.useMemo(
    () => new Map(normalizedData.map((datum) => [datum.numeric, datum])),
    [normalizedData]
  )
  const requestedSelectedNumeric =
    selectedCountryCode === undefined
      ? internalSelection
      : normalizeCountryCode(selectedCountryCode)
  const selectedNumeric =
    requestedSelectedNumeric && dataByNumeric.has(requestedSelectedNumeric)
      ? requestedSelectedNumeric
      : undefined
  const values = normalizedData.map((datum) => datum.value)
  const minValue = values.length ? Math.min(...values) : 0
  const maxValue = values.length ? Math.max(...values) : 0
  const instructionsId = `${id}-instructions`
  const descriptionId = description ? `${id}-description` : undefined
  const describedBy = [descriptionId, instructionsId].filter(Boolean).join(" ")

  const resolvedPalette = React.useMemo(() => {
    const root = rootRef.current
    if (!root)
      return {
        colors,
        missingColor,
        border: missingColor,
        selected: colors.at(-1) ?? missingColor,
      }
    const usableColors = colors.length ? colors : DEFAULT_COLORS
    return {
      colors: usableColors.map((color) => resolveCssColor(root, color)),
      missingColor: resolveCssColor(root, missingColor),
      border: resolveCssColor(root, "var(--card)"),
      selected: resolveCssColor(root, "var(--primary)"),
    }
  }, [colors, missingColor, themeRevision])

  const hidePreview = React.useCallback(() => {
    setTooltip(null)
    setPreviewIndex(null)
    chartRef.current?.setActiveElements([])
    chartRef.current?.update("none")
  }, [])

  const showPreview = React.useCallback(
    (dataIndex: number, x?: number, y?: number) => {
      const country = normalizedData[dataIndex]
      const chart = chartRef.current
      if (!chart) return
      const element = chart.getDatasetMeta(0).data[country.featureIndex] as
        GeoFeature | undefined
      const center = element?.getCenterPoint()
      chart.setActiveElements([
        { datasetIndex: 0, index: country.featureIndex },
      ])
      chart.update("none")
      setPreviewIndex(dataIndex)
      setTooltip({
        country,
        x: x ?? center?.x ?? 0,
        y: y ?? center?.y ?? 0,
      })
    },
    [normalizedData]
  )

  const selectCountry = React.useCallback(
    (country: NormalizedWorldMapDatum) => {
      if (selectedCountryCode === undefined)
        setInternalSelection(country.numeric)
      onCountrySelect?.({
        countryCode: country.countryCode,
        value: country.value,
        label: country.label,
        name: country.name,
        alpha2: country.alpha2,
        alpha3: country.alpha3,
        numeric: country.numeric,
      })
    },
    [onCountrySelect, selectedCountryCode]
  )

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || chartRef.current || !hasData) return

    const config: ChartConfiguration<"choropleth"> = {
      type: "choropleth",
      data: { labels: [], datasets: [{ label: ariaLabel, data: [] }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        events: [],
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          projection: {
            axis: "x",
            projection: "equalEarth",
            padding: 8,
          },
          color: { axis: "x", display: false },
        },
      },
    }

    chartRef.current = new Chart(canvas, config)
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [hasData])

  React.useLayoutEffect(() => {
    setThemeRevision((revision) => revision + 1)
  }, [])

  React.useEffect(() => {
    const chart = chartRef.current
    if (!chart || !normalizedData.length) return

    const dataset = chart.data.datasets[0]
    chart.data.labels = countryFeatures.map(
      (country) => country.properties.name ?? "Unknown country"
    )
    dataset.label = ariaLabel
    dataset.data = countryFeatures.map((country) => ({
      feature: country,
      value: dataByNumeric.get(String(country.id))?.value ?? Number.NaN,
    }))
    dataset.outline = landFeatures
    dataset.showOutline = true
    dataset.showGraticule = false
    dataset.outlineBackgroundColor = null
    dataset.outlineBorderColor = resolvedPalette.border
    dataset.outlineBorderWidth = 1
    dataset.backgroundColor = (context: ScriptableContext<"choropleth">) => {
      const raw = context.raw as
        { feature?: Feature; value?: number } | undefined
      const value = raw?.value
      return typeof value === "number" && Number.isFinite(value)
        ? colorForValue(value, minValue, maxValue, resolvedPalette.colors)
        : resolvedPalette.missingColor
    }
    dataset.borderColor = (context: ScriptableContext<"choropleth">) => {
      const raw = context.raw as { feature?: Feature } | undefined
      return String(raw?.feature?.id) === selectedNumeric
        ? resolvedPalette.selected
        : resolvedPalette.border
    }
    dataset.borderWidth = (context: ScriptableContext<"choropleth">) => {
      const raw = context.raw as { feature?: Feature } | undefined
      return String(raw?.feature?.id) === selectedNumeric ? 2.5 : 0.65
    }
    dataset.hoverBorderColor = resolvedPalette.selected
    dataset.hoverBorderWidth = 2
    chart.update("none")
  }, [
    ariaLabel,
    dataByNumeric,
    maxValue,
    minValue,
    normalizedData.length,
    resolvedPalette,
    selectedNumeric,
  ])

  React.useEffect(() => {
    const observer = new MutationObserver(() =>
      setThemeRevision((revision) => revision + 1)
    )
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (previewIndex !== null && previewIndex >= normalizedData.length) {
      hidePreview()
    }
  }, [hidePreview, normalizedData.length, previewIndex])

  const countryFromElements = React.useCallback(
    (elements: InteractionItem[] | undefined) => {
      const element = elements?.[0]
      if (!element) return undefined
      const countryFeature = countryFeatures.at(element.index)
      if (!countryFeature) return undefined
      const featureId = String(countryFeature.id)
      return dataByNumeric.get(featureId)
    },
    [dataByNumeric]
  )

  const hitTest = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const chart = chartRef.current
      if (!chart) return []
      return chart.getElementsAtEventForMode(
        event.nativeEvent,
        "nearest",
        { intersect: true },
        false
      )
    },
    []
  )

  const handlePointerMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const country = countryFromElements(hitTest(event))
    if (!country) {
      if (tooltip || previewIndex !== null) hidePreview()
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const dataIndex = normalizedData.findIndex(
      (datum) => datum.numeric === country.numeric
    )
    if (dataIndex === -1) return
    showPreview(dataIndex, event.clientX - rect.left, event.clientY - rect.top)
  }

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const country = countryFromElements(hitTest(event))
    if (country) selectCountry(country)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!normalizedData.length) return
    let nextIndex = previewIndex ?? -1

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex =
        (nextIndex + 1 + normalizedData.length) % normalizedData.length
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (nextIndex - 1 + normalizedData.length) % normalizedData.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = normalizedData.length - 1
    } else if (event.key === "Enter" || event.key === " ") {
      const country = normalizedData[previewIndex ?? 0]
      event.preventDefault()
      selectCountry(country)
      showPreview(previewIndex ?? 0)
      return
    } else if (event.key === "Escape") {
      event.preventDefault()
      hidePreview()
      return
    } else {
      return
    }

    event.preventDefault()
    showPreview(nextIndex)
  }

  const usableColors = colors.length ? colors : DEFAULT_COLORS
  const minDatum = normalizedData.find((datum) => datum.value === minValue)
  const maxDatum = normalizedData.find((datum) => datum.value === maxValue)

  return (
    <div
      ref={rootRef}
      data-slot="world-map-chart"
      className={cn(
        "relative flex w-full flex-col overflow-hidden border border-border bg-card text-card-foreground",
        className
      )}
      style={{ height, ...style }}
      {...props}
    >
      {description ? (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      ) : null}
      <p id={instructionsId} className="sr-only">
        Use the arrow keys to preview countries. Press Enter or Space to select
        one. Press Escape to dismiss the preview.
      </p>

      {hasData ? (
        <>
          <div className="relative min-h-0 flex-1 p-2 sm:p-3">
            <canvas
              ref={canvasRef}
              role="img"
              tabIndex={0}
              aria-label={ariaLabel}
              aria-describedby={describedBy}
              className="size-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              onMouseMove={handlePointerMove}
              onMouseLeave={hidePreview}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
            />
            {tooltip ? (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-10 min-w-32 border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
                style={{
                  left: `clamp(8px, ${tooltip.x + 18}px, calc(100% - 152px))`,
                  top: `clamp(8px, ${tooltip.y + 6}px, calc(100% - 64px))`,
                }}
              >
                <p className="font-medium">
                  {tooltip.country.label ?? tooltip.country.name}
                </p>
                <p className="mt-1 font-mono text-muted-foreground tabular-nums">
                  {valueFormatter(tooltip.country.value, tooltip.country)}
                </p>
              </div>
            ) : null}
          </div>

          {showLegend ? (
            <div
              aria-hidden="true"
              className="grid grid-cols-[auto_minmax(96px,220px)_auto] items-center gap-3 border-t border-border px-3 py-2.5 text-[11px] text-muted-foreground"
            >
              {minValue === maxValue ? (
                <>
                  <span />
                  <div className="flex items-center gap-2 justify-self-center">
                    <span
                      className="h-1.5 w-16"
                      style={{ background: usableColors.at(-1) }}
                    />
                    <span className="font-mono tabular-nums">
                      {minDatum
                        ? valueFormatter(minValue, minDatum)
                        : minValue.toLocaleString()}
                    </span>
                  </div>
                  <span />
                </>
              ) : (
                <>
                  <span className="font-mono tabular-nums">
                    {minDatum
                      ? valueFormatter(minValue, minDatum)
                      : minValue.toLocaleString()}
                  </span>
                  <span className="flex h-1.5 overflow-hidden">
                    {usableColors.map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className="h-full flex-1"
                        style={{ background: color }}
                      />
                    ))}
                  </span>
                  <span className="font-mono tabular-nums">
                    {maxDatum
                      ? valueFormatter(maxValue, maxDatum)
                      : maxValue.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <div className="grid size-full place-items-center px-6 text-center text-sm text-muted-foreground">
          {emptyMessage ?? "No map data available."}
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        {tooltip
          ? `${tooltip.country.label ?? tooltip.country.name}: ${valueFormatter(tooltip.country.value, tooltip.country)}`
          : ""}
      </div>
    </div>
  )
}

export { WorldMapChart }

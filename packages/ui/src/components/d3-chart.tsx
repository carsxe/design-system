"use client"

import * as React from "react"
import {
  arc,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  hierarchy,
  type HierarchyRectangularNode,
  partition,
  scaleOrdinal,
  schemeTableau10,
  treemap,
  treemapSquarify,
} from "d3"
import {
  sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey"

import { cn } from "@carsxe/design-system/lib/utils"

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type D3ChartBaseProps = Omit<React.ComponentProps<"div">, "children"> & {
  ariaLabel: string
  description?: string
  height?: number
  colors?: string[]
  emptyMessage?: string
}

export type D3SankeyNode = {
  id: string
  label?: string
  group?: string
}

export type D3SankeyLink = {
  source: string
  target: string
  value: number
  label?: string
}

type D3SankeyLinkExtra = Pick<D3SankeyLink, "label">

export type SankeyChartProps = D3ChartBaseProps & {
  nodes: D3SankeyNode[]
  links: D3SankeyLink[]
  valueFormatter?: (value: number) => React.ReactNode
  onNodeSelect?: (node: D3SankeyNode) => void
}

export type D3ForceNode = {
  id: string
  label?: string
  group?: string
  value?: number
}

export type D3ForceLink = {
  source: string
  target: string
  value?: number
}

export type ForceDirectedGraphProps = D3ChartBaseProps & {
  nodes: D3ForceNode[]
  links: D3ForceLink[]
  onNodeSelect?: (node: D3ForceNode) => void
}

export type D3HierarchyDatum = {
  id: string
  label?: string
  value?: number
  children?: D3HierarchyDatum[]
}

export type HierarchyChartProps = D3ChartBaseProps & {
  data?: D3HierarchyDatum
  valueFormatter?: (value: number) => React.ReactNode
  onNodeSelect?: (node: D3HierarchyDatum) => void
}

export type TreemapChartProps = HierarchyChartProps
export type SunburstChartProps = HierarchyChartProps

type TooltipState = {
  x: number
  y: number
  title: string
  detail?: React.ReactNode
} | null

function ChartShell({
  ariaLabel,
  description,
  height = 360,
  className,
  emptyMessage,
  empty,
  tooltip,
  chartRef,
  children,
  ...props
}: Omit<D3ChartBaseProps, "colors"> & {
  empty: boolean
  tooltip: TooltipState
  chartRef: React.RefObject<HTMLDivElement | null>
  children: (width: number, height: number) => React.ReactNode
}) {
  const [width, setWidth] = React.useState(640)

  React.useLayoutEffect(() => {
    const element = chartRef.current
    if (!element) return
    const update = () => setWidth(Math.max(element.clientWidth, 280))
    update()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [chartRef])

  return (
    <div
      ref={chartRef}
      data-slot="d3-chart"
      className={cn(
        "relative w-full overflow-hidden border border-border bg-card text-card-foreground",
        className
      )}
      style={{ height }}
      {...props}
    >
      {empty ? (
        <div className="grid size-full place-items-center px-6 text-center text-sm text-muted-foreground">
          {emptyMessage ?? "No chart data available."}
        </div>
      ) : (
        <svg
          role="img"
          aria-label={ariaLabel}
          viewBox={`0 0 ${width} ${height}`}
          className="size-full"
        >
          <title>{ariaLabel}</title>
          {description ? <desc>{description}</desc> : null}
          {children(width, height)}
        </svg>
      )}
      {tooltip ? (
        <div
          role="status"
          className="pointer-events-none absolute z-10 min-w-28 border border-border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-lg"
          style={{
            left: Math.min(tooltip.x + 12, width - 148),
            top: Math.max(tooltip.y - 12, 8),
          }}
        >
          <p className="font-medium">{tooltip.title}</p>
          {tooltip.detail ? (
            <p className="mt-1 text-muted-foreground">{tooltip.detail}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function interactiveProps<T>({
  datum,
  title,
  detail,
  x,
  y,
  setTooltip,
  onSelect,
}: {
  datum: T
  title: string
  detail?: React.ReactNode
  x: number
  y: number
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>
  onSelect?: (datum: T) => void
}) {
  const show = () => setTooltip({ x, y, title, detail })
  return {
    tabIndex: 0,
    role: "button",
    "aria-label": detail ? `${title}: ${String(detail)}` : title,
    onMouseEnter: show,
    onMouseLeave: () => setTooltip(null),
    onFocus: show,
    onBlur: () => setTooltip(null),
    onClick: () => onSelect?.(datum),
    onKeyDown: (event: React.KeyboardEvent<SVGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onSelect?.(datum)
      }
    },
  } as const
}

function SankeyChart({
  nodes,
  links,
  ariaLabel,
  description,
  height = 360,
  colors = DEFAULT_COLORS,
  valueFormatter = (value) => value.toLocaleString(),
  onNodeSelect,
  className,
  emptyMessage,
  ...props
}: SankeyChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = React.useState<TooltipState>(null)
  const color = React.useMemo(
    () => scaleOrdinal<string, string>(schemeTableau10).range(colors),
    [colors]
  )

  return (
    <ChartShell
      chartRef={chartRef}
      ariaLabel={ariaLabel}
      description={description}
      height={height}
      className={className}
      emptyMessage={emptyMessage}
      empty={!nodes.length || !links.length}
      tooltip={tooltip}
      {...props}
    >
      {(width, chartHeight) => {
        const layout = sankey<D3SankeyNode, D3SankeyLinkExtra>()
          .nodeId((node) => node.id)
          .nodeAlign(sankeyCenter)
          .nodeWidth(12)
          .nodePadding(18)
          .extent([
            [24, 24],
            [width - 24, chartHeight - 24],
          ])
        const graph = layout({
          nodes: nodes.map((node) => ({ ...node })),
          links: links.map((link) => ({ ...link })),
        })
        const linkPath = sankeyLinkHorizontal<D3SankeyNode, D3SankeyLinkExtra>()

        return (
          <>
            <g fill="none" strokeOpacity={0.28}>
              {graph.links.map((link, index) => (
                <path
                  key={`${String(link.source)}-${String(link.target)}-${index}`}
                  d={linkPath(link) ?? undefined}
                  stroke={color(
                    typeof link.source !== "object"
                      ? String(link.source)
                      : (link.source.group ?? link.source.id)
                  )}
                  strokeWidth={Math.max(1, link.width ?? 1)}
                >
                  <title>
                    {`${typeof link.source !== "object" ? String(link.source) : (link.source.label ?? link.source.id)} → ${typeof link.target !== "object" ? String(link.target) : (link.target.label ?? link.target.id)}: ${String(valueFormatter(link.value))}`}
                  </title>
                </path>
              ))}
            </g>
            <g>
              {graph.nodes.map((node) => {
                const centerX = ((node.x0 ?? 0) + (node.x1 ?? 0)) / 2
                const centerY = ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2
                const labelOnRight = centerX < width / 2
                const detail = valueFormatter(node.value ?? 0)
                return (
                  <g
                    key={node.id}
                    {...interactiveProps({
                      datum: node,
                      title: node.label ?? node.id,
                      detail,
                      x: centerX,
                      y: centerY,
                      setTooltip,
                      onSelect: onNodeSelect,
                    })}
                    className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-ring focus-visible:[&>rect]:stroke-[3]"
                  >
                    <rect
                      x={node.x0}
                      y={node.y0}
                      width={(node.x1 ?? 0) - (node.x0 ?? 0)}
                      height={Math.max(1, (node.y1 ?? 0) - (node.y0 ?? 0))}
                      fill={color(node.group ?? node.id)}
                      stroke="var(--background)"
                    />
                    <text
                      x={labelOnRight ? (node.x1 ?? 0) + 7 : (node.x0 ?? 0) - 7}
                      y={centerY}
                      dy="0.35em"
                      textAnchor={labelOnRight ? "start" : "end"}
                      className="fill-foreground text-[11px] font-medium"
                    >
                      {node.label ?? node.id}
                    </text>
                  </g>
                )
              })}
            </g>
          </>
        )
      }}
    </ChartShell>
  )
}

type PositionedForceNode = D3ForceNode & {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

type PositionedForceLink = {
  source: string | PositionedForceNode
  target: string | PositionedForceNode
  value?: number
}

function ForceDirectedGraph({
  nodes,
  links,
  ariaLabel,
  description,
  height = 360,
  colors = DEFAULT_COLORS,
  onNodeSelect,
  className,
  emptyMessage,
  ...props
}: ForceDirectedGraphProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = React.useState<TooltipState>(null)

  return (
    <ChartShell
      chartRef={chartRef}
      ariaLabel={ariaLabel}
      description={description}
      height={height}
      className={className}
      emptyMessage={emptyMessage}
      empty={!nodes.length}
      tooltip={tooltip}
      {...props}
    >
      {(width, chartHeight) => {
        const simulationNodes: PositionedForceNode[] = nodes.map((node) => ({
          ...node,
        }))
        const simulationLinks: PositionedForceLink[] = links.map((link) => ({
          ...link,
        }))
        const simulation = forceSimulation(simulationNodes)
          .force(
            "link",
            forceLink<PositionedForceNode, PositionedForceLink>(simulationLinks)
              .id((node) => node.id)
              .distance(74)
          )
          .force("charge", forceManyBody().strength(-170))
          .force("center", forceCenter(width / 2, chartHeight / 2))
          .force(
            "collision",
            forceCollide<PositionedForceNode>().radius(
              (node) => 11 + Math.sqrt(Math.max(0, node.value ?? 0))
            )
          )
          .stop()
        for (let index = 0; index < 180; index += 1) simulation.tick()
        const color = scaleOrdinal<string, string>().range(colors)

        return (
          <>
            <g stroke="var(--border)" strokeOpacity={0.85}>
              {simulationLinks.map((link, index) => {
                const source = link.source as PositionedForceNode
                const target = link.target as PositionedForceNode
                return (
                  <line
                    key={`${source.id}-${target.id}-${index}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    strokeWidth={Math.max(1, link.value ?? 1)}
                  />
                )
              })}
            </g>
            <g>
              {simulationNodes.map((node) => {
                const radius = 8 + Math.sqrt(Math.max(0, node.value ?? 0))
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x ?? width / 2},${node.y ?? chartHeight / 2})`}
                    {...interactiveProps({
                      datum: node,
                      title: node.label ?? node.id,
                      detail: node.group,
                      x: node.x ?? width / 2,
                      y: node.y ?? chartHeight / 2,
                      setTooltip,
                      onSelect: onNodeSelect,
                    })}
                    className="cursor-pointer outline-none focus-visible:[&>circle]:stroke-ring focus-visible:[&>circle]:stroke-[3]"
                  >
                    <circle
                      r={radius}
                      fill={color(node.group ?? "default")}
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                    <text
                      y={radius + 13}
                      textAnchor="middle"
                      className="fill-foreground text-[10px] font-medium"
                    >
                      {node.label ?? node.id}
                    </text>
                  </g>
                )
              })}
            </g>
          </>
        )
      }}
    </ChartShell>
  )
}

function TreemapChart({
  data,
  ariaLabel,
  description,
  height = 360,
  colors = DEFAULT_COLORS,
  valueFormatter = (value) => value.toLocaleString(),
  onNodeSelect,
  className,
  emptyMessage,
  ...props
}: TreemapChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = React.useState<TooltipState>(null)

  return (
    <ChartShell
      chartRef={chartRef}
      ariaLabel={ariaLabel}
      description={description}
      height={height}
      className={className}
      emptyMessage={emptyMessage}
      empty={!data}
      tooltip={tooltip}
      {...props}
    >
      {(width, chartHeight) => {
        if (!data) return null
        const root = treemap<D3HierarchyDatum>()
          .tile(treemapSquarify)
          .size([width, chartHeight])
          .paddingInner(2)
          .paddingOuter(3)(
          hierarchy(data)
            .sum((node) => Math.max(0, node.value ?? 0))
            .sort((left, right) => (right.value ?? 0) - (left.value ?? 0))
        )
        const color = scaleOrdinal<string, string>().range(colors)

        return (
          <g>
            {root.leaves().map((node) => {
              const x = node.x0
              const y = node.y0
              const nodeWidth = node.x1 - node.x0
              const nodeHeight = node.y1 - node.y0
              const parent = node.parent?.data.id ?? data.id
              return (
                <g
                  key={node.data.id}
                  transform={`translate(${x},${y})`}
                  {...interactiveProps({
                    datum: node.data,
                    title: node.data.label ?? node.data.id,
                    detail: valueFormatter(node.value ?? 0),
                    x: x + nodeWidth / 2,
                    y: y + nodeHeight / 2,
                    setTooltip,
                    onSelect: onNodeSelect,
                  })}
                  className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-ring focus-visible:[&>rect]:stroke-[3]"
                >
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    fill={color(parent)}
                    fillOpacity={0.78}
                    stroke="var(--background)"
                  />
                  {nodeWidth > 64 && nodeHeight > 36 ? (
                    <>
                      <text
                        x={8}
                        y={18}
                        className="fill-white text-[11px] font-semibold"
                      >
                        {node.data.label ?? node.data.id}
                      </text>
                      <text x={8} y={34} className="fill-white/80 text-[10px]">
                        {valueFormatter(node.value ?? 0)}
                      </text>
                    </>
                  ) : null}
                </g>
              )
            })}
          </g>
        )
      }}
    </ChartShell>
  )
}

function SunburstChart({
  data,
  ariaLabel,
  description,
  height = 380,
  colors = DEFAULT_COLORS,
  valueFormatter = (value) => value.toLocaleString(),
  onNodeSelect,
  className,
  emptyMessage,
  ...props
}: SunburstChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = React.useState<TooltipState>(null)

  return (
    <ChartShell
      chartRef={chartRef}
      ariaLabel={ariaLabel}
      description={description}
      height={height}
      className={className}
      emptyMessage={emptyMessage}
      empty={!data}
      tooltip={tooltip}
      {...props}
    >
      {(width, chartHeight) => {
        if (!data) return null
        const radius = Math.min(width, chartHeight) / 2 - 18
        const root = partition<D3HierarchyDatum>().size([Math.PI * 2, radius])(
          hierarchy(data)
            .sum((node) => Math.max(0, node.value ?? 0))
            .sort((left, right) => (right.value ?? 0) - (left.value ?? 0))
        )
        const color = scaleOrdinal<string, string>().range(colors)
        const arcPath = arc<HierarchyRectangularNode<D3HierarchyDatum>>()
          .startAngle((node) => node.x0)
          .endAngle((node) => node.x1)
          .innerRadius((node) => node.y0)
          .outerRadius((node) => Math.max(node.y0, node.y1 - 1))

        return (
          <g transform={`translate(${width / 2},${chartHeight / 2})`}>
            {root
              .descendants()
              .slice(1)
              .map((node) => {
                const ancestors = node.ancestors()
                const group = ancestors.at(-2)?.data.id ?? node.data.id
                const angle = (node.x0 + node.x1) / 2
                const ring = (node.y0 + node.y1) / 2
                return (
                  <path
                    key={node.data.id}
                    d={arcPath(node) ?? undefined}
                    fill={color(group)}
                    fillOpacity={Math.max(0.45, 1 - node.depth * 0.12)}
                    stroke="var(--background)"
                    {...interactiveProps({
                      datum: node.data,
                      title: node.data.label ?? node.data.id,
                      detail: valueFormatter(node.value ?? 0),
                      x: width / 2 + Math.sin(angle) * ring,
                      y: chartHeight / 2 - Math.cos(angle) * ring,
                      setTooltip,
                      onSelect: onNodeSelect,
                    })}
                    className="cursor-pointer outline-none focus-visible:stroke-ring focus-visible:stroke-[3]"
                  />
                )
              })}
            <text
              textAnchor="middle"
              dy="-0.1em"
              className="fill-foreground text-sm font-semibold"
            >
              {data.label ?? data.id}
            </text>
            <text
              textAnchor="middle"
              dy="1.25em"
              className="fill-muted-foreground text-[10px]"
            >
              {valueFormatter(root.value ?? 0)}
            </text>
          </g>
        )
      }}
    </ChartShell>
  )
}

export { ForceDirectedGraph, SankeyChart, SunburstChart, TreemapChart }

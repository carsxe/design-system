"use client"

import * as React from "react"
import { CarFrontIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@carsxe/design-system/components/chart"

import type { ComponentDoc } from "./types"

const monthlyData = [
  { month: "Jan", retail: 186, wholesale: 92, service: 44 },
  { month: "Feb", retail: 224, wholesale: 118, service: 58 },
  { month: "Mar", retail: 208, wholesale: 136, service: 71 },
  { month: "Apr", retail: 278, wholesale: 154, service: 86 },
  { month: "May", retail: 316, wholesale: 173, service: 101 },
  { month: "Jun", retail: 294, wholesale: 188, service: 116 },
]

const channelData = [
  { channel: "Marketplace", value: 430 },
  { channel: "Dealer", value: 292 },
  { channel: "Auction", value: 188 },
  { channel: "Private", value: 126 },
]

const movementData = [
  { segment: "SUV", change: 18 },
  { segment: "Sedan", change: -8 },
  { segment: "Pickup", change: 12 },
  { segment: "EV", change: 26 },
  { segment: "Coupe", change: -14 },
]

const conditionData = [
  { metric: "Body", inspected: 88, benchmark: 76 },
  { metric: "Engine", inspected: 94, benchmark: 82 },
  { metric: "Cabin", inspected: 78, benchmark: 72 },
  { metric: "Tyres", inspected: 84, benchmark: 68 },
  { metric: "History", inspected: 97, benchmark: 80 },
]

const config = {
  retail: {
    label: "Retail",
    color: "var(--chart-1)",
    icon: CarFrontIcon,
  },
  wholesale: { label: "Wholesale", color: "var(--chart-2)" },
  service: { label: "Service", color: "var(--chart-4)" },
  value: { label: "Vehicles", color: "var(--chart-1)" },
  inspected: { label: "Inspected vehicle", color: "var(--chart-2)" },
  benchmark: { label: "Fleet benchmark", color: "var(--chart-5)" },
} satisfies ChartConfig

function ChartFrame({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section className="grid max-w-full min-w-0 gap-4 border border-border bg-card p-5">
      <div>
        <h3 className="font-heading text-base font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
      {children}
    </section>
  )
}

function AreaChartExamples() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-5">
      <ChartFrame
        title="Inventory velocity"
        note="Stacked gradient · legend · axes"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="retail-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-retail)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-retail)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient id="wholesale-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-wholesale)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-wholesale)"
                  stopOpacity={0.06}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="retail"
              type="monotone"
              stackId="inventory"
              fill="url(#retail-fill)"
              stroke="var(--color-retail)"
            />
            <Area
              dataKey="wholesale"
              type="step"
              stackId="inventory"
              fill="url(#wholesale-fill)"
              stroke="var(--color-wholesale)"
            />
          </AreaChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Channel share"
        note="Expanded stack · linear curves · formatted tooltip"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={monthlyData} stackOffset="expand">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value, name) => (
                    <>
                      <span className="text-muted-foreground">
                        {typeof name === "string" && Object.hasOwn(config, name)
                          ? config[name as keyof typeof config].label
                          : name}
                      </span>
                      <span className="ml-auto font-mono">
                        {Number(value).toLocaleString()}
                      </span>
                    </>
                  )}
                />
              }
            />
            <Area
              dataKey="retail"
              type="linear"
              stackId="share"
              fill="var(--color-retail)"
              fillOpacity={0.75}
              stroke="var(--color-retail)"
            />
            <Area
              dataKey="wholesale"
              type="linear"
              stackId="share"
              fill="var(--color-wholesale)"
              fillOpacity={0.7}
              stroke="var(--color-wholesale)"
            />
            <Area
              dataKey="service"
              type="linear"
              stackId="share"
              fill="var(--color-service)"
              fillOpacity={0.65}
              stroke="var(--color-service)"
            />
          </AreaChart>
        </ChartContainer>
      </ChartFrame>
    </div>
  )
}

function InteractiveChartExample() {
  const [series, setSeries] = React.useState<"retail" | "wholesale">("retail")

  return (
    <ChartFrame
      title="Interactive inventory"
      note="Series selector · active tooltip · live labels"
    >
      <div className="flex gap-1" aria-label="Inventory series">
        {(["retail", "wholesale"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={series === value}
            onClick={() => setSeries(value)}
            className="border border-border px-3 py-1.5 text-xs font-medium capitalize aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {value}
          </button>
        ))}
      </div>
      <ChartContainer config={config} className="h-64 w-full">
        <AreaChart data={monthlyData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            key={series}
            dataKey={series}
            type="monotone"
            fill={`var(--color-${series})`}
            fillOpacity={0.2}
            stroke={`var(--color-${series})`}
            strokeWidth={3}
          />
        </AreaChart>
      </ChartContainer>
    </ChartFrame>
  )
}

function BarChartExamples() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-5">
      <ChartFrame
        title="Sales channels"
        note="Horizontal · labels · mixed values"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={channelData} layout="vertical" margin={{ right: 34 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="channel"
              type="category"
              tickLine={false}
              axisLine={false}
              width={76}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="dot" />}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[0, 5, 5, 0]}
            >
              <LabelList
                dataKey="value"
                position="right"
                className="fill-foreground"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Monthly throughput"
        note="Multiple · stacked · active tooltip"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="retail" stackId="sales" fill="var(--color-retail)" />
            <Bar
              dataKey="wholesale"
              stackId="sales"
              fill="var(--color-wholesale)"
            />
            <Bar
              dataKey="service"
              fill="var(--color-service)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Market movement"
        note="Positive and negative values · zero baseline"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={movementData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="segment" tickLine={false} axisLine={false} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="change" radius={3}>
              {movementData.map((entry) => (
                <Cell
                  key={entry.segment}
                  fill={
                    entry.change < 0 ? "var(--destructive)" : "var(--chart-3)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartFrame>
    </div>
  )
}

function LineChartExamples() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-5">
      <ChartFrame
        title="Valuation signals"
        note="Multiple · dots · custom colors"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => `Month ${String(value)}`}
                />
              }
            />
            <Line
              dataKey="retail"
              type="monotone"
              stroke="var(--color-retail)"
              strokeWidth={2}
              dot={{ fill: "var(--color-retail)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="wholesale"
              type="linear"
              stroke="var(--color-wholesale)"
              strokeWidth={2}
              dot={{ fill: "var(--color-wholesale)" }}
            />
          </LineChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Service events"
        note="Step curve · inline labels · hidden indicator"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart data={monthlyData} margin={{ right: 32 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Line
              dataKey="service"
              type="step"
              stroke="var(--color-service)"
              strokeWidth={3}
              dot={false}
            >
              <LabelList
                dataKey="service"
                position="top"
                className="fill-foreground"
                fontSize={10}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </ChartFrame>
    </div>
  )
}

function PieChartExamples() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-5">
      <ChartFrame title="Lead sources" note="Donut · center text · legend">
        <ChartContainer config={config} className="h-64 w-full">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="channel" hideLabel />}
            />
            <Pie
              data={channelData}
              dataKey="value"
              nameKey="channel"
              innerRadius={54}
              outerRadius={82}
              paddingAngle={2}
            >
              {channelData.map((entry, index) => (
                <Cell
                  key={entry.channel}
                  fill={`var(--chart-${(index % 5) + 1})`}
                />
              ))}
              <Label
                content={({ viewBox }) =>
                  "cx" in viewBox! ? (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        className="fill-foreground text-xl font-semibold"
                      >
                        1,036
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        dy={18}
                        className="fill-muted-foreground text-[10px]"
                      >
                        vehicles
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Channel concentration"
        note="Active shape · nested rings · custom labels"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent nameKey="channel" indicator="line" />
              }
            />
            <Pie
              data={channelData}
              dataKey="value"
              nameKey="channel"
              innerRadius={38}
              outerRadius={66}
              strokeWidth={2}
              label={({ name }) => name}
            >
              {channelData.map((entry, index) => (
                <Cell
                  key={entry.channel}
                  fill={`var(--chart-${(index % 5) + 1})`}
                />
              ))}
            </Pie>
            <Pie
              data={channelData.slice(0, 3)}
              dataKey="value"
              nameKey="channel"
              innerRadius={74}
              outerRadius={86}
              fill="var(--chart-2)"
              opacity={0.45}
            />
          </PieChart>
        </ChartContainer>
      </ChartFrame>
    </div>
  )
}

function RadarChartExamples() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-5">
      <ChartFrame
        title="Inspection profile"
        note="Circular grid · dots · custom labels"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <RadarChart data={conditionData}>
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <Radar
              dataKey="inspected"
              fill="var(--color-inspected)"
              fillOpacity={0.3}
              stroke="var(--color-inspected)"
              dot={{ r: 3, fill: "var(--color-inspected)" }}
            />
          </RadarChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Fleet benchmark"
        note="Multiple · filled grid · legend"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <RadarChart data={conditionData}>
            <PolarGrid radialLines={false} />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Radar
              dataKey="inspected"
              fill="var(--color-inspected)"
              fillOpacity={0.3}
              stroke="var(--color-inspected)"
            />
            <Radar
              dataKey="benchmark"
              fill="var(--color-benchmark)"
              fillOpacity={0.18}
              stroke="var(--color-benchmark)"
            />
          </RadarChart>
        </ChartContainer>
      </ChartFrame>
    </div>
  )
}

function RadialChartExamples() {
  const radialData = [
    { name: "Complete", value: 82, fill: "var(--chart-1)" },
    { name: "Pending", value: 54, fill: "var(--chart-2)" },
    { name: "Flagged", value: 22, fill: "var(--chart-4)" },
  ]
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-5">
      <ChartFrame
        title="Report completion"
        note="Radial grid · labels · stacked arcs"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <RadialBarChart
            data={radialData}
            innerRadius="26%"
            outerRadius="92%"
            startAngle={90}
            endAngle={-270}
          >
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />
            <RadialBar dataKey="value" background cornerRadius={4}>
              <LabelList
                dataKey="name"
                position="insideStart"
                className="fill-white text-[10px]"
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </ChartFrame>
      <ChartFrame
        title="Verified records"
        note="Single shape · center value · compact radial"
      >
        <ChartContainer config={config} className="h-64 w-full">
          <RadialBarChart
            data={[{ value: 78, fill: "var(--chart-2)" }]}
            innerRadius={72}
            outerRadius={104}
            startAngle={90}
            endAngle={90 + 360 * 0.78}
          >
            <RadialBar dataKey="value" background cornerRadius={8} />
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              className="fill-foreground text-3xl font-semibold"
            >
              78%
            </text>
            <text
              x="50%"
              y="59%"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              verified
            </text>
          </RadialBarChart>
        </ChartContainer>
      </ChartFrame>
    </div>
  )
}

function ChartGallery() {
  return (
    <div className="grid w-full gap-8">
      <AreaChartExamples />
      <InteractiveChartExample />
      <BarChartExamples />
      <LineChartExamples />
      <PieChartExamples />
      <RadarChartExamples />
      <RadialChartExamples />
    </div>
  )
}

const chart = {
  slug: "chart",
  title: "Chart",
  description:
    "Token-aware Recharts primitives and production-ready recipes for every shadcn chart family.",
  importName: "ChartContainer",
  importPath: "@carsxe/design-system/components/chart",
  usage: `import { ChartContainer, type ChartConfig } from "@carsxe/design-system/components/chart"
import { Area, AreaChart } from "recharts"`,
  preview: <AreaChartExamples />,
  previewCode: `<ChartContainer config={config}><AreaChart data={data}>...</AreaChart></ChartContainer>`,
  examples: [
    {
      title: "Interactive chart",
      preview: <InteractiveChartExample />,
      code: `<button onClick={() => setSeries("retail")}>Retail</button>\n<Area dataKey={series} />`,
    },
    {
      title: "Bar charts",
      preview: <BarChartExamples />,
      code: `<BarChart data={data}>...</BarChart>`,
    },
    {
      title: "Line charts",
      preview: <LineChartExamples />,
      code: `<LineChart data={data}>...</LineChart>`,
    },
    {
      title: "Pie and donut charts",
      preview: <PieChartExamples />,
      code: `<PieChart>...</PieChart>`,
    },
    {
      title: "Radar charts",
      preview: <RadarChartExamples />,
      code: `<RadarChart data={data}>...</RadarChart>`,
    },
    {
      title: "Radial charts",
      preview: <RadialChartExamples />,
      code: `<RadialBarChart data={data}>...</RadialBarChart>`,
    },
  ],
  props: [
    { name: "config", type: "ChartConfig" },
    {
      name: "initialDimension",
      type: "{ width: number; height: number }",
      defaultValue: "{ width: 320, height: 200 }",
    },
    { name: "children", type: "ReactElement" },
  ],
} satisfies ComponentDoc

export {
  AreaChartExamples,
  BarChartExamples,
  ChartGallery,
  InteractiveChartExample,
  LineChartExamples,
  PieChartExamples,
  RadarChartExamples,
  RadialChartExamples,
  chart,
}

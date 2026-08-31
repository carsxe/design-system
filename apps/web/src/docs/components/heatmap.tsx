import {
  Heatmap,
  type HeatmapDatum,
} from "@carsxe/design-system/components/heatmap"

import type { ComponentDoc } from "./types"

function seededFraction(key: string) {
  let hash = 2166136261
  for (let index = 0; index < key.length; index++) {
    hash = Math.imul(hash ^ key.charCodeAt(index), 16777619)
  }
  return (hash >>> 0) / 4294967295
}

function dayKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function buildDailySeries(end: Date, days: number, peak: number) {
  const series: HeatmapDatum[] = []
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() - offset
    )
    const seed = seededFraction(dayKey(date))
    series.push({
      date: dayKey(date),
      value: seed < 0.14 ? 0 : Math.round(seed * seed * peak),
    })
  }
  const busiest = series[Math.floor(series.length * 0.6)]
  if (busiest) busiest.value = peak
  return series
}

const revenueData = buildDailySeries(new Date(2026, 7, 31), 365, 12100)
const lookupData = buildDailySeries(new Date(2026, 7, 31), 90, 480)

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

function HeatmapRevenueExample() {
  return (
    <section className="grid w-full gap-1.5">
      <h3 className="font-heading text-base font-medium">
        Daily revenue calendar
      </h3>
      <p className="text-sm text-muted-foreground">
        Gross volume per day, so quiet stretches and spikes are visible at a
        glance.
      </p>
      <Heatmap
        ariaLabel="Daily revenue calendar"
        description="Gross revenue per day for the trailing twelve months."
        data={revenueData}
        valueFormatter={(value) => compactCurrency.format(value)}
        className="mt-2"
      />
    </section>
  )
}

function HeatmapCompactExample() {
  return (
    <Heatmap
      ariaLabel="API lookups for the last 90 days"
      data={lookupData}
      weekStartsOn={1}
      valueFormatter={(value) => `${value.toLocaleString()} lookups`}
    />
  )
}

function HeatmapCustomScaleExample() {
  return (
    <Heatmap
      ariaLabel="Daily revenue with a four-step brand scale"
      data={lookupData}
      colors={[
        "var(--brand-400)",
        "var(--brand-500)",
        "var(--brand-600)",
        "var(--brand-950)",
      ]}
      valueFormatter={(value) => compactCurrency.format(value)}
    />
  )
}

const heatmap = {
  slug: "heatmap",
  title: "Heatmap",
  description:
    "A GitHub-style calendar heatmap that shows a value per day, with month and weekday labels and a Less-to-More legend. Height derives from width and the number of weeks so cells always stay square — there is no height prop.",
  importName: "Heatmap",
  importPath: "@carsxe/design-system/components/heatmap",
  usage: `import { Heatmap } from "@carsxe/design-system/components/heatmap"

<Heatmap ariaLabel="Daily revenue" data={[{ date: "2026-08-12", value: 1240 }]} />`,
  preview: <HeatmapRevenueExample />,
  previewCode: `<Heatmap
  ariaLabel="Daily revenue calendar"
  data={revenueData}
  valueFormatter={(value) => compactCurrency.format(value)}
/>`,
  examples: [
    {
      title: "Monday start with a count formatter",
      preview: <HeatmapCompactExample />,
      code: `<Heatmap
  ariaLabel="API lookups for the last 90 days"
  data={lookupData}
  weekStartsOn={1}
  valueFormatter={(value) => \`\${value.toLocaleString()} lookups\`}
/>`,
    },
    {
      title: "Custom color scale",
      preview: <HeatmapCustomScaleExample />,
      code: `<Heatmap
  ariaLabel="Daily revenue with a four-step brand scale"
  data={lookupData}
  colors={[
    "var(--brand-400)",
    "var(--brand-500)",
    "var(--brand-600)",
    "var(--brand-950)",
  ]}
/>`,
    },
  ],
  props: [
    { name: "ariaLabel", type: "string" },
    { name: "data", type: "{ date: string | Date; value: number }[]" },
    { name: "description", type: "string" },
    { name: "startDate", type: "string | Date", defaultValue: "min data date" },
    { name: "endDate", type: "string | Date", defaultValue: "max data date" },
    {
      name: "weekStartsOn",
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
      defaultValue: "0 (Sunday)",
    },
    {
      name: "colors",
      type: "string[]",
      defaultValue: "CarsXE heatmap tokens (5 levels)",
    },
    { name: "emptyColor", type: "string", defaultValue: "var(--border)" },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      defaultValue: "value.toLocaleString()",
    },
    { name: "showLegend", type: "boolean", defaultValue: "true" },
    {
      name: "onCellSelect",
      type: "(datum: { date: Date; value: number }) => void",
    },
    {
      name: "emptyMessage",
      type: "string",
      defaultValue: '"No chart data available."',
    },
  ],
} satisfies ComponentDoc

export {
  heatmap,
  HeatmapCompactExample,
  HeatmapCustomScaleExample,
  HeatmapRevenueExample,
}

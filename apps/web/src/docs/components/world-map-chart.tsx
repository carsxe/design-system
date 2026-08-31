import * as React from "react"

import {
  WorldMapChart,
  type WorldMapCountry,
  type WorldMapDatum,
} from "@carsxe/design-system/components/world-map-chart"

import type { ComponentDoc } from "./types"

const reportVolume: WorldMapDatum[] = [
  { countryCode: "US", value: 18420 },
  { countryCode: "CA", value: 9260 },
  { countryCode: "MX", value: 8200 },
  { countryCode: "BR", value: 11300 },
  { countryCode: "GB", value: 8740 },
  { countryCode: "FR", value: 9630 },
  { countryCode: "DE", value: 12980 },
  { countryCode: "ZA", value: 6210 },
  { countryCode: "AE", value: 4380 },
  { countryCode: "IN", value: 15760 },
  { countryCode: "JP", value: 10920 },
  { countryCode: "AU", value: 7460 },
]

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

function reportFormatter(value: number) {
  return `${compactNumber.format(value)} reports`
}

function SelectedCountry({ country }: { country?: WorldMapCountry }) {
  return (
    <p
      data-testid="world-map-selection"
      className="border-x border-b border-border bg-background px-3 py-2 text-sm text-muted-foreground"
    >
      {country ? (
        <>
          Selected:{" "}
          <span className="font-medium text-foreground">{country.name}</span>
          <span className="ml-2 font-mono text-xs tabular-nums">
            {country.value.toLocaleString()} reports
          </span>
        </>
      ) : (
        "Select a country to inspect its report volume."
      )}
    </p>
  )
}

function WorldMapOverviewExample() {
  const [selected, setSelected] = React.useState<WorldMapCountry>()

  return (
    <section className="w-full">
      <div className="mb-4 grid gap-1">
        <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
          Global coverage
        </p>
        <h3 className="font-heading text-lg font-medium">
          Vehicle report volume
        </h3>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Completed vehicle reports across active CarsXE markets. Hover a
          country or use the arrow keys to inspect the route.
        </p>
      </div>
      <WorldMapChart
        ariaLabel="Vehicle report volume by country"
        description="Completed vehicle reports across active CarsXE markets."
        data={reportVolume}
        selectedCountryCode={selected?.alpha2}
        onCountrySelect={setSelected}
        valueFormatter={reportFormatter}
      />
      <SelectedCountry country={selected} />
    </section>
  )
}

function WorldMapControlledExample() {
  const [selected, setSelected] = React.useState("DE")
  const country = reportVolume.find((datum) => datum.countryCode === selected)

  return (
    <section className="w-full">
      <WorldMapChart
        ariaLabel="Controlled market selection"
        data={reportVolume}
        selectedCountryCode={selected}
        onCountrySelect={(next) => setSelected(next.alpha2)}
        valueFormatter={reportFormatter}
      />
      <p
        data-testid="controlled-world-map-selection"
        className="border-x border-b border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground"
      >
        Selected market: {country?.countryCode ?? selected}
      </p>
    </section>
  )
}

function WorldMapCustomScaleExample() {
  return (
    <WorldMapChart
      ariaLabel="Report volume with a compact CarsXE scale"
      data={reportVolume.slice(0, 8)}
      colors={[
        "color-mix(in srgb, var(--chart-2) 22%, var(--card))",
        "var(--chart-2)",
        "var(--chart-1)",
        "var(--chart-5)",
      ]}
      valueFormatter={reportFormatter}
      height={320}
    />
  )
}

function WorldMapEmptyExample() {
  return (
    <WorldMapChart
      ariaLabel="World map without report data"
      data={[{ countryCode: "ZZZ", value: 12 }]}
      emptyMessage="Add country report data to draw the map."
      height={280}
    />
  )
}

const worldMapChart = {
  slug: "world-map-chart",
  title: "World Map Chart",
  description:
    "A responsive CarsXE choropleth for country-level values. Pass ISO alpha-2, alpha-3, or numeric codes; bundled world geometry, accessible keyboard inspection, selection, tooltips, and theme-aware colors are handled for you.",
  importName: "WorldMapChart",
  importPath: "@carsxe/design-system/components/world-map-chart",
  usage: `import { WorldMapChart } from "@carsxe/design-system/components/world-map-chart"

<WorldMapChart
  ariaLabel="Vehicle report volume by country"
  data={[{ countryCode: "US", value: 18420 }]}
/>`,
  preview: <WorldMapOverviewExample />,
  previewCode: `<WorldMapChart
  ariaLabel="Vehicle report volume by country"
  data={reportVolume}
  selectedCountryCode={selectedCountry}
  onCountrySelect={(country) => setSelectedCountry(country.alpha2)}
  valueFormatter={(value) => \`\${compactNumber.format(value)} reports\`}
/>`,
  examples: [
    {
      title: "Controlled country selection",
      preview: <WorldMapControlledExample />,
      code: `<WorldMapChart
  ariaLabel="Controlled market selection"
  data={reportVolume}
  selectedCountryCode={selected}
  onCountrySelect={(country) => setSelected(country.alpha2)}
/>`,
    },
    {
      title: "Custom CarsXE scale",
      preview: <WorldMapCustomScaleExample />,
      code: `<WorldMapChart
  ariaLabel="Report volume with a compact CarsXE scale"
  data={reportVolume}
  colors={["var(--chart-2)", "var(--chart-1)", "var(--chart-5)"]}
/>`,
    },
    {
      title: "Empty and invalid data",
      preview: <WorldMapEmptyExample />,
      code: `<WorldMapChart
  ariaLabel="World map without report data"
  data={[{ countryCode: "ZZZ", value: 12 }]}
  emptyMessage="Add country report data to draw the map."
/>`,
    },
  ],
  props: [
    { name: "ariaLabel", type: "string" },
    { name: "data", type: "WorldMapDatum[]" },
    { name: "description", type: "string" },
    { name: "height", type: "number", defaultValue: "360" },
    {
      name: "colors",
      type: "string[]",
      defaultValue: "CarsXE chart tokens (5 levels)",
    },
    { name: "missingColor", type: "string", defaultValue: "var(--border)" },
    { name: "showLegend", type: "boolean", defaultValue: "true" },
    {
      name: "valueFormatter",
      type: "(value, datum) => string",
      defaultValue: "value.toLocaleString()",
    },
    { name: "selectedCountryCode", type: "string" },
    { name: "defaultSelectedCountryCode", type: "string" },
    { name: "onCountrySelect", type: "(country: WorldMapCountry) => void" },
    {
      name: "emptyMessage",
      type: "string",
      defaultValue: '"No map data available."',
    },
  ],
} satisfies ComponentDoc

export {
  reportVolume,
  WorldMapControlledExample,
  WorldMapCustomScaleExample,
  WorldMapEmptyExample,
  WorldMapOverviewExample,
  worldMapChart,
}

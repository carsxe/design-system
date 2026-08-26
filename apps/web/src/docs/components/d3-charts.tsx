import {
  ForceDirectedGraph,
  SankeyChart,
  SunburstChart,
  TreemapChart,
  type D3HierarchyDatum,
} from "@carsxe/design-system/components/d3-chart"

import type { ComponentDoc } from "./types"

const hierarchyData: D3HierarchyDatum = {
  id: "inventory",
  label: "Inventory",
  children: [
    {
      id: "suv",
      label: "SUV",
      children: [
        { id: "compact-suv", label: "Compact", value: 128 },
        { id: "midsize-suv", label: "Midsize", value: 94 },
        { id: "fullsize-suv", label: "Full-size", value: 48 },
      ],
    },
    {
      id: "passenger",
      label: "Passenger",
      children: [
        { id: "sedan", label: "Sedan", value: 116 },
        { id: "hatchback", label: "Hatchback", value: 62 },
        { id: "coupe", label: "Coupe", value: 34 },
      ],
    },
    {
      id: "commercial",
      label: "Commercial",
      children: [
        { id: "pickup", label: "Pickup", value: 86 },
        { id: "van", label: "Van", value: 41 },
      ],
    },
  ],
}

const sankeyNodes = [
  { id: "listed", label: "Listed", group: "supply" },
  { id: "inspected", label: "Inspected", group: "verification" },
  { id: "verified", label: "Verified", group: "verification" },
  { id: "dealer", label: "Dealer sale", group: "sale" },
  { id: "private", label: "Private sale", group: "sale" },
  { id: "auction", label: "Auction", group: "sale" },
]

const sankeyLinks = [
  { source: "listed", target: "inspected", value: 690 },
  { source: "listed", target: "auction", value: 140 },
  { source: "inspected", target: "verified", value: 610 },
  { source: "inspected", target: "auction", value: 80 },
  { source: "verified", target: "dealer", value: 402 },
  { source: "verified", target: "private", value: 208 },
]

const networkNodes = [
  { id: "vehicle", label: "Vehicle", group: "asset", value: 64 },
  { id: "owner", label: "Owner", group: "people", value: 28 },
  { id: "dealer", label: "Dealer", group: "people", value: 22 },
  { id: "inspection", label: "Inspection", group: "record", value: 32 },
  { id: "service", label: "Service", group: "record", value: 20 },
  { id: "auction", label: "Auction", group: "market", value: 18 },
  { id: "listing", label: "Listing", group: "market", value: 26 },
]

const networkLinks = [
  { source: "vehicle", target: "owner" },
  { source: "vehicle", target: "dealer" },
  { source: "vehicle", target: "inspection" },
  { source: "vehicle", target: "service" },
  { source: "vehicle", target: "auction" },
  { source: "vehicle", target: "listing" },
  { source: "dealer", target: "listing" },
  { source: "owner", target: "service" },
]

function D3ChartFrame({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-3">
      <h3 className="font-heading text-base font-medium">{title}</h3>
      {children}
    </section>
  )
}

function D3ChartGallery() {
  return (
    <div className="grid w-full gap-8">
      <D3ChartFrame title="Vehicle lifecycle flow">
        <SankeyChart
          ariaLabel="Vehicle lifecycle flow"
          nodes={sankeyNodes}
          links={sankeyLinks}
        />
      </D3ChartFrame>
      <D3ChartFrame title="Vehicle record network">
        <ForceDirectedGraph
          ariaLabel="Vehicle record network"
          nodes={networkNodes}
          links={networkLinks}
        />
      </D3ChartFrame>
      <D3ChartFrame title="Inventory composition">
        <TreemapChart
          ariaLabel="Inventory composition treemap"
          data={hierarchyData}
        />
      </D3ChartFrame>
      <D3ChartFrame title="Inventory hierarchy">
        <SunburstChart
          ariaLabel="Inventory hierarchy sunburst"
          data={hierarchyData}
        />
      </D3ChartFrame>
    </div>
  )
}

const d3Charts = {
  slug: "d3-charts",
  title: "D3 Charts",
  description:
    "Responsive, accessible relationship and hierarchy charts for data that does not fit a Cartesian plot.",
  importName: "SankeyChart",
  importPath: "@carsxe/design-system/components/d3-chart",
  usage: `import { SankeyChart } from "@carsxe/design-system/components/d3-chart"

<SankeyChart ariaLabel="Vehicle lifecycle" nodes={nodes} links={links} />`,
  preview: (
    <SankeyChart
      ariaLabel="Vehicle lifecycle flow"
      nodes={sankeyNodes}
      links={sankeyLinks}
    />
  ),
  previewCode: `<SankeyChart ariaLabel="Vehicle lifecycle flow" nodes={nodes} links={links} />`,
  examples: [
    {
      title: "Force-directed network",
      preview: (
        <ForceDirectedGraph
          ariaLabel="Vehicle record network"
          nodes={networkNodes}
          links={networkLinks}
        />
      ),
      code: `<ForceDirectedGraph ariaLabel="Vehicle record network" nodes={nodes} links={links} />`,
    },
    {
      title: "Treemap",
      preview: (
        <TreemapChart ariaLabel="Inventory composition" data={hierarchyData} />
      ),
      code: `<TreemapChart ariaLabel="Inventory composition" data={data} />`,
    },
    {
      title: "Sunburst",
      preview: (
        <SunburstChart ariaLabel="Inventory hierarchy" data={hierarchyData} />
      ),
      code: `<SunburstChart ariaLabel="Inventory hierarchy" data={data} />`,
    },
  ],
  props: [
    { name: "ariaLabel", type: "string" },
    { name: "height", type: "number", defaultValue: "360" },
    { name: "colors", type: "string[]", defaultValue: "CarsXE chart tokens" },
    { name: "onNodeSelect", type: "(node) => void" },
  ],
} satisfies ComponentDoc

export {
  D3ChartGallery,
  d3Charts,
  hierarchyData,
  networkLinks,
  networkNodes,
  sankeyLinks,
  sankeyNodes,
}

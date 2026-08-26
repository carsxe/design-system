import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  AreaChartExamples,
  BarChartExamples,
  ChartGallery,
  InteractiveChartExample,
  LineChartExamples,
  PieChartExamples,
  RadarChartExamples,
  RadialChartExamples,
} from "../../../web/src/docs/components/chart"
import { D3ChartGallery } from "../../../web/src/docs/components/d3-charts"

const meta = {
  title: "Components/Chart",
  component: ChartGallery,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ChartGallery>

export default meta
type Story = StoryObj<typeof meta>

export const AllFamilies: Story = {}
export const Area: Story = { render: () => <AreaChartExamples /> }
export const Interactive: Story = { render: () => <InteractiveChartExample /> }
export const Bar: Story = { render: () => <BarChartExamples /> }
export const Line: Story = { render: () => <LineChartExamples /> }
export const PieAndDonut: Story = { render: () => <PieChartExamples /> }
export const Radar: Story = { render: () => <RadarChartExamples /> }
export const Radial: Story = { render: () => <RadialChartExamples /> }
export const D3RelationshipsAndHierarchy: Story = {
  render: () => <D3ChartGallery />,
}

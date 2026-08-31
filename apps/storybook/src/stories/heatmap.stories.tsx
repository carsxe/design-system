import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  HeatmapCompactExample,
  HeatmapCustomScaleExample,
  HeatmapRevenueExample,
} from "../../../web/src/docs/components/heatmap"

const meta = {
  title: "Components/Heatmap",
  component: HeatmapRevenueExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof HeatmapRevenueExample>

export default meta
type Story = StoryObj<typeof meta>

export const DailyRevenue: Story = {}
export const MondayStart: Story = { render: () => <HeatmapCompactExample /> }
export const CustomScale: Story = {
  render: () => <HeatmapCustomScaleExample />,
}

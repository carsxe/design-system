import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  WorldMapControlledExample,
  WorldMapCustomScaleExample,
  WorldMapEmptyExample,
  WorldMapOverviewExample,
} from "../../../web/src/docs/components/world-map-chart"

const meta = {
  title: "Components/World Map Chart",
  component: WorldMapOverviewExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WorldMapOverviewExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ControlledSelection: Story = {
  render: () => <WorldMapControlledExample />,
}
export const CustomScale: Story = {
  render: () => <WorldMapCustomScaleExample />,
}
export const Empty: Story = { render: () => <WorldMapEmptyExample /> }

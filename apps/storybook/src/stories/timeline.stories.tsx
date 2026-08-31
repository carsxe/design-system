import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  TimelineAlternateExample,
  TimelineDefaultExample,
  TimelineEndExample,
  TimelineHorizontalExample,
  TimelineMarkersExample,
  TimelineOppositeExample,
} from "../../../web/src/docs/components/timeline"

const meta = {
  title: "Components/Timeline",
  component: TimelineDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TimelineDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const OppositeContent: Story = {
  render: () => <TimelineOppositeExample />,
}
export const Alternating: Story = { render: () => <TimelineAlternateExample /> }
export const AlignEnd: Story = { render: () => <TimelineEndExample /> }
export const CustomMarkers: Story = {
  render: () => <TimelineMarkersExample />,
}
export const Horizontal: Story = {
  render: () => <TimelineHorizontalExample />,
}

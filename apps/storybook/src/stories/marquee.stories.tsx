import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  MarqueeAlwaysRunningExample,
  MarqueeDefaultExample,
  MarqueeReverseExample,
} from "../../../web/src/docs/components/marquee"

const meta = {
  title: "Components/Marquee",
  component: MarqueeDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof MarqueeDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const HoverToScroll: Story = {}
export const Reversed: Story = { render: () => <MarqueeReverseExample /> }
export const AlwaysRunning: Story = {
  render: () => <MarqueeAlwaysRunningExample />,
}

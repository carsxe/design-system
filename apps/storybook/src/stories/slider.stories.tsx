import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@carsxe/design-system/components/slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: [40], max: 100, className: "max-w-sm" },
}

export const Range: Story = {
  args: { defaultValue: [20, 80], max: 100, className: "max-w-sm" },
}

export const Disabled: Story = {
  args: { defaultValue: [40], disabled: true, className: "max-w-sm" },
}

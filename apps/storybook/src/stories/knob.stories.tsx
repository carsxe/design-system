import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  KnobColorsExample,
  KnobDefaultExample,
  KnobFormExample,
  KnobSizesExample,
  KnobStatesExample,
  KnobTemplateExample,
} from "../../../web/src/docs/components/knob"

const meta = {
  title: "Components/Knob",
  component: KnobDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof KnobDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Sizes: Story = { render: () => <KnobSizesExample /> }
export const ValueTemplate: Story = { render: () => <KnobTemplateExample /> }
export const Colors: Story = { render: () => <KnobColorsExample /> }
export const InsideAForm: Story = { render: () => <KnobFormExample /> }
export const States: Story = { render: () => <KnobStatesExample /> }

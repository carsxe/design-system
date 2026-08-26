import type { Meta, StoryObj } from "@storybook/react-vite"

import { SignaturePad } from "@carsxe/design-system/components/signature-pad"
import { CompoundSignaturePad } from "../../../web/src/docs/components/signature-pad"

const meta = {
  title: "Components/Signature Pad",
  component: SignaturePad,
  args: { label: "Authorized signature", name: "authorization" },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SignaturePad>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Compound: Story = { render: () => <CompoundSignaturePad /> }
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultPaths: [
      [
        { x: 120, y: 180, pressure: 0.5 },
        { x: 310, y: 92, pressure: 0.7 },
        { x: 540, y: 174, pressure: 0.45 },
        { x: 790, y: 105, pressure: 0.65 },
      ],
    ],
  },
}
export const Disabled: Story = { args: { disabled: true } }

import type { Meta, StoryObj } from "@storybook/react-vite"

import { RadioGroup, RadioGroupItem } from "@carsxe/design-system/components/radio-group"
import { Label } from "@carsxe/design-system/components/label"

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="pro">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="free" id="plan-free" />
        <Label htmlFor="plan-free">Free</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="pro" id="plan-pro" />
        <Label htmlFor="plan-pro">Pro</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="enterprise" id="plan-enterprise" />
        <Label htmlFor="plan-enterprise">Enterprise</Label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="pro" id="plan-disabled" />
        <Label htmlFor="plan-disabled">Pro</Label>
      </div>
    </RadioGroup>
  ),
}

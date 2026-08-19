import type { Meta, StoryObj } from "@storybook/react-vite"

import { Separator } from "@carsxe/design-system/components/separator"

const meta = {
  title: "Components/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-sm">
      <p className="text-sm font-medium">Clarity</p>
      <p className="text-sm text-muted-foreground">Design system</p>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">v1.4.2</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-4">
      <span className="text-sm">Docs</span>
      <Separator orientation="vertical" />
      <span className="text-sm">API</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Changelog</span>
    </div>
  ),
}

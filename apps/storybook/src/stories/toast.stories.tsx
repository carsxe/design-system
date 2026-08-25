import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { Button } from "@carsxe/design-system/components/button"

const meta = {
  title: "Components/Sonner",
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.info("System update scheduled")}
    >
      Show info
    </Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success("Configuration exported safely")}>
      Show success
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.warning("Rotate exposed API keys")}
    >
      Show warning
    </Button>
  ),
}

export const ErrorToast: Story = {
  name: "Error",
  render: () => (
    <Button
      variant="destructive"
      onClick={() => toast.error("API endpoint connection failed")}
    >
      Show error
    </Button>
  ),
}

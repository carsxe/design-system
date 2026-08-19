import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@carsxe/design-system/components/button"

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Get Started",
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hover: Story = {
  args: { className: "bg-primary-hover" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const IconLeft: Story = {
  args: {
    children: (
      <>
        <ChevronLeftIcon data-icon="inline-start" />
        Get Started
      </>
    ),
  },
}

export const IconRight: Story = {
  args: {
    children: (
      <>
        Get Started
        <ChevronRightIcon data-icon="inline-end" />
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    size: "icon",
    children: <ChevronLeftIcon />,
    "aria-label": "Back",
  },
}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Ghost: Story = {
  args: { variant: "ghost" },
}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Get Started</Button>
        <Button variant="outline">Get Started</Button>
        <Button variant="ghost">Get Started</Button>
        <Button variant="destructive">Delete</Button>
        <Button disabled>Get Started</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          <ChevronLeftIcon data-icon="inline-start" />
          Get Started
        </Button>
        <Button>
          Get Started
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
        <Button size="icon" aria-label="Back">
          <ChevronLeftIcon />
        </Button>
        <Button size="sm">Small</Button>
      </div>
    </div>
  ),
}

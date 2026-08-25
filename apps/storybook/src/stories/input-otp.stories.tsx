import type { Meta, StoryObj } from "@storybook/react-vite"

import { ExtendedPreview } from "../../../web/src/docs/components/extended"

const meta = {
  title: "Components/Input OTP",
  component: ExtendedPreview,
  args: { slug: "input-otp" },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ExtendedPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

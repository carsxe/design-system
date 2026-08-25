import type { Meta, StoryObj } from "@storybook/react-vite"

import { ExtendedPreview } from "../../../web/src/docs/components/extended"

const meta = {
  title: "Components/Questionnaire",
  component: ExtendedPreview,
  args: { slug: "questionnaire" },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ExtendedPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

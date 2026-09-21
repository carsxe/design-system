import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BubbleConversation,
  BubbleLegacy,
  BubbleWithoutAvatars,
} from "../../../web/src/docs/components/bubble-examples"

const meta = {
  title: "Components/Bubble",
  component: BubbleConversation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BubbleConversation>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const WithoutAvatars: Story = { render: () => <BubbleWithoutAvatars /> }
export const Legacy: Story = { render: () => <BubbleLegacy /> }

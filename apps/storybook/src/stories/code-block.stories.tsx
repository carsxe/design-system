import type { Meta, StoryObj } from "@storybook/react-vite"

import { CodeBlock } from "@carsxe/design-system/components/code-block"
import { codeBlockSample } from "../../../web/src/docs/components/code-block"

const meta = {
  title: "Components/Code Block",
  component: CodeBlock,
  args: {
    code: codeBlockSample,
    language: "typescript",
    label: "vehicles.ts",
  },
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[min(48rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

export const SystemTheme: Story = {}
export const Dracula: Story = { args: { theme: "dracula" } }
export const AyuLight: Story = { args: { theme: "ayu-light" } }
export const ThemePicker: Story = { args: { showThemePicker: true } }
export const CopyOnly: Story = {
  args: {
    code: "bun add @carsxe/design-system",
    language: "bash",
    label: undefined,
  },
}

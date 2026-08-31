import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  SplitButtonDefaultExample,
  SplitButtonLoadingExample,
  SplitButtonSizesExample,
  SplitButtonSubmenuExample,
  SplitButtonVariantsExample,
} from "../../../web/src/docs/components/split-button"

const meta = {
  title: "Components/Split Button",
  component: SplitButtonDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SplitButtonDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Variants: Story = { render: () => <SplitButtonVariantsExample /> }
export const Sizes: Story = { render: () => <SplitButtonSizesExample /> }
export const Submenus: Story = { render: () => <SplitButtonSubmenuExample /> }
export const Loading: Story = { render: () => <SplitButtonLoadingExample /> }

import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StepsDefaultExample,
  StepsDisabledExample,
  StepsLinearExample,
  StepsVerticalExample,
  StepsWizardExample,
} from "../../../web/src/docs/components/steps"

const meta = {
  title: "Components/Steps",
  component: StepsDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof StepsDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Vertical: Story = { render: () => <StepsVerticalExample /> }
export const Linear: Story = { render: () => <StepsLinearExample /> }
export const Wizard: Story = { render: () => <StepsWizardExample /> }
export const DisabledStep: Story = { render: () => <StepsDisabledExample /> }

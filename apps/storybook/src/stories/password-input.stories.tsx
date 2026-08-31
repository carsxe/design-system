import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PasswordInputCustomFeedbackExample,
  PasswordInputCustomStrengthExample,
  PasswordInputDefaultExample,
  PasswordInputFeedbackExample,
  PasswordInputStatesExample,
} from "../../../web/src/docs/components/password-input"

const meta = {
  title: "Components/Password Input",
  component: PasswordInputDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof PasswordInputDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Feedback: Story = {
  render: () => <PasswordInputFeedbackExample />,
}
export const CustomFeedback: Story = {
  render: () => <PasswordInputCustomFeedbackExample />,
}
export const CustomStrength: Story = {
  render: () => <PasswordInputCustomStrengthExample />,
}
export const States: Story = { render: () => <PasswordInputStatesExample /> }

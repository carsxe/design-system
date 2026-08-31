import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  RatingGroupClearExample,
  RatingGroupCountExample,
  RatingGroupDefaultExample,
  RatingGroupFormExample,
  RatingGroupHalfExample,
  RatingGroupIconsExample,
  RatingGroupStatesExample,
  RatingGroupVerticalExample,
} from "../../../web/src/docs/components/rating-group"

const meta = {
  title: "Components/Rating group",
  component: RatingGroupDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RatingGroupDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const HalfValues: Story = { render: () => <RatingGroupHalfExample /> }
export const Clearable: Story = { render: () => <RatingGroupClearExample /> }
export const CustomIcons: Story = { render: () => <RatingGroupIconsExample /> }
export const ItemCount: Story = { render: () => <RatingGroupCountExample /> }
export const Vertical: Story = { render: () => <RatingGroupVerticalExample /> }
export const States: Story = { render: () => <RatingGroupStatesExample /> }
export const InsideAForm: Story = { render: () => <RatingGroupFormExample /> }

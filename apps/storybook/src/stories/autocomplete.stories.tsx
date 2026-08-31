import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  AutocompleteAsyncExample,
  AutocompleteDefaultExample,
  AutocompleteDropdownExample,
  AutocompleteForceSelectionExample,
  AutocompleteGroupedExample,
  AutocompleteMultipleExample,
} from "../../../web/src/docs/components/autocomplete"

const meta = {
  title: "Components/Autocomplete",
  component: AutocompleteDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AutocompleteDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const DebouncedAsync: Story = {
  render: () => <AutocompleteAsyncExample />,
}
export const Dropdown: Story = { render: () => <AutocompleteDropdownExample /> }
export const Multiple: Story = { render: () => <AutocompleteMultipleExample /> }
export const Grouped: Story = { render: () => <AutocompleteGroupedExample /> }
export const ForceSelection: Story = {
  render: () => <AutocompleteForceSelectionExample />,
}

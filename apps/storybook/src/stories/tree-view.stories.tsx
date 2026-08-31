import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  TreeViewCheckboxExample,
  TreeViewDefaultExample,
  TreeViewDragAndDropExample,
  TreeViewExpandAllExample,
  TreeViewFilterExample,
  TreeViewLazyExample,
  TreeViewStrictFilterExample,
  TreeViewTemplateExample,
} from "../../../web/src/docs/components/tree-view"

const meta = {
  title: "Components/Tree view",
  component: TreeViewDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TreeViewDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checkboxes: Story = { render: () => <TreeViewCheckboxExample /> }
export const Filtering: Story = { render: () => <TreeViewFilterExample /> }
export const StrictFiltering: Story = {
  render: () => <TreeViewStrictFilterExample />,
}
export const LazyChildren: Story = { render: () => <TreeViewLazyExample /> }
export const RowTemplate: Story = { render: () => <TreeViewTemplateExample /> }
export const ExpandAll: Story = { render: () => <TreeViewExpandAllExample /> }
export const DragAndDrop: Story = {
  render: () => <TreeViewDragAndDropExample />,
}

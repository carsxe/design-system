import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  MegaMenuDefaultExample,
  MegaMenuPlainExample,
  MegaMenuRenderExample,
  MegaMenuZonesExample,
} from "../../../web/src/docs/components/mega-menu"

const meta = {
  title: "Components/Mega menu",
  component: MegaMenuDefaultExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof MegaMenuDefaultExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Zones: Story = { render: () => <MegaMenuZonesExample /> }
export const SingleColumn: Story = { render: () => <MegaMenuPlainExample /> }
export const CustomLinkElement: Story = {
  render: () => <MegaMenuRenderExample />,
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  MegaMenuDefaultExample,
  MegaMenuPlainExample,
  MegaMenuRenderExample,
  MegaMenuTriggerExample,
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
export const WithTrigger: Story = {
  name: "Sliding indicator and morphing panel",
  render: () => <MegaMenuTriggerExample />,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Public Motion APIs: layoutId slides the trigger pill, a spring opens the shared NavigationMenu viewport (it morphs size between sections instead of remounting), and MegaMenu columns stagger in. Compare with motion.dev/examples/react-mega-menu.",
      },
    },
  },
}
export const Zones: Story = { render: () => <MegaMenuZonesExample /> }
export const SingleColumn: Story = { render: () => <MegaMenuPlainExample /> }
export const CustomLinkElement: Story = {
  render: () => <MegaMenuRenderExample />,
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@carsxe/design-system/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@carsxe/design-system/components/tooltip"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex gap-8 p-12">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Top
        </TooltipTrigger>
        <TooltipContent side="top">Workspace settings</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Right
        </TooltipTrigger>
        <TooltipContent side="right">Open console</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Bottom
        </TooltipTrigger>
        <TooltipContent side="bottom">Copy API key</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Left
        </TooltipTrigger>
        <TooltipContent side="left">Archive record</TooltipContent>
      </Tooltip>
    </div>
  ),
}

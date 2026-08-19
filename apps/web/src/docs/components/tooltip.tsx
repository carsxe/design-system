import { Button } from "@carsxe/design-system/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@carsxe/design-system/components/tooltip"

import type { ComponentDoc } from "./types"

export const tooltip: ComponentDoc = {
  slug: "tooltip",
  title: "Tooltip",
  description:
    "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  importName: "Tooltip, TooltipTrigger, TooltipContent",
  importPath: "@carsxe/design-system/components/tooltip",
  usage: `import { Button } from "@carsxe/design-system/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@carsxe/design-system/components/tooltip"

<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>Hover</TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>`,
  preview: (
    <div className="flex flex-wrap gap-4">
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
  previewCode: `import { Button } from "@carsxe/design-system/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@carsxe/design-system/components/tooltip"

<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>Hover</TooltipTrigger>
  <TooltipContent side="top">Workspace settings</TooltipContent>
</Tooltip>`,
  examples: [],
  props: [
    {
      name: "side",
      type: '"top" | "right" | "bottom" | "left" (TooltipContent)',
      defaultValue: '"top"',
    },
  ],
}

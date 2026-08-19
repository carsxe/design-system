import { Slider } from "@carsxe/design-system/components/slider"

import type { ComponentDoc } from "./types"

export const slider: ComponentDoc = {
  slug: "slider",
  title: "Slider",
  description:
    "An input where the user selects a value from within a given range.",
  importName: "Slider",
  importPath: "@carsxe/design-system/components/slider",
  usage: `import { Slider } from "@carsxe/design-system/components/slider"

<Slider defaultValue={[40]} max={100} />`,
  preview: <Slider defaultValue={[40]} max={100} className="max-w-sm" />,
  previewCode: `import { Slider } from "@carsxe/design-system/components/slider"

<Slider defaultValue={[40]} max={100} className="max-w-sm" />`,
  examples: [
    {
      title: "Range",
      preview: (
        <Slider defaultValue={[20, 80]} max={100} className="max-w-sm" />
      ),
      code: `<Slider defaultValue={[20, 80]} max={100} />`,
    },
    {
      title: "Disabled",
      preview: (
        <Slider defaultValue={[40]} max={100} disabled className="max-w-sm" />
      ),
      code: `<Slider defaultValue={[40]} max={100} disabled />`,
    },
  ],
  props: [
    {
      name: "defaultValue",
      type: "number[]",
    },
    {
      name: "max",
      type: "number",
    },
    {
      name: "disabled",
      type: "boolean",
    },
  ],
}

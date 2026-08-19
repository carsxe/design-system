import { Separator } from "@carsxe/design-system/components/separator"

import type { ComponentDoc } from "./types"

export const separator: ComponentDoc = {
  slug: "separator",
  title: "Separator",
  description: "Visually or semantically separates content.",
  importName: "Separator",
  importPath: "@carsxe/design-system/components/separator",
  usage: `import { Separator } from "@carsxe/design-system/components/separator"

<Separator />`,
  preview: (
    <div className="max-w-sm">
      <p className="text-sm font-medium">Clarity</p>
      <p className="text-sm text-muted-foreground">Design system</p>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">v0.0.1</p>
    </div>
  ),
  previewCode: `import { Separator } from "@carsxe/design-system/components/separator"

<div>
  <p>Clarity</p>
  <p>Design system</p>
  <Separator className="my-4" />
  <p>v0.0.1</p>
</div>`,
  examples: [
    {
      title: "Vertical",
      preview: (
        <div className="flex h-6 items-center gap-4">
          <span className="text-sm">Docs</span>
          <Separator orientation="vertical" />
          <span className="text-sm">API</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Changelog</span>
        </div>
      ),
      code: `<div className="flex h-6 items-center gap-4">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>API</span>
</div>`,
    },
  ],
  props: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
  ],
}

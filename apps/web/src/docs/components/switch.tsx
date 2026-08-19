import { Label } from "@carsxe/design-system/components/label"
import { Switch } from "@carsxe/design-system/components/switch"

import type { ComponentDoc } from "./types"

export const switchDoc: ComponentDoc = {
  slug: "switch",
  title: "Switch",
  description:
    "A control that allows the user to toggle between checked and not checked.",
  importName: "Switch",
  importPath: "@carsxe/design-system/components/switch",
  usage: `import { Switch } from "@carsxe/design-system/components/switch"
import { Label } from "@carsxe/design-system/components/label"

<div className="flex items-center gap-2">
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane mode</Label>
</div>`,
  preview: (
    <div className="flex items-center gap-2">
      <Switch id="docs-switch" defaultChecked />
      <Label htmlFor="docs-switch">Notifications</Label>
    </div>
  ),
  previewCode: `import { Switch } from "@carsxe/design-system/components/switch"
import { Label } from "@carsxe/design-system/components/label"

<div className="flex items-center gap-2">
  <Switch id="notifications" defaultChecked />
  <Label htmlFor="notifications">Notifications</Label>
</div>`,
  examples: [
    {
      title: "Small",
      preview: (
        <div className="flex items-center gap-2">
          <Switch id="docs-switch-sm" size="sm" defaultChecked />
          <Label htmlFor="docs-switch-sm">Compact</Label>
        </div>
      ),
      code: `<Switch size="sm" defaultChecked />`,
    },
    {
      title: "Disabled",
      preview: (
        <div className="flex items-center gap-2">
          <Switch id="docs-switch-disabled" disabled />
          <Label htmlFor="docs-switch-disabled">Unavailable</Label>
        </div>
      ),
      code: `<Switch disabled />`,
    },
  ],
  props: [
    {
      name: "size",
      type: '"default" | "sm"',
      defaultValue: '"default"',
    },
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "disabled",
      type: "boolean",
    },
  ],
}

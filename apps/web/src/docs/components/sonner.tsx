import { Button } from "@carsxe/design-system/components/button"
import { toast } from "sonner"

import type { ComponentDoc } from "./types"

export const sonner: ComponentDoc = {
  slug: "sonner",
  title: "Sonner",
  description: "An opinionated toast component for React.",
  importName: "Toaster",
  importPath: "@carsxe/design-system/components/sonner",
  usage: `import { Toaster } from "@carsxe/design-system/components/sonner"
import { toast } from "sonner"

<Toaster />
<Button onClick={() => toast("Event created")}>Show toast</Button>`,
  preview: (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() => toast.info("System update scheduled")}
      >
        Info
      </Button>
      <Button onClick={() => toast.success("Configuration exported")}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Rotate exposed API keys")}
      >
        Warning
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("API connection failed")}
      >
        Error
      </Button>
    </div>
  ),
  previewCode: `import { Toaster } from "@carsxe/design-system/components/sonner"
import { Button } from "@carsxe/design-system/components/button"
import { toast } from "sonner"

<Toaster />
<Button onClick={() => toast.success("Configuration exported")}>
  Success
</Button>`,
  examples: [],
  props: [
    {
      name: "theme",
      type: '"light" | "dark" | "system"',
      defaultValue: "from next-themes",
    },
  ],
}

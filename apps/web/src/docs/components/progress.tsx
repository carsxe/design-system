import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@carsxe/design-system/components/progress"

import type { ComponentDoc } from "./types"

export const progress: ComponentDoc = {
  slug: "progress",
  title: "Progress",
  description:
    "Displays an indicator showing the completion progress of a task.",
  importName: "Progress, ProgressLabel, ProgressValue",
  importPath: "@carsxe/design-system/components/progress",
  usage: `import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@carsxe/design-system/components/progress"

<Progress value={45}>
  <ProgressLabel>Syncing</ProgressLabel>
  <ProgressValue />
</Progress>`,
  preview: (
    <Progress value={45} className="max-w-md">
      <ProgressLabel>Syncing workspace</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
  previewCode: `import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@carsxe/design-system/components/progress"

<Progress value={45} className="max-w-md">
  <ProgressLabel>Syncing workspace</ProgressLabel>
  <ProgressValue />
</Progress>`,
  examples: [
    {
      title: "Complete",
      preview: (
        <Progress value={100} className="max-w-md">
          <ProgressLabel>Export complete</ProgressLabel>
          <ProgressValue />
        </Progress>
      ),
      code: `<Progress value={100}>
  <ProgressLabel>Export complete</ProgressLabel>
  <ProgressValue />
</Progress>`,
    },
  ],
  props: [
    {
      name: "value",
      type: "number",
    },
  ],
}

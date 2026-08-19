import { Skeleton } from "@carsxe/design-system/components/skeleton"

import type { ComponentDoc } from "./types"

export const skeleton: ComponentDoc = {
  slug: "skeleton",
  title: "Skeleton",
  description: "Use to show a placeholder while content is loading.",
  importName: "Skeleton",
  importPath: "@carsxe/design-system/components/skeleton",
  usage: `import { Skeleton } from "@carsxe/design-system/components/skeleton"

<Skeleton className="h-4 w-[120px]" />`,
  preview: (
    <div className="flex max-w-sm items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  previewCode: `import { Skeleton } from "@carsxe/design-system/components/skeleton"

<div className="flex items-center gap-4">
  <Skeleton className="size-10 rounded-full" />
  <div className="grid flex-1 gap-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
</div>`,
  examples: [
    {
      title: "Form",
      preview: (
        <div className="grid max-w-sm gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
      ),
      code: `<div className="grid gap-3">
  <Skeleton className="h-4 w-24" />
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-24 w-full" />
</div>`,
    },
  ],
  props: [
    {
      name: "className",
      type: "string",
    },
  ],
}

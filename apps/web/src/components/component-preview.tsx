import type { ReactNode } from "react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@carsxe/design-system/components/tabs"

import { CodeBlock } from "@/components/code-block"

export function ComponentPreview({
  preview,
  code,
}: {
  preview: ReactNode
  code: string
}) {
  return (
    <Tabs defaultValue="preview" className="w-full gap-0">
      <TabsList variant="line" className="px-0">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="flex min-h-[220px] items-center justify-center overflow-x-auto border border-border bg-card p-8"
      >
        {preview}
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code} lang="tsx" />
      </TabsContent>
    </Tabs>
  )
}

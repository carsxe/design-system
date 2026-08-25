import type { ReactNode } from "react"

export type PropRow = {
  name: string
  type: string
  defaultValue?: string
}

export type ComponentExample = {
  title: string
  preview: ReactNode
  code: string
}

export type ComponentDoc = {
  slug: string
  title: string
  description: string
  importName?: string
  importPath?: string
  usage: string
  preview: ReactNode
  previewCode: string
  examples: ComponentExample[]
  props: PropRow[]
}

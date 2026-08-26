import {
  CODE_BLOCK_THEMES,
  CodeBlock,
} from "@carsxe/design-system/components/code-block"

import type { ComponentDoc } from "./types"

const sample = `type Vehicle = {
  vin: string
  status: "listed" | "sold"
}

export function getActiveVehicles(vehicles: Vehicle[]) {
  return vehicles.filter((vehicle) => vehicle.status === "listed")
}`

function ThemeCatalogSummary() {
  const lightThemes = CODE_BLOCK_THEMES.filter(
    (theme) => theme.type === "light"
  ).length
  const darkThemes = CODE_BLOCK_THEMES.filter(
    (theme) => theme.type === "dark"
  ).length

  return (
    <div className="grid w-full gap-3">
      <p className="text-sm text-muted-foreground">
        Search {CODE_BLOCK_THEMES.length} bundled themes: {lightThemes} light
        and {darkThemes} dark.
      </p>
      <CodeBlock
        code={sample}
        language="typescript"
        label="vehicles.ts"
        showThemePicker
      />
    </div>
  )
}

export const codeBlock: ComponentDoc = {
  slug: "code-block",
  title: "Code Block",
  description:
    "A Shiki-powered code viewer with every bundled theme, lazy language loading, and accessible copy controls. Theme changes stay in code unless the picker is enabled.",
  importName: "CodeBlock",
  importPath: "@carsxe/design-system/components/code-block",
  usage: `import { CodeBlock } from "@carsxe/design-system/components/code-block"

<CodeBlock
  code={source}
  language="typescript"
  label="vehicles.ts"
/>`,
  preview: <ThemeCatalogSummary />,
  previewCode: `<CodeBlock code={source} language="typescript" label="vehicles.ts" showThemePicker />`,
  examples: [
    {
      title: "Dracula",
      preview: (
        <CodeBlock
          code={sample}
          language="typescript"
          theme="dracula"
          label="vehicles.ts"
        />
      ),
      code: `<CodeBlock code={source} language="typescript" theme="dracula" />`,
    },
    {
      title: "Ayu Light",
      preview: (
        <CodeBlock
          code={sample}
          language="typescript"
          theme="ayu-light"
          label="vehicles.ts"
        />
      ),
      code: `<CodeBlock code={source} language="typescript" theme="ayu-light" />`,
    },
    {
      title: "Theme picker",
      preview: (
        <CodeBlock
          code={sample}
          language="typescript"
          label="vehicles.ts"
          showThemePicker
        />
      ),
      code: `<CodeBlock code={source} language="typescript" showThemePicker />`,
    },
    {
      title: "Copy only",
      preview: (
        <CodeBlock code="bun add @carsxe/design-system" language="bash" />
      ),
      code: `<CodeBlock code="bun add @carsxe/design-system" language="bash" />`,
    },
  ],
  props: [
    { name: "code", type: "string" },
    {
      name: "language",
      type: 'BundledLanguage | "text"',
      defaultValue: '"tsx"',
    },
    { name: "label", type: "ReactNode" },
    {
      name: "theme / defaultTheme",
      type: '"system" | BundledTheme',
      defaultValue: '"system"',
    },
    {
      name: "lightTheme / darkTheme",
      type: "BundledTheme",
      defaultValue: '"github-light" / "github-dark"',
    },
    { name: "onThemeChange", type: "(theme: CodeBlockTheme) => void" },
    {
      name: "showThemePicker",
      type: "boolean",
      defaultValue: "false",
    },
    {
      name: "showCopyButton",
      type: "boolean",
      defaultValue: "true",
    },
    { name: "onCopy / onCopyError", type: "callback" },
  ],
}

export { sample as codeBlockSample, ThemeCatalogSummary }

import * as React from "react"
import { Knob } from "@carsxe/design-system/components/knob"
import { Label } from "@carsxe/design-system/components/label"

import type { ComponentDoc } from "./types"

function KnobDefaultExample() {
  const [value, setValue] = React.useState(60)

  return (
    <div className="flex flex-col items-center gap-2">
      <Knob aria-label="Engine load" value={value} onValueChange={setValue} />
      <p className="text-xs text-muted-foreground">
        Drag around the dial, or focus it and use the arrow keys.
      </p>
    </div>
  )
}

function KnobSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Knob aria-label="Small" defaultValue={35} size={64} strokeWidth={10} />
      <Knob aria-label="Medium" defaultValue={55} />
      <Knob aria-label="Large" defaultValue={75} size={140} strokeWidth={18} />
    </div>
  )
}

function KnobTemplateExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Knob aria-label="Fuel level" defaultValue={72}>
        {(value) => `${value}%`}
      </Knob>
      <Knob
        aria-label="Torque"
        defaultValue={320}
        min={0}
        max={500}
        step={10}
        valueColor="var(--color-chart-2)"
      >
        {(value) => `${value}Nm`}
      </Knob>
    </div>
  )
}

function KnobColorsExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Knob
        aria-label="Coolant"
        defaultValue={45}
        valueColor="var(--color-chart-1)"
        rangeColor="var(--color-chart-1)/0.15"
      />
      <Knob
        aria-label="Oil pressure"
        defaultValue={80}
        valueColor="var(--color-destructive)"
        textColor="var(--color-destructive)"
      />
    </div>
  )
}

function KnobFormExample() {
  return (
    <form
      className="flex flex-col items-center gap-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <Label htmlFor="throttle">Throttle</Label>
      <Knob id="throttle" name="throttle" defaultValue={25} step={5} />
    </form>
  )
}

function KnobStatesExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Knob aria-label="Read only" defaultValue={40} readOnly />
      <Knob aria-label="Disabled" defaultValue={40} disabled />
      <Knob aria-label="No value shown" defaultValue={40} showValue={false} />
    </div>
  )
}

const knob = {
  slug: "knob",
  title: "Knob",
  description:
    "A circular dial for entering a number in a range. It sweeps 270° with a gap at the bottom, and can be driven by dragging around the dial or with the keyboard: arrows step, Page Up and Page Down move ten steps, and Home and End jump to the ends. The printed value can be replaced with a template, and the arc colours are CSS variables so charts and themes can override them.",
  importName: "Knob",
  importPath: "@carsxe/design-system/components/knob",
  usage: `import { Knob } from "@carsxe/design-system/components/knob"

const [value, setValue] = React.useState(60)

<Knob aria-label="Engine load" value={value} onValueChange={setValue} />`,
  preview: <KnobDefaultExample />,
  previewCode: `<Knob aria-label="Engine load" value={value} onValueChange={setValue} />`,
  examples: [
    {
      title: "Sizes",
      preview: <KnobSizesExample />,
      code: `<Knob aria-label="Small" defaultValue={35} size={64} strokeWidth={10} />
<Knob aria-label="Medium" defaultValue={55} />
<Knob aria-label="Large" defaultValue={75} size={140} strokeWidth={18} />`,
    },
    {
      title: "Value template and custom range",
      preview: <KnobTemplateExample />,
      code: `<Knob aria-label="Fuel level" defaultValue={72}>
  {(value) => \`\${value}%\`}
</Knob>

<Knob aria-label="Torque" defaultValue={320} min={0} max={500} step={10}>
  {(value) => \`\${value}Nm\`}
</Knob>`,
    },
    {
      title: "Colors",
      preview: <KnobColorsExample />,
      code: `<Knob
  aria-label="Coolant"
  defaultValue={45}
  valueColor="var(--color-chart-1)"
  rangeColor="var(--color-chart-1)/0.15"
/>`,
    },
    {
      title: "Inside a form",
      preview: <KnobFormExample />,
      code: `// A name prop renders a hidden input so the knob submits with the form.
<Label htmlFor="throttle">Throttle</Label>
<Knob id="throttle" name="throttle" defaultValue={25} step={5} />`,
    },
    {
      title: "Read-only, disabled, and value hidden",
      preview: <KnobStatesExample />,
      code: `<Knob aria-label="Read only" defaultValue={40} readOnly />
<Knob aria-label="Disabled" defaultValue={40} disabled />
<Knob aria-label="No value shown" defaultValue={40} showValue={false} />`,
    },
  ],
  props: [
    { name: "value", type: "number" },
    { name: "defaultValue", type: "number", defaultValue: "0" },
    { name: "onValueChange", type: "(value: number) => void" },
    { name: "min", type: "number", defaultValue: "0" },
    { name: "max", type: "number", defaultValue: "100" },
    { name: "step", type: "number", defaultValue: "1" },
    { name: "size", type: "number", defaultValue: "96 (px)" },
    { name: "strokeWidth", type: "number", defaultValue: "14" },
    { name: "showValue", type: "boolean", defaultValue: "true" },
    { name: "children", type: "ReactNode | (value: number) => ReactNode" },
    { name: "valueColor", type: "string" },
    { name: "rangeColor", type: "string" },
    { name: "textColor", type: "string" },
    { name: "readOnly", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "name", type: "string" },
  ],
} satisfies ComponentDoc

export {
  knob,
  KnobColorsExample,
  KnobDefaultExample,
  KnobFormExample,
  KnobSizesExample,
  KnobStatesExample,
  KnobTemplateExample,
}

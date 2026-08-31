import * as React from "react"
import { Button } from "@carsxe/design-system/components/button"
import { Input } from "@carsxe/design-system/components/input"
import { Label } from "@carsxe/design-system/components/label"
import {
  Steps,
  StepsContent,
  StepsPanel,
  StepsRoot,
  useSteps,
  type Step,
} from "@carsxe/design-system/components/steps"

import type { ComponentDoc } from "./types"

const checkout: Step[] = [
  { id: "vehicle", title: "Vehicle", description: "VIN or plate" },
  { id: "contact", title: "Contact", description: "Where to send it" },
  { id: "review", title: "Review", description: "Confirm and order" },
]

function StepsDefaultExample() {
  const [value, setValue] = React.useState(1)

  return (
    <div className="w-full max-w-2xl">
      <Steps steps={checkout} value={value} onValueChange={setValue} />
    </div>
  )
}

function StepsVerticalExample() {
  return (
    <div className="w-full max-w-xs">
      <Steps steps={checkout} orientation="vertical" defaultValue={1} />
    </div>
  )
}

function StepsLinearExample() {
  return (
    <div className="w-full max-w-2xl">
      <Steps steps={checkout} linear defaultValue={1} />
      <p className="mt-3 text-xs text-muted-foreground">
        The third indicator is disabled: linear steps can be revisited but not
        skipped ahead.
      </p>
    </div>
  )
}

function StepsFooter() {
  const { next, prev, isFirst, isLast } = useSteps()

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={prev} disabled={isFirst}>
        Back
      </Button>
      <Button onClick={next} disabled={isLast}>
        {isLast ? "Done" : "Continue"}
      </Button>
    </div>
  )
}

function StepsWizardExample() {
  return (
    <StepsRoot steps={checkout} linear className="w-full max-w-2xl">
      <Steps />
      <StepsContent>
        <StepsPanel step="vehicle" className="flex flex-col gap-2">
          <Label htmlFor="wizard-vin">VIN</Label>
          <Input id="wizard-vin" placeholder="1HGCM82633A004352" />
        </StepsPanel>
        <StepsPanel step="contact" className="flex flex-col gap-2">
          <Label htmlFor="wizard-email">Email</Label>
          <Input id="wizard-email" type="email" placeholder="you@example.com" />
        </StepsPanel>
        <StepsPanel step="review">
          {(helpers) => (
            <p className="text-sm text-muted-foreground">
              Step {helpers.index + 1} of {helpers.steps.length}. Ordering the
              report charges the account on file.
            </p>
          )}
        </StepsPanel>
      </StepsContent>
      <StepsFooter />
    </StepsRoot>
  )
}

function StepsDisabledExample() {
  return (
    <div className="w-full max-w-2xl">
      <Steps
        steps={[
          { id: "vehicle", title: "Vehicle" },
          { id: "finance", title: "Finance", disabled: true },
          { id: "review", title: "Review" },
        ]}
        defaultValue={0}
      />
    </div>
  )
}

const steps = {
  slug: "steps",
  title: "Steps",
  description:
    "A step indicator for multi-step flows. Used on its own it is a controllable indicator; wrapped in StepsRoot it also drives panels, which stay mounted while hidden so form state survives navigation. useSteps exposes next, prev, and goTo for footer buttons, and linear stops a step ahead of the current one from being clicked while still allowing programmatic jumps.",
  importName: "Steps",
  importPath: "@carsxe/design-system/components/steps",
  usage: `import { Steps } from "@carsxe/design-system/components/steps"

const [value, setValue] = React.useState(1)

<Steps steps={checkout} value={value} onValueChange={setValue} />`,
  preview: <StepsDefaultExample />,
  previewCode: `<Steps steps={checkout} value={value} onValueChange={setValue} />`,
  examples: [
    {
      title: "Vertical",
      preview: <StepsVerticalExample />,
      code: `<Steps steps={checkout} orientation="vertical" defaultValue={1} />`,
    },
    {
      title: "Linear",
      preview: <StepsLinearExample />,
      code: `// Steps ahead of the current one cannot be clicked; earlier ones can.
<Steps steps={checkout} linear defaultValue={1} />`,
    },
    {
      title: "Wizard with panels",
      preview: <StepsWizardExample />,
      code: `import {
  Steps,
  StepsContent,
  StepsPanel,
  StepsRoot,
  useSteps,
} from "@carsxe/design-system/components/steps"

function Footer() {
  const { next, prev, isFirst, isLast } = useSteps()
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={prev} disabled={isFirst}>Back</Button>
      <Button onClick={next} disabled={isLast}>{isLast ? "Done" : "Continue"}</Button>
    </div>
  )
}

<StepsRoot steps={checkout} linear>
  <Steps />
  <StepsContent>
    <StepsPanel step="vehicle">…</StepsPanel>
    <StepsPanel step="contact">…</StepsPanel>
    <StepsPanel step="review">
      {(helpers) => <p>Step {helpers.index + 1} of {helpers.steps.length}.</p>}
    </StepsPanel>
  </StepsContent>
  <Footer />
</StepsRoot>`,
    },
    {
      title: "Disabled step",
      preview: <StepsDisabledExample />,
      code: `<Steps
  steps={[
    { id: "vehicle", title: "Vehicle" },
    { id: "finance", title: "Finance", disabled: true },
    { id: "review", title: "Review" },
  ]}
/>`,
    },
  ],
  props: [
    { name: "steps", type: "Step[]", defaultValue: "from StepsRoot" },
    { name: "value", type: "number" },
    { name: "defaultValue", type: "number", defaultValue: "0" },
    { name: "onValueChange", type: "(value: number) => void" },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
    { name: "linear", type: "boolean", defaultValue: "false" },
  ],
} satisfies ComponentDoc

export {
  steps,
  StepsDefaultExample,
  StepsDisabledExample,
  StepsLinearExample,
  StepsVerticalExample,
  StepsWizardExample,
}

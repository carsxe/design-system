import {
  SignaturePad,
  SignaturePadClearTrigger,
  SignaturePadControl,
  SignaturePadGuide,
  SignaturePadHiddenInput,
  SignaturePadLabel,
  SignaturePadRedoTrigger,
  SignaturePadRoot,
  SignaturePadSegment,
  SignaturePadUndoTrigger,
} from "@carsxe/design-system/components/signature-pad"

import type { ComponentDoc } from "./types"

function CompoundSignaturePad() {
  return (
    <SignaturePadRoot name="authorization" required className="w-full max-w-xl">
      <SignaturePadLabel>Authorized signature</SignaturePadLabel>
      <SignaturePadControl>
        <SignaturePadSegment />
        <SignaturePadGuide>
          Sign to approve the inspection report
        </SignaturePadGuide>
      </SignaturePadControl>
      <div className="flex gap-2">
        <SignaturePadUndoTrigger />
        <SignaturePadRedoTrigger />
        <SignaturePadClearTrigger />
      </div>
      <SignaturePadHiddenInput />
    </SignaturePadRoot>
  )
}

const signaturePad = {
  slug: "signature-pad",
  title: "Signature Pad",
  description:
    "A controlled or composable signature surface with pressure-aware drawing, history, form values, and image export.",
  importName: "SignaturePad",
  importPath: "@carsxe/design-system/components/signature-pad",
  usage: `import { SignaturePad } from "@carsxe/design-system/components/signature-pad"

<SignaturePad name="authorization" label="Authorized signature" />`,
  preview: (
    <SignaturePad
      name="authorization"
      label="Authorized signature"
      className="w-full max-w-xl"
    />
  ),
  previewCode: `<SignaturePad name="authorization" label="Authorized signature" />`,
  examples: [
    {
      title: "Compound anatomy",
      preview: <CompoundSignaturePad />,
      code: `<SignaturePadRoot name="authorization" required>
  <SignaturePadLabel>Authorized signature</SignaturePadLabel>
  <SignaturePadControl>
    <SignaturePadSegment />
    <SignaturePadGuide>Sign above the line</SignaturePadGuide>
  </SignaturePadControl>
  <SignaturePadUndoTrigger />
  <SignaturePadRedoTrigger />
  <SignaturePadClearTrigger />
  <SignaturePadHiddenInput />
</SignaturePadRoot>`,
    },
    {
      title: "Read-only signature",
      preview: (
        <SignaturePad
          readOnly
          label="Recorded authorization"
          defaultPaths={[
            [
              { x: 120, y: 180, pressure: 0.5 },
              { x: 310, y: 92, pressure: 0.7 },
              { x: 540, y: 174, pressure: 0.45 },
              { x: 790, y: 105, pressure: 0.65 },
            ],
          ]}
          className="w-full max-w-xl"
        />
      ),
      code: `<SignaturePad readOnly defaultPaths={savedPaths} />`,
    },
  ],
  props: [
    { name: "paths", type: "SignaturePath[]" },
    { name: "defaultPaths", type: "SignaturePath[]", defaultValue: "[]" },
    { name: "onPathsChange", type: "(paths: SignaturePath[]) => void" },
    { name: "onDraw / onDrawEnd", type: "(details) => void" },
    { name: "drawing", type: "{ size?: number; simulatePressure?: boolean }" },
    {
      name: "disabled / readOnly / required",
      type: "boolean",
      defaultValue: "false",
    },
    { name: "name", type: "string" },
  ],
} satisfies ComponentDoc

export { CompoundSignaturePad, signaturePad }

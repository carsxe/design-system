import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@carsxe/design-system/components/accordion"

import type { ComponentDoc } from "./types"

export const accordion: ComponentDoc = {
  slug: "accordion",
  title: "Accordion",
  description: "A vertically stacked set of interactive headings.",
  importName: "Accordion, AccordionItem, AccordionTrigger, AccordionContent",
  importPath: "@carsxe/design-system/components/accordion",
  usage: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@carsxe/design-system/components/accordion"

<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It uses Base UI primitives.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  preview: (
    <Accordion className="max-w-xl" defaultValue={["auth"]}>
      <AccordionItem value="auth">
        <AccordionTrigger>Authentication</AccordionTrigger>
        <AccordionContent>
          API keys are scoped per workspace. Rotate credentials from the
          developer console without invalidating live traffic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>
          Seats are billed monthly. Unused seats roll over for one cycle.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  previewCode: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@carsxe/design-system/components/accordion"

<Accordion defaultValue={["auth"]}>
  <AccordionItem value="auth">
    <AccordionTrigger>Authentication</AccordionTrigger>
    <AccordionContent>
      API keys are scoped per workspace.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="billing">
    <AccordionTrigger>Billing</AccordionTrigger>
    <AccordionContent>Seats are billed monthly.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  examples: [],
  props: [
    {
      name: "defaultValue",
      type: "string[]",
    },
  ],
}

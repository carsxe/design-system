import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@carsxe/design-system/components/accordion"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
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
      <AccordionItem value="limits">
        <AccordionTrigger>Rate limits</AccordionTrigger>
        <AccordionContent>
          Burst traffic is allowed for 60 seconds before the standard quota
          applies.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

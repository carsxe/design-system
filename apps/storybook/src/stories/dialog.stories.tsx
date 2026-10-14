import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@carsxe/design-system/components/dialog"
import { Button } from "@carsxe/design-system/components/button"

const meta = {
  title: "Components/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const WideContent: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />} nativeButton={false}>
        Open wide dialog
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Confirm payment</DialogTitle>
          <DialogDescription>
            Amounts stay inside the dialog. Extra rows scroll vertically.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-8">
          <span>Subtotal</span>
          <span className="whitespace-nowrap">$5.00 USD</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>Taxes</span>
          <span className="whitespace-nowrap">$0.40 USD</span>
        </div>
        <div className="flex justify-between gap-8 font-medium">
          <span>Total</span>
          <span className="whitespace-nowrap">$5.40 USD</span>
        </div>
        <p className="max-w-none whitespace-nowrap">
          VIN-1HGCM82633A004352-plate-confirm-payment-should-not-widen-the-dialog
        </p>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>Line {index + 1} of a tall confirmation.</p>
        ))}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />} nativeButton={false}>
            Back
          </DialogClose>
          <Button>Confirm payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />} nativeButton={false}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete workspace?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The workspace, members, and stored
            credentials will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />} nativeButton={false}>
            Cancel
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

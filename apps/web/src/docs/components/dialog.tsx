import { Button } from "@carsxe/design-system/components/button"
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

import type { ComponentDoc } from "./types"

export const dialog: ComponentDoc = {
  slug: "dialog",
  title: "Dialog",
  description:
    "A window overlaid on the primary window, rendering the content underneath inert.",
  importName:
    "Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose",
  importPath: "@carsxe/design-system/components/dialog",
  usage: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@carsxe/design-system/components/dialog"
import { Button } from "@carsxe/design-system/components/button"

<Dialog>
  <DialogTrigger render={<Button variant="outline" />} nativeButton={false}>
    Open
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
  preview: (
    <Dialog>
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
  previewCode: `import { Button } from "@carsxe/design-system/components/button"
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

<Dialog>
  <DialogTrigger render={<Button variant="outline" />} nativeButton={false}>
    Open dialog
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete workspace?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />} nativeButton={false}>
        Cancel
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
  examples: [],
  props: [],
}

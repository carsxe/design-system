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
    "A window overlaid on the primary window, rendering the content underneath inert. DialogContent is a flex column capped at 90vh with overflow hidden. Put DialogHeader and DialogFooter directly inside it and they stay pinned; everything between them scrolls (overflow-y-auto, overflow-x-hidden, min-h-0). DialogBody is optional — omit it and that middle region is created for you, or pass one DialogBody when you want to own the scroll region. overflow-hidden skips that automatic body and still keeps the default p-6 unless you pass your own padding. p-0 and a viewport height (h-dvh, h-screen, h-full, inset-0, h-[100…]) also skip the body. p-0 replaces the padding.",
  importName:
    "Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose",
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

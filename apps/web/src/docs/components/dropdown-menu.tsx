import { Button } from "@carsxe/design-system/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@carsxe/design-system/components/dropdown-menu"
import {
  ArchiveIcon,
  CopyIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import type { ComponentDoc } from "./types"

export const dropdownMenu: ComponentDoc = {
  slug: "dropdown-menu",
  title: "Dropdown Menu",
  description:
    "Displays a menu to the user — such as a set of actions or functions — triggered by a button.",
  importName:
    "DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem",
  importPath: "@carsxe/design-system/components/dropdown-menu",
  usage: `import { Button } from "@carsxe/design-system/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@carsxe/design-system/components/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />} nativeButton={false}>
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  preview: (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" />}
        nativeButton={false}
      >
        <MoreVerticalIcon />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveIcon />
            Archive
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  previewCode: `import { Button } from "@carsxe/design-system/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@carsxe/design-system/components/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" size="icon" />} nativeButton={false}>
    <MoreVerticalIcon />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  examples: [],
  props: [
    {
      name: "variant",
      type: '"default" | "destructive" (DropdownMenuItem)',
      defaultValue: '"default"',
    },
  ],
}

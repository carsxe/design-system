import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@carsxe/design-system/components/avatar"

import type { ComponentDoc } from "./types"

export const avatar: ComponentDoc = {
  slug: "avatar",
  title: "Avatar",
  description: "An image element with a fallback for representing a user.",
  importName: "Avatar, AvatarImage, AvatarFallback",
  importPath: "@carsxe/design-system/components/avatar",
  usage: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@carsxe/design-system/components/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
  preview: (
    <Avatar>
      <AvatarFallback>CX</AvatarFallback>
    </Avatar>
  ),
  previewCode: `import { Avatar, AvatarFallback } from "@carsxe/design-system/components/avatar"

<Avatar>
  <AvatarFallback>CX</AvatarFallback>
</Avatar>`,
  examples: [
    {
      title: "Image",
      preview: (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      code: `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
    },
    {
      title: "Size",
      preview: (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </div>
      ),
      code: `<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
<Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>`,
    },
    {
      title: "Group",
      preview: (
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>BK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      ),
      code: `import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@carsxe/design-system/components/avatar"

<AvatarGroup>
  <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>BK</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>CM</AvatarFallback></Avatar>
  <AvatarGroupCount>+4</AvatarGroupCount>
</AvatarGroup>`,
    },
  ],
  props: [
    {
      name: "size",
      type: '"default" | "sm" | "lg"',
      defaultValue: '"default"',
    },
  ],
}

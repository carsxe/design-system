import { Button } from "@carsxe/design-system/components/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@carsxe/design-system/components/navigation-menu"

import type { ComponentDoc } from "./types"

export const navigationMenu: ComponentDoc = {
  slug: "navigation-menu",
  title: "Navigation Menu",
  description: "A collection of links for navigating websites.",
  importName:
    "NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink",
  importPath: "@carsxe/design-system/components/navigation-menu",
  usage: `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@carsxe/design-system/components/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
  preview: (
    <div className="flex w-full max-w-3xl items-center justify-between border border-border bg-card px-6 py-3">
      <span className="text-sm font-medium">Carsxe</span>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className="border-b-2 border-primary font-semibold text-primary"
            >
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Resources</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Button size="sm">Console</Button>
    </div>
  ),
  previewCode: `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@carsxe/design-system/components/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="#">Dashboard</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#">Resources</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
  examples: [],
  props: [],
}

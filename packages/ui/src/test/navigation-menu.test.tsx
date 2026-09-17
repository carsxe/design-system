import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/navigation-menu"

afterEach(cleanup)

function renderMenu(props: { sideOffset?: number } = {}) {
  return render(
    <NavigationMenu {...props}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe("NavigationMenu", () => {
  /**
   * The root owns the positioner, so positioning props only reach it by being
   * forwarded explicitly. Left in `...props` they land on the rendered element
   * instead: React drops the unknown prop with a warning, and the offset is
   * silently ignored while the positioner keeps its default.
   */
  it("forwards sideOffset to the positioner rather than the DOM", () => {
    const { container } = renderMenu({ sideOffset: 24 })

    const root = container.querySelector('[data-slot="navigation-menu"]')
    expect(root).not.toBeNull()
    expect(root?.hasAttribute("sideoffset")).toBe(false)
  })

  it("renders without a sideOffset, leaving the positioner default in place", () => {
    const { container } = renderMenu()

    expect(
      container.querySelector('[data-slot="navigation-menu"]')
    ).not.toBeNull()
  })
})

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  MegaMenu,
  MegaMenuColumn,
  MegaMenuGroup,
  MegaMenuGroupLabel,
  MegaMenuItem,
  MegaMenuLink,
  MegaMenuList,
  MegaMenuMore,
  MegaMenuSeparator,
  MegaMenuTrigger,
  splitIntoColumns,
} from "../components/mega-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "../components/navigation-menu"
import { useReducedMotionAfterMount } from "../hooks/use-reduced-motion"

let reducedMotion = false

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    // importOriginal() is untyped in this mock factory.
    ...(actual as { [key: string]: unknown }),
    useReducedMotion: () => reducedMotion,
  }
})

afterEach(cleanup)

beforeEach(() => {
  reducedMotion = false
})

function slots(container: HTMLElement, slot: string) {
  return Array.from(container.querySelectorAll(`[data-slot="${slot}"]`))
}

describe("MegaMenu", () => {
  it("renders a row's title, description, and icon", () => {
    const { container } = render(
      <MegaMenu>
        <MegaMenuColumn>
          <MegaMenuGroup>
            <MegaMenuItem
              href="/vin-decoder"
              icon={<svg data-testid="icon" />}
              title="VIN Decoder"
              description="Decode any VIN."
            />
          </MegaMenuGroup>
        </MegaMenuColumn>
      </MegaMenu>
    )
    expect(screen.getByRole("link", { name: /VIN Decoder/ })).toHaveAttribute(
      "href",
      "/vin-decoder"
    )
    expect(slots(container, "mega-menu-item-title")[0]).toHaveTextContent(
      "VIN Decoder"
    )
    expect(slots(container, "mega-menu-item-description")[0]).toHaveTextContent(
      "Decode any VIN."
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("gives the panel, columns, groups, and rows room to breathe", () => {
    const { container } = render(
      <MegaMenu>
        <MegaMenuColumn>
          <MegaMenuGroup>
            <MegaMenuGroupLabel>Vehicle data</MegaMenuGroupLabel>
            <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
            <MegaMenuLink href="/docs">Documentation</MegaMenuLink>
            <MegaMenuMore href="/all-products">All products</MegaMenuMore>
          </MegaMenuGroup>
        </MegaMenuColumn>
      </MegaMenu>
    )
    expect(slots(container, "mega-menu")[0]).toHaveClass("py-6")
    expect(slots(container, "mega-menu-column")[0]).toHaveClass("gap-5", "px-5")
    expect(slots(container, "mega-menu-group")[0]).toHaveClass("gap-1")
    expect(slots(container, "mega-menu-group-label")[0]).toHaveClass(
      "px-3",
      "pb-2.5"
    )
    expect(screen.getByRole("link", { name: "VIN Decoder" })).toHaveClass(
      "px-3",
      "py-2.5",
      "gap-3"
    )
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveClass(
      "px-3",
      "py-2"
    )
    expect(screen.getByRole("link", { name: "All products" })).toHaveClass(
      "px-3",
      "py-1"
    )
  })

  it("animates a hover fill on rows when motion is allowed", () => {
    const { container } = render(
      <MegaMenuItem
        href="/vin-decoder"
        icon={<svg data-testid="icon" />}
        title="VIN Decoder"
      />
    )
    expect(slots(container, "mega-menu-hover-fill")).toHaveLength(1)
    expect(slots(container, "mega-menu-item-icon")[0].tagName).toBe("SPAN")
    expect(screen.getByRole("link", { name: "VIN Decoder" })).not.toHaveClass(
      "hover:bg-muted"
    )
  })

  it("falls back to colour-only hover when motion is reduced", () => {
    reducedMotion = true
    const { container } = render(
      <MegaMenuItem
        href="/vin-decoder"
        icon={<svg data-testid="icon" />}
        title="VIN Decoder"
      />
    )
    expect(slots(container, "mega-menu-hover-fill")).toHaveLength(0)
    expect(screen.getByRole("link", { name: "VIN Decoder" })).toHaveClass(
      "hover:bg-muted"
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("omits the icon and description chrome when they are not given", () => {
    const { container } = render(
      <MegaMenuItem href="/pricing" title="Pricing" />
    )
    expect(slots(container, "mega-menu-item-icon")).toHaveLength(0)
    expect(slots(container, "mega-menu-item-description")).toHaveLength(0)
    expect(slots(container, "mega-menu-item-title")[0]).toHaveTextContent(
      "Pricing"
    )
  })

  it("renders a row as the element the consumer supplies", () => {
    // The whole point of `render`: an app's own Link, not a bare anchor.
    function AppLink(props: React.ComponentProps<"a">) {
      return <a data-app-link="true" {...props} />
    }
    render(
      <MegaMenuItem
        href="/widgets"
        title="Widgets"
        render={<AppLink data-track-label="Widgets" />}
      />
    )
    const link = screen.getByRole("link", { name: "Widgets" })
    expect(link).toHaveAttribute("data-app-link", "true")
    expect(link).toHaveAttribute("data-track-label", "Widgets")
    expect(link).toHaveAttribute("href", "/widgets")
  })

  it("keeps the consumer's className alongside its own", () => {
    render(<MegaMenuItem href="/x" title="X" className="w-[188px]" />)
    const link = screen.getByRole("link", { name: "X" })
    expect(link).toHaveClass("w-[188px]")
    expect(link).toHaveClass("flex")
  })

  it("appends a decorative arrow to the more link", () => {
    render(<MegaMenuMore href="/all-products">All products</MegaMenuMore>)
    const link = screen.getByRole("link")
    // The arrow is decorative, so the accessible name stays the label alone.
    expect(link).toHaveAccessibleName("All products")
    expect(link.textContent).toContain("→")
    expect(link.querySelector("[aria-hidden='true']")).not.toBeNull()
  })

  it("renders a group label and plain text links", () => {
    const { container } = render(
      <MegaMenu>
        <MegaMenuColumn>
          <MegaMenuGroupLabel>Browse</MegaMenuGroupLabel>
          <MegaMenuLink href="/blog">Blog</MegaMenuLink>
          <MegaMenuLink
            href="https://status.carsxe.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Status
          </MegaMenuLink>
        </MegaMenuColumn>
      </MegaMenu>
    )
    expect(slots(container, "mega-menu-group-label")[0]).toHaveTextContent(
      "Browse"
    )
    expect(slots(container, "mega-menu-link")).toHaveLength(2)
    expect(screen.getByRole("link", { name: "Status" })).toHaveAttribute(
      "target",
      "_blank"
    )
  })

  it("renders a vertical separator between zones", () => {
    const { container } = render(
      <MegaMenu>
        <MegaMenuColumn>
          <MegaMenuLink href="/a">A</MegaMenuLink>
        </MegaMenuColumn>
        <MegaMenuSeparator />
        <MegaMenuColumn>
          <MegaMenuLink href="/b">B</MegaMenuLink>
        </MegaMenuColumn>
      </MegaMenu>
    )
    const separator = slots(container, "mega-menu-separator")[0]
    expect(separator).toHaveAttribute("data-orientation", "vertical")
    // Sizing is Separator's, keyed off the orientation it renders.
    expect(separator).toHaveClass("data-vertical:w-px")
    expect(separator).toHaveClass("data-vertical:self-stretch")
  })

  it("takes a horizontal orientation for a menu that stacks its zones", () => {
    const { container } = render(<MegaMenuSeparator orientation="horizontal" />)
    const separator = slots(container, "mega-menu-separator")[0]
    expect(separator).toHaveAttribute("data-orientation", "horizontal")
    expect(separator).toHaveClass("data-horizontal:h-px")
    expect(separator).toHaveClass("data-horizontal:w-full")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <nav aria-label="Products">
        <MegaMenu>
          <MegaMenuColumn>
            <MegaMenuGroup>
              <MegaMenuGroupLabel>Vehicle data</MegaMenuGroupLabel>
              <MegaMenuItem
                href="/vin-decoder"
                title="VIN Decoder"
                description="Decode any VIN."
              />
            </MegaMenuGroup>
            <MegaMenuMore href="/all-products">All products</MegaMenuMore>
          </MegaMenuColumn>
        </MegaMenu>
      </nav>
    )
    // jsdom cannot resolve the tokens the palette lives in, so contrast is
    // asserted against the published values in the docs, not here.
    expect(
      (
        await axe(container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations.map((violation) => violation.id)
    ).toEqual([])
  })
})

describe("MegaMenuTrigger", () => {
  it("is the NavigationMenu trigger that opens a MegaMenu panel", async () => {
    render(
      <NavigationMenu>
        <MegaMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger>Products</MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </MegaMenuList>
      </NavigationMenu>
    )
    const trigger = screen.getByRole("button", { name: /Products/ })
    expect(trigger).toHaveAttribute("data-slot", "mega-menu-trigger")
    await userEvent.click(trigger)
    expect(
      screen.getByRole("link", { name: "VIN Decoder" })
    ).toBeInTheDocument()
  })

  it("springs a sliding indicator behind the open trigger", async () => {
    const { container } = render(
      <NavigationMenu>
        <MegaMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger>Products</MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <MegaMenuTrigger>Developers</MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/widgets" title="Widgets" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </MegaMenuList>
      </NavigationMenu>
    )
    expect(slots(container, "mega-menu-indicator")).toHaveLength(0)
    await userEvent.click(screen.getByRole("button", { name: /Products/ }))
    expect(slots(document.body, "mega-menu-indicator")).toHaveLength(1)
    await userEvent.hover(screen.getByRole("button", { name: /Developers/ }))
    expect(slots(document.body, "mega-menu-indicator")).toHaveLength(1)
  })

  it("skips the sliding indicator when motion is reduced", async () => {
    reducedMotion = true
    const { container } = render(
      <NavigationMenu>
        <MegaMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger>Products</MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </MegaMenuList>
      </NavigationMenu>
    )
    await userEvent.click(screen.getByRole("button", { name: /Products/ }))
    expect(slots(container, "mega-menu-indicator")).toHaveLength(0)
    expect(slots(document.body, "mega-menu-indicator")).toHaveLength(0)
    expect(
      screen.getByRole("link", { name: "VIN Decoder" })
    ).toBeInTheDocument()
  })

  it("keeps the consumer's className alongside the mega trigger style", () => {
    render(
      <NavigationMenu>
        <MegaMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger className="text-primary">Products</MegaMenuTrigger>
          </NavigationMenuItem>
        </MegaMenuList>
      </NavigationMenu>
    )
    const trigger = screen.getByRole("button", { name: /Products/ })
    expect(trigger).toHaveClass("text-primary")
    expect(trigger).toHaveClass("h-10")
    expect(trigger).toHaveClass("px-3")
  })
})

describe("useReducedMotionAfterMount", () => {
  it("reports no reduction on the first render, matching what the server sends", () => {
    // Motion resolves `prefers-reduced-motion` during the client's first
    // render but leaves it null on the server, so branching markup on the raw
    // hook hydrates a different tree than was sent. The gate has to make the
    // first render agree with the server and only then tell the truth.
    reducedMotion = true
    const seen: boolean[] = []
    function Probe() {
      seen.push(useReducedMotionAfterMount())
      return null
    }
    render(<Probe />)
    expect(seen[0]).toBe(false)
    expect(seen.at(-1)).toBe(true)
  })

  it("stays false throughout when motion is not reduced", () => {
    reducedMotion = false
    const seen: boolean[] = []
    function Probe() {
      seen.push(useReducedMotionAfterMount())
      return null
    }
    render(<Probe />)
    expect(seen.every((value) => value === false)).toBe(true)
  })
})

describe("MegaMenuTrigger without MegaMenuList", () => {
  it("gives each trigger its own indicator instead of one shared pill", async () => {
    // No MegaMenuList means no LayoutGroup to scope the pill, so the triggers
    // must not share a layoutId — each one just highlights itself.
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger>Products</MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <MegaMenuTrigger>Developers</MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/widgets" title="Widgets" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    await userEvent.click(screen.getByRole("button", { name: /Products/ }))
    await userEvent.hover(screen.getByRole("button", { name: /Developers/ }))
    const pills = slots(document.body, "mega-menu-indicator")
    expect(pills).toHaveLength(2)
    expect(pills.map((pill) => pill.parentElement?.textContent.trim())).toEqual(
      ["Products", "Developers"]
    )
  })
})

describe("MegaMenuTrigger with a custom render", () => {
  it("keeps the trigger's own props on a render element", async () => {
    render(
      <NavigationMenu>
        <MegaMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger
              render={<button type="button" data-custom="yes" />}
            >
              Products
            </MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </MegaMenuList>
      </NavigationMenu>
    )
    const trigger = screen.getByRole("button", { name: /Products/ })
    expect(trigger).toHaveAttribute("data-custom", "yes")
    // A bare return would drop everything Base UI put on the trigger, so the
    // panel would never open.
    expect(trigger).toHaveAttribute("data-slot", "mega-menu-trigger")
    await userEvent.click(trigger)
    expect(
      screen.getByRole("link", { name: "VIN Decoder" })
    ).toBeInTheDocument()
  })

  it("still hands a render function the trigger's open state", async () => {
    const seen: boolean[] = []
    render(
      <NavigationMenu>
        <MegaMenuList>
          <NavigationMenuItem>
            <MegaMenuTrigger
              render={(props, state) => {
                seen.push(state.open)
                return <button type="button" {...props} />
              }}
            >
              Products
            </MegaMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu>
                <MegaMenuColumn>
                  <MegaMenuItem href="/vin-decoder" title="VIN Decoder" />
                </MegaMenuColumn>
              </MegaMenu>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </MegaMenuList>
      </NavigationMenu>
    )
    expect(seen).not.toHaveLength(0)
    expect(seen.every((value) => value === false)).toBe(true)
    await userEvent.click(screen.getByRole("button", { name: /Products/ }))
    expect(seen.at(-1)).toBe(true)
  })
})

describe("splitIntoColumns", () => {
  it("fills columns top-to-bottom, left-to-right", () => {
    expect(splitIntoColumns([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
  })

  it("puts the remainder in the earlier columns", () => {
    expect(splitIntoColumns([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 2, 3],
      [4, 5],
    ])
  })

  it("drops columns that would be empty", () => {
    expect(splitIntoColumns([1, 2], 4)).toEqual([[1], [2]])
    expect(splitIntoColumns([], 3)).toEqual([])
  })
})

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { SplitButton, type SplitButtonItem } from "../components/split-button"

afterEach(cleanup)

function items(overrides: Partial<SplitButtonItem> = {}): SplitButtonItem[] {
  return [
    { id: "email", label: "Email report", ...overrides },
    { separator: true },
    { id: "docs", label: "Open docs", href: "https://api.carsxe.com" },
    {
      id: "export",
      label: "Export as",
      items: [
        { id: "pdf", label: "PDF" },
        { id: "csv", label: "CSV" },
      ],
    },
    { id: "delete", label: "Delete", destructive: true },
  ]
}

/**
 * jsdom never lands the pointer sequence Base UI opens a menu on, so the menu
 * is opened from the keyboard instead.
 */
async function openMenu() {
  screen.getByRole("button", { name: "More options" }).focus()
  await userEvent.keyboard("{Enter}")
}

describe("SplitButton", () => {
  it("fires the primary action without opening the menu", async () => {
    const onClick = vi.fn()
    render(
      <SplitButton items={items()} onClick={onClick}>
        Order report
      </SplitButton>
    )
    await userEvent.click(screen.getByRole("button", { name: "Order report" }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("opens the menu and selects an item", async () => {
    const onSelect = vi.fn()
    render(<SplitButton items={items({ onSelect })}>Order report</SplitButton>)
    await openMenu()
    expect(screen.getByRole("menu")).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole("menuitem", { name: "Email report" })
    )
    expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    })
  })

  it("renders separators, links, and destructive items", async () => {
    const { baseElement } = render(
      <SplitButton items={items()}>Order report</SplitButton>
    )
    await openMenu()
    expect(
      baseElement.querySelectorAll('[data-slot="dropdown-menu-separator"]')
    ).toHaveLength(1)
    const link = screen.getByRole("menuitem", { name: "Open docs" })
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("href", "https://api.carsxe.com")
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "data-variant",
      "destructive"
    )
  })

  it("opens a submenu", async () => {
    render(<SplitButton items={items()}>Order report</SplitButton>)
    await openMenu()
    screen.getByRole("menuitem", { name: "Export as" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(
      await screen.findByRole("menuitem", { name: "PDF" })
    ).toBeInTheDocument()
  })

  it("disables items", async () => {
    const onSelect = vi.fn()
    render(
      <SplitButton items={items({ disabled: true, onSelect })}>
        Order report
      </SplitButton>
    )
    await openMenu()
    const item = screen.getByRole("menuitem", { name: "Email report" })
    expect(item).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(item)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("disables both buttons while loading", () => {
    render(
      <SplitButton items={items()} loading>
        Order report
      </SplitButton>
    )
    expect(screen.getByRole("button", { name: /Order report/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: "More options" })).toBeDisabled()
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("disables both buttons when disabled", () => {
    render(
      <SplitButton items={items()} disabled>
        Order report
      </SplitButton>
    )
    expect(screen.getByRole("button", { name: "Order report" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "More options" })).toBeDisabled()
  })

  it("applies the variant and size to both buttons", () => {
    const { container } = render(
      <SplitButton items={items()} variant="outline" size="sm">
        Order report
      </SplitButton>
    )
    const action = container.querySelector('[data-slot="split-button-action"]')
    const menu = container.querySelector('[data-slot="split-button-menu"]')
    expect(action?.className).toContain("h-8")
    // The menu trigger takes the icon size matching the action's height.
    expect(menu?.className).toContain("size-8")
    expect(action?.className).toContain("border-primary")
    expect(menu?.className).toContain("border-primary")
  })

  it("names the menu trigger through menuLabel", () => {
    render(
      <SplitButton items={items()} menuLabel="Report actions">
        Order report
      </SplitButton>
    )
    expect(
      screen.getByRole("button", { name: "Report actions" })
    ).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <SplitButton items={items()}>Order report</SplitButton>
      </main>
    )
    expect(
      (
        await axe(container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations.map((violation) => violation.id)
    ).toEqual([])
  })
})

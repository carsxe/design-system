import * as React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  CODE_BLOCK_THEMES,
  CodeBlock,
  type CodeBlockTheme,
} from "../components/code-block"

afterEach(cleanup)

describe("Code Block", () => {
  beforeEach(() => {
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
    })
    HTMLElement.prototype.hasPointerCapture = () => false
    HTMLElement.prototype.setPointerCapture = () => undefined
    HTMLElement.prototype.releasePointerCapture = () => undefined
    HTMLElement.prototype.scrollIntoView = () => undefined
  })

  it("exposes every bundled light and dark Shiki theme", () => {
    expect(CODE_BLOCK_THEMES).toHaveLength(65)
    expect(
      CODE_BLOCK_THEMES.filter((theme) => theme.type === "light").length
    ).toBeGreaterThanOrEqual(20)
    expect(
      CODE_BLOCK_THEMES.filter((theme) => theme.type === "dark").length
    ).toBeGreaterThanOrEqual(20)
    expect(CODE_BLOCK_THEMES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "dracula", type: "dark" }),
        expect.objectContaining({ id: "ayu-light", type: "light" }),
      ])
    )
  })

  it("renders dual-theme highlighted code and falls back for invalid languages", async () => {
    const { container, rerender } = render(
      <CodeBlock code={'const vin = "ABC"'} language="typescript" />
    )

    await waitFor(() => {
      expect(container.querySelector(".shiki")).toBeInTheDocument()
    })
    expect(container.querySelector(".shiki")?.getAttribute("style")).toContain(
      "--shiki-dark"
    )

    rerender(
      <CodeBlock code="plain fallback" language={"not-a-language" as "text"} />
    )
    await waitFor(() => {
      expect(container.querySelector(".shiki")?.textContent).toContain(
        "plain fallback"
      )
    })
  })

  it("keeps the latest controlled theme after rapid changes", async () => {
    const { container, rerender } = render(
      <CodeBlock code="const report = true" theme="dracula" />
    )
    rerender(<CodeBlock code="const report = true" theme="ayu-light" />)

    await waitFor(() => {
      expect(container.querySelector(".shiki")).toHaveClass("ayu-light")
    })
    expect(container.querySelector(".shiki")).not.toHaveClass("dracula")
  })

  it("hides the theme picker by default so the theme is code-only", () => {
    render(<CodeBlock code="const report = true" theme="dracula" />)

    expect(
      screen.queryByRole("combobox", { name: "Code theme" })
    ).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Copy code" })).toBeVisible()
  })

  it("supports uncontrolled theme changes and copy feedback", async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    const onThemeChange = vi.fn<(theme: CodeBlockTheme) => void>()

    render(
      <CodeBlock
        code="npm run build"
        language="bash"
        showThemePicker
        onThemeChange={onThemeChange}
      />
    )

    const themeInput = screen.getByRole("combobox", { name: "Code theme" })
    await user.click(themeInput)
    await user.clear(themeInput)
    await user.type(themeInput, "Dracula")
    const dracula = await screen.findByRole("option", {
      name: /^Dracula Theme$/,
    })
    await user.click(dracula)
    expect(onThemeChange).toHaveBeenCalledWith("dracula")

    await user.click(screen.getByRole("button", { name: "Copy code" }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("npm run build"))
    expect(screen.getByRole("button", { name: "Copied" })).toBeVisible()
  })

  it("reports clipboard failures without changing the code", async () => {
    const error = new Error("denied")
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(error) },
    })
    const onCopyError = vi.fn()
    const { container } = render(
      <CodeBlock code="vehicle.report()" onCopyError={onCopyError} />
    )

    fireEvent.click(screen.getByRole("button", { name: "Copy code" }))
    await waitFor(() => expect(onCopyError).toHaveBeenCalledWith(error))
    expect(
      container.querySelector("[data-slot='code-block-content']")
    ).toHaveTextContent("vehicle.report()")
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeVisible()
  })
})

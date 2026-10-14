import { cleanup, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, describe, expect, it } from "vitest"

import { CommandDialog } from "../components/command"
import { Dialog, DialogContent, DialogTitle } from "../components/dialog"

afterEach(cleanup)

function classes(selector: string) {
  const node = document.querySelector(selector)
  expect(node).not.toBeNull()
  return node?.className.split(/\s+/) ?? []
}

function renderDialog(
  className?: string,
  child: ReactNode = <DialogTitle>Title</DialogTitle>
) {
  render(
    <Dialog open>
      <DialogContent className={className}>{child}</DialogContent>
    </Dialog>
  )
}

describe("DialogContent scrollport", () => {
  it("clips the shell and scrolls the padded body on the vertical axis only", () => {
    renderDialog("rounded-none sm:max-w-xl")

    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("overflow-hidden")
    expect(shell).toContain("max-h-[90vh]")
    expect(shell).toContain("min-w-0")
    expect(shell).toContain("sm:max-w-xl")
    expect(shell).not.toContain("sm:max-w-md")
    expect(shell).toContain("flex-col")
    expect(shell).toContain("rounded-none")
    expect(
      shell.some(
        (name) => name.startsWith("rounded-") && name !== "rounded-none"
      )
    ).toBe(false)
    expect(shell).not.toContain("overflow-y-auto")
    expect(shell).not.toContain("p-6")

    const body = classes("[data-slot='dialog-body']")
    expect(body).toContain("overflow-y-auto")
    expect(body).toContain("overflow-x-hidden")
    expect(body).toContain("min-w-0")
    expect(body).toContain("max-w-full")
    expect(body).toContain("w-full")
    expect(body).toContain("p-6")
    expect(body).toContain("min-h-0")
    expect(body).toContain("gap-6")
    expect(body).toContain("overscroll-contain")
    expect(body).not.toContain("overflow-auto")
    expect(body).not.toContain("overflow-x-auto")
    expect(
      document
        .querySelector("[data-slot='dialog-content']")
        ?.contains(screen.getByText("Title"))
    ).toBe(true)
  })

  it("keeps a caller overflow-y-auto from scrolling the shell", () => {
    renderDialog("max-h-[90vh] min-w-0 overflow-y-auto sm:max-w-xl")

    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("overflow-hidden")
    expect(shell).not.toContain("overflow-y-auto")
    expect(document.querySelectorAll("[data-slot='dialog-body']")).toHaveLength(
      1
    )
    expect(classes("[data-slot='dialog-body']")).toContain("overflow-y-auto")
  })

  it("lets a shorter max-height replace the default cap", () => {
    renderDialog("max-h-[85vh] max-w-2xl")

    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("max-h-[85vh]")
    expect(shell).not.toContain("max-h-[90vh]")
    expect(shell).not.toContain("overflow-y-auto")
  })

  it("keeps flush dialogs padded by their own children", () => {
    renderDialog("bg-background p-0")

    const body = classes("[data-slot='dialog-body']")
    expect(body).toContain("p-0")
    expect(body).not.toContain("p-6")
    expect(body).toContain("overflow-y-auto")
    expect(body).toContain("overflow-x-hidden")
  })

  it("collapses body gap when the caller passes gap-0", () => {
    renderDialog("gap-0")

    expect(classes("[data-slot='dialog-body']")).toContain("gap-0")
    expect(classes("[data-slot='dialog-body']")).not.toContain("gap-6")
    expect(classes("[data-slot='dialog-content']")).toContain("gap-0")
    expect(classes("[data-slot='dialog-content']")).not.toContain("gap-6")
  })

  it("does not add a second scrollport when the dialog owns its layout", () => {
    render(
      <Dialog open>
        <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <div className="min-h-0 flex-1 overflow-y-auto">form</div>
          <div>footer</div>
        </DialogContent>
      </Dialog>
    )

    expect(document.querySelector("[data-slot='dialog-body']")).toBeNull()
    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("overflow-hidden")
    expect(shell).not.toContain("overflow-y-auto")
    expect(shell).not.toContain("p-6")
    expect(screen.getByText("form").parentElement).toBe(
      document.querySelector("[data-slot='dialog-content']")
    )
  })

  it("does not cap a viewport-filling dialog at 90vh", () => {
    renderDialog(
      "flex h-dvh w-screen max-w-none flex-col gap-0 p-0 sm:max-w-none"
    )

    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("h-dvh")
    expect(shell).not.toContain("max-h-[90vh]")
    expect(shell).toContain("overflow-hidden")
    expect(document.querySelector("[data-slot='dialog-body']")).toBeNull()
  })

  it.each(["h-screen", "h-full", "inset-0", "h-[100dvh]", "md:h-dvh"])(
    "treats %s as a viewport-owned layout",
    (utility) => {
      renderDialog(`flex ${utility} max-w-none flex-col p-0 sm:max-w-none`)

      const shell = classes("[data-slot='dialog-content']")
      expect(shell).not.toContain("max-h-[90vh]")
      expect(shell).toContain("overflow-hidden")
      expect(document.querySelector("[data-slot='dialog-body']")).toBeNull()
    }
  )

  it("does not wrap the command palette in a second scrollport", () => {
    render(
      <CommandDialog open>
        <div>palette</div>
      </CommandDialog>
    )

    expect(document.querySelector("[data-slot='dialog-body']")).toBeNull()
    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("overflow-hidden")
    expect(shell).toContain("p-0")
    expect(shell).not.toContain("overflow-y-auto")
    expect(shell).not.toContain("p-6")
  })
})

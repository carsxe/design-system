import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState, type ReactNode } from "react"
import { afterEach, describe, expect, it } from "vitest"

import { CommandDialog } from "../components/command"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/dialog"

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
  it("clips the shell and scrolls the body on the vertical axis only", () => {
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
    expect(shell).toContain("p-6")

    const body = classes("[data-slot='dialog-body']")
    expect(body).toContain("overflow-y-auto")
    expect(body).toContain("overflow-x-hidden")
    expect(body).toContain("min-w-0")
    expect(body).toContain("max-w-full")
    expect(body).toContain("w-full")
    expect(body).toContain("flex-1")
    expect(body).not.toContain("p-6")
    expect(body).toContain("min-h-0")
    expect(body).toContain("gap-6")
    expect(body).toContain("overscroll-contain")
    expect(body).toContain("[scrollbar-gutter:stable]")
    expect(body).toContain("break-words")
    expect(body).toContain("pr-6")
    expect(body).not.toContain("overflow-auto")
    expect(body).not.toContain("overflow-x-auto")
    expect(
      document
        .querySelector("[data-slot='dialog-body']")
        ?.contains(screen.getByText("Title"))
    ).toBe(true)
  })

  it("reserves a scrollbar gutter and wraps long body text", () => {
    renderDialog("rounded-none sm:max-w-xl")

    const body = classes("[data-slot='dialog-body']")
    expect(body).toContain("[scrollbar-gutter:stable]")
    expect(body).toContain("break-words")
    expect(body).toContain("min-w-0")
    expect(body).toContain("pr-6")
    expect(body).toContain("overflow-y-auto")
    expect(body).toContain("overflow-x-hidden")
    expect(body).not.toContain("overflow-x-auto")
    expect(classes("[data-slot='dialog-content']")).toContain("p-6")
    expect(classes("[data-slot='dialog-content']")).toContain("overflow-hidden")
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

  it("does not wrap a flush p-0 dialog", () => {
    renderDialog("bg-background p-0")

    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("p-0")
    expect(shell).not.toContain("p-6")
    expect(document.querySelector("[data-slot='dialog-body']")).toBeNull()
    expect(screen.getByText("Title").parentElement).toBe(
      document.querySelector("[data-slot='dialog-content']")
    )
  })

  it("keeps default padding when overflow-hidden only skips the body", () => {
    render(
      <Dialog open>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-none sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Confirm payment</DialogTitle>
          </DialogHeader>
          <p>Totals</p>
        </DialogContent>
      </Dialog>
    )

    expect(document.querySelector("[data-slot='dialog-body']")).toBeNull()
    const shell = classes("[data-slot='dialog-content']")
    expect(shell).toContain("overflow-hidden")
    expect(shell).toContain("p-6")
    expect(shell).toContain("flex-col")
    expect(screen.getByText("Totals").parentElement).toBe(
      document.querySelector("[data-slot='dialog-content']")
    )
    expect(
      document.querySelector("[data-slot='dialog-header']")?.parentElement
    ).toBe(document.querySelector("[data-slot='dialog-content']"))
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

  it("pins the header and footer outside the scrollport", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <p>Body copy</p>
          <DialogFooter>
            <button type="button">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    const shell = document.querySelector("[data-slot='dialog-content']")
    const body = document.querySelector("[data-slot='dialog-body']")
    const header = document.querySelector("[data-slot='dialog-header']")
    const footer = document.querySelector("[data-slot='dialog-footer']")

    expect(header?.parentElement).toBe(shell)
    expect(footer?.parentElement).toBe(shell)
    expect(body?.parentElement).toBe(shell)
    expect(body?.contains(screen.getByText("Body copy"))).toBe(true)
    expect(body?.contains(screen.getByText("Title"))).toBe(false)
    expect(body?.contains(screen.getByText("Description"))).toBe(false)
    expect(body?.contains(screen.getByRole("button", { name: "Save" }))).toBe(
      false
    )
    expect(classes("[data-slot='dialog-header']")).toContain("flex-none")
    expect(classes("[data-slot='dialog-footer']")).toContain("flex-none")
    expect(classes("[data-slot='dialog-body']")).toEqual(
      expect.arrayContaining([
        "flex-1",
        "min-h-0",
        "overflow-y-auto",
        "overflow-x-hidden",
      ])
    )
  })

  it("pins a header and footer wrapped in a fragment", () => {
    render(
      <Dialog open>
        <DialogContent>
          <>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
            <p>Body copy</p>
            <DialogFooter>
              <button type="button">Save</button>
            </DialogFooter>
          </>
        </DialogContent>
      </Dialog>
    )

    const shell = document.querySelector("[data-slot='dialog-content']")
    expect(
      document.querySelector("[data-slot='dialog-header']")?.parentElement
    ).toBe(shell)
    expect(
      document.querySelector("[data-slot='dialog-footer']")?.parentElement
    ).toBe(shell)
    expect(
      document
        .querySelector("[data-slot='dialog-body']")
        ?.contains(screen.getByText("Body copy"))
    ).toBe(true)
  })

  it("uses an explicit DialogBody as the only scrollport", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>Body copy</p>
          </DialogBody>
          <DialogFooter>
            <button type="button">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(document.querySelectorAll("[data-slot='dialog-body']")).toHaveLength(
      1
    )
    const shell = document.querySelector("[data-slot='dialog-content']")
    const body = document.querySelector("[data-slot='dialog-body']")
    expect(body?.parentElement).toBe(shell)
    expect(body?.contains(screen.getByText("Body copy"))).toBe(true)
    expect(
      document.querySelector("[data-slot='dialog-header']")?.parentElement
    ).toBe(shell)
    expect(
      document.querySelector("[data-slot='dialog-footer']")?.parentElement
    ).toBe(shell)
  })

  it("keeps inputs mounted when a conditional sibling appears while typing", async () => {
    function CapDialog() {
      const [plate, setPlate] = useState("")
      const blocked = plate.length > 0
      return (
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enterprise usage cap</DialogTitle>
            </DialogHeader>
            <input aria-label="Notes" defaultValue="" />
            {blocked ? <p>Requests above this cap may be blocked.</p> : null}
            {(blocked ? ["plate_decoder"] : []).map((api) => (
              <p key={api}>Plate Decoder has no enterprise overage price.</p>
            ))}
            <input
              aria-label="Plate Decoder cap"
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
            />
            <input aria-label="Monthly cap" defaultValue="" />
            <DialogFooter>
              <button type="button">Save</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    }

    const user = userEvent.setup()
    render(<CapDialog />)

    const notes = screen.getByRole("textbox", { name: "Notes" })
    const plate = screen.getByRole("textbox", { name: "Plate Decoder cap" })
    const monthly = screen.getByRole("textbox", { name: "Monthly cap" })

    await user.type(plate, "12")

    expect(screen.getByRole("textbox", { name: "Plate Decoder cap" })).toBe(
      plate
    )
    expect(plate).toHaveFocus()
    expect(plate).toHaveValue("12")
    expect(screen.getByRole("textbox", { name: "Notes" })).toBe(notes)
    expect(screen.getByRole("textbox", { name: "Monthly cap" })).toBe(monthly)
    expect(
      screen.getByText("Requests above this cap may be blocked.")
    ).toBeTruthy()
    expect(
      screen.getByText("Plate Decoder has no enterprise overage price.")
    ).toBeTruthy()
    expect(
      document.querySelector("[data-slot='dialog-body']")?.contains(plate)
    ).toBe(true)
    expect(
      document.querySelector("[data-slot='dialog-header']")?.parentElement
    ).toBe(document.querySelector("[data-slot='dialog-content']"))
    expect(
      document.querySelector("[data-slot='dialog-footer']")?.parentElement
    ).toBe(document.querySelector("[data-slot='dialog-content']"))
  })

  it("keeps the next input mounted when a footer appears between fields", async () => {
    function Editor() {
      const [value, setValue] = useState("")
      return (
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
            <input aria-label="First cap" defaultValue="" />
            {value ? (
              <DialogFooter>
                <button type="button">Save</button>
              </DialogFooter>
            ) : null}
            <input
              aria-label="Second cap"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </DialogContent>
        </Dialog>
      )
    }

    const user = userEvent.setup()
    render(<Editor />)
    const first = screen.getByRole("textbox", { name: "First cap" })
    const second = screen.getByRole("textbox", { name: "Second cap" })

    await user.type(second, "1")

    expect(screen.getByRole("textbox", { name: "Second cap" })).toBe(second)
    expect(second).toHaveFocus()
    expect(second).toHaveValue("1")
    expect(screen.getByRole("textbox", { name: "First cap" })).toBe(first)
    const shell = document.querySelector("[data-slot='dialog-content']")
    const footer = document.querySelector("[data-slot='dialog-footer']")
    expect(footer?.parentElement).toBe(shell)
    expect(
      document.querySelector("[data-slot='dialog-body']")?.contains(footer)
    ).toBe(false)
    expect(
      document.querySelector("[data-slot='dialog-body']")?.contains(second)
    ).toBe(true)
  })

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

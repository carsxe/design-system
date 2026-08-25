import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import {
  AngleSlider,
  Clipboard,
  ColorPicker,
  DateInput,
  Editable,
  FloatingPanel,
  FormatNumber,
  Highlight,
  ImageCropper,
  JsonTreeView,
  Listbox,
  Marquee,
  NumberInput,
  PasswordInput,
  QrCode,
  RatingGroup,
  SignaturePad,
  Steps,
  Swap,
  TableOfContents,
  TagsInput,
  Timer,
  TreeView,
} from "../index"

describe("Ark-inspired components", () => {
  afterEach(cleanup)
  it("renders the public component set", async () => {
    const { container } = render(
      <main>
        <AngleSlider aria-label="Angle" />
        <Clipboard value="carsxe" />
        <ColorPicker />
        <DateInput />
        <Editable defaultValue="Name" />
        <FloatingPanel defaultOpen title="Panel">
          Body
        </FloatingPanel>
        <FormatNumber value={1200} />
        <Highlight text="Carsxe design" query="design" />
        <ImageCropper src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
        <JsonTreeView data={{ ready: true }} />
        <Listbox
          aria-label="Options"
          items={[{ value: "one", label: "One" }]}
        />
        <Marquee>Moving</Marquee>
        <NumberInput aria-label="Count" />
        <PasswordInput aria-label="Password" />
        <QrCode value="https://carsxe.com" />
        <RatingGroup aria-label="Rating" />
        <SignaturePad />
        <Steps steps={[{ id: "one", title: "One" }]} />
        <Swap value="one">One</Swap>
        <TableOfContents items={[{ id: "intro", title: "Intro" }]} />
        <TagsInput />
        <Timer running={false} />
        <TreeView aria-label="Tree" items={[{ id: "one", label: "One" }]} />
      </main>
    )
    expect(
      container.querySelectorAll("[data-slot]").length
    ).toBeGreaterThanOrEqual(24)
    expect(
      (
        await axe(container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations.map(
        (violation) =>
          `${violation.id}: ${violation.help} (${violation.nodes.map((node) => node.target.join(",")).join(";")})`
      )
    ).toEqual([])
  })

  it("supports keyboard and controlled-value interactions", () => {
    const change = vi.fn()
    render(
      <>
        <NumberInput
          aria-label="Count"
          defaultValue={2}
          onValueChange={change}
        />
        <RatingGroup
          aria-label="Rating"
          defaultValue={2}
          onValueChange={change}
        />
        <TagsInput defaultValue={["one"]} onValueChange={change} />
      </>
    )
    fireEvent.click(screen.getByRole("button", { name: "Increase value" }))
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" })
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Backspace" })
    expect(change).toHaveBeenCalledTimes(3)
  })

  it("does not report clipboard success when clipboard access fails", async () => {
    const error = vi.fn()
    render(<Clipboard value="secret" onCopyError={error} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }))
    await vi.waitFor(() => expect(error).toHaveBeenCalled())
    expect(
      screen.getByRole("button", { name: "Copy to clipboard" })
    ).not.toHaveAttribute("data-copied")
  })
})

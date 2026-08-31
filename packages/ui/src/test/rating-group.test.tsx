import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { HeartIcon, StarIcon } from "lucide-react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { RatingGroup } from "../components/rating-group"

afterEach(cleanup)

function items() {
  return screen.getAllByRole("radio")
}

/** jsdom has no layout, so half-star clicks need a faked item rect. */
function clickAt(item: HTMLElement, offset: "left" | "right") {
  item.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    right: 32,
    bottom: 32,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
  fireEvent.click(item, { clientX: offset === "left" ? 4 : 28 })
}

describe("RatingGroup", () => {
  it("picks whole and half values from the click position", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <RatingGroup aria-label="Rating" onValueChange={onValueChange} />
    )
    clickAt(items()[2], "left")
    expect(onValueChange).toHaveBeenLastCalledWith(3)

    rerender(
      <RatingGroup
        aria-label="Rating"
        allowHalf
        onValueChange={onValueChange}
      />
    )
    clickAt(items()[2], "left")
    expect(onValueChange).toHaveBeenLastCalledWith(2.5)
    clickAt(items()[2], "right")
    expect(onValueChange).toHaveBeenLastCalledWith(3)
  })

  it("steps with the arrow keys, in halves when allowHalf is set", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <RatingGroup
        aria-label="Rating"
        defaultValue={2}
        onValueChange={onValueChange}
      />
    )
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(3)

    rerender(
      <RatingGroup
        aria-label="Rating"
        allowHalf
        value={2}
        onValueChange={onValueChange}
      />
    )
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" })
    expect(onValueChange).toHaveBeenLastCalledWith(1.5)
  })

  it("clears the rating when allowClear is set", () => {
    const onValueChange = vi.fn()
    render(
      <RatingGroup
        aria-label="Rating"
        allowClear
        value={3}
        onValueChange={onValueChange}
      />
    )

    // Picking the current value again clears it.
    clickAt(items()[2], "right")
    expect(onValueChange).toHaveBeenLastCalledWith(0)

    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "Delete" })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "Backspace" })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
  })

  it("keeps the value when picking it again without allowClear", () => {
    const onValueChange = vi.fn()
    render(
      <RatingGroup
        aria-label="Rating"
        value={3}
        onValueChange={onValueChange}
      />
    )
    clickAt(items()[2], "right")
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "Delete" })
    // Re-picking 3 is a no-op, and Delete does nothing.
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("marks each item empty, partial, or full", () => {
    render(<RatingGroup aria-label="Rating" allowHalf value={2.5} />)
    const fills = items().map((item) => item.dataset.fill)
    expect(fills).toEqual(["full", "full", "partial", "empty", "empty"])
  })

  it("renders custom icons for both layers", () => {
    const { container } = render(
      <RatingGroup
        aria-label="Rating"
        value={1}
        count={2}
        icon={HeartIcon}
        emptyIcon={StarIcon}
      />
    )
    expect(container.querySelectorAll(".lucide-heart").length).toBe(2)
    expect(container.querySelectorAll(".lucide-star").length).toBe(2)
  })

  it("reports its orientation", () => {
    render(<RatingGroup aria-label="Rating" orientation="vertical" />)
    const group = screen.getByRole("radiogroup")
    expect(group).toHaveAttribute("data-orientation", "vertical")
    expect(group).toHaveAttribute("aria-orientation", "vertical")
  })

  it("ignores interaction when disabled or read-only", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <RatingGroup aria-label="Rating" readOnly onValueChange={onValueChange} />
    )
    clickAt(items()[1], "right")
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "data-readonly",
      "true"
    )

    rerender(
      <RatingGroup aria-label="Rating" disabled onValueChange={onValueChange} />
    )
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("submits through a hidden input", () => {
    const { container } = render(
      <RatingGroup aria-label="Rating" defaultValue={4} name="score" />
    )
    expect(container.querySelector('input[name="score"]')).toHaveValue("4")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <RatingGroup aria-label="Rating" defaultValue={3} allowClear />
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

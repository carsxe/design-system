import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { Knob } from "../components/knob"

afterEach(cleanup)

function knob() {
  return screen.getByRole("slider")
}

/** jsdom has no layout, so the knob's rect has to be faked to test pointers. */
function stubRect(element: HTMLElement) {
  element.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
}

describe("Knob", () => {
  it("increments and decrements with the arrow keys, clamped to the range", () => {
    const onValueChange = vi.fn()
    render(
      <Knob
        aria-label="Volume"
        defaultValue={99}
        step={2}
        onValueChange={onValueChange}
      />
    )

    fireEvent.keyDown(knob(), { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(100)
    expect(knob()).toHaveAttribute("aria-valuenow", "100")

    // Already at max: no further change.
    fireEvent.keyDown(knob(), { key: "ArrowUp" })
    expect(onValueChange).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(knob(), { key: "ArrowLeft" })
    expect(onValueChange).toHaveBeenLastCalledWith(98)
  })

  it("jumps to the ends with Home, End, and the page keys", () => {
    const onValueChange = vi.fn()
    render(
      <Knob
        aria-label="Volume"
        defaultValue={50}
        min={10}
        max={90}
        onValueChange={onValueChange}
      />
    )

    fireEvent.keyDown(knob(), { key: "End" })
    expect(onValueChange).toHaveBeenLastCalledWith(90)
    fireEvent.keyDown(knob(), { key: "Home" })
    expect(onValueChange).toHaveBeenLastCalledWith(10)
    fireEvent.keyDown(knob(), { key: "PageUp" })
    expect(onValueChange).toHaveBeenLastCalledWith(20)
    fireEvent.keyDown(knob(), { key: "PageDown" })
    expect(onValueChange).toHaveBeenLastCalledWith(10)
  })

  it("sets the value from the pointer position", () => {
    const onValueChange = vi.fn()
    render(<Knob aria-label="Volume" onValueChange={onValueChange} />)
    stubRect(knob())

    // Straight up from the centre is the midpoint of a 270° sweep.
    fireEvent.pointerDown(knob(), { clientX: 50, clientY: 0, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(50)

    // The arc starts at the bottom left, so 3 o'clock is 225° of 270° along.
    fireEvent.pointerDown(knob(), { clientX: 100, clientY: 50, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(83)
  })

  it("snaps pointer positions inside the bottom gap to the nearest end", () => {
    const onValueChange = vi.fn()
    render(
      <Knob
        aria-label="Volume"
        defaultValue={50}
        onValueChange={onValueChange}
      />
    )
    stubRect(knob())

    // Bottom-right of the gap.
    fireEvent.pointerDown(knob(), { clientX: 70, clientY: 100, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(100)

    // Bottom-left of the gap.
    fireEvent.pointerDown(knob(), { clientX: 30, clientY: 100, pointerId: 1 })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
  })

  it("ignores interaction when disabled or read-only", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Knob aria-label="Volume" disabled onValueChange={onValueChange} />
    )
    stubRect(knob())
    fireEvent.keyDown(knob(), { key: "ArrowRight" })
    fireEvent.pointerDown(knob(), { clientX: 50, clientY: 0, pointerId: 1 })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(knob()).toHaveAttribute("data-disabled", "true")
    expect(knob()).toHaveAttribute("tabindex", "-1")

    rerender(
      <Knob aria-label="Volume" readOnly onValueChange={onValueChange} />
    )
    stubRect(knob())
    fireEvent.keyDown(knob(), { key: "ArrowRight" })
    fireEvent.pointerDown(knob(), { clientX: 50, clientY: 0, pointerId: 1 })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(knob()).toHaveAttribute("data-readonly", "true")
  })

  it("draws the value arc only for values above the minimum", () => {
    const { container, rerender } = render(
      <Knob aria-label="Volume" value={0} />
    )
    expect(
      container.querySelector('[data-slot="knob-value"]')
    ).not.toBeInTheDocument()
    expect(container.querySelector('[data-slot="knob-range"]')).not.toBeNull()

    rerender(<Knob aria-label="Volume" value={40} />)
    expect(container.querySelector('[data-slot="knob-value"]')).not.toBeNull()
  })

  it("renders a value template and mirrors it in aria-valuetext", () => {
    const { container } = render(
      <Knob aria-label="Volume" defaultValue={30}>
        {(value) => `${value}%`}
      </Knob>
    )
    expect(
      container.querySelector('[data-slot="knob-text"]')
    ).toHaveTextContent("30%")
    expect(knob()).toHaveAttribute("aria-valuetext", "30%")
  })

  it("hides the value and submits through a hidden input", () => {
    const { container } = render(
      <Knob
        aria-label="Volume"
        defaultValue={12}
        showValue={false}
        name="gain"
      />
    )
    expect(
      container.querySelector('[data-slot="knob-text"]')
    ).not.toBeInTheDocument()
    expect(container.querySelector('input[name="gain"]')).toHaveValue("12")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <Knob aria-label="Volume" defaultValue={40} />
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

import type { ComponentProps } from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { Marquee } from "../components/marquee"

let reducedMotion = false

vi.mock("motion/react", () => ({
  useReducedMotion: () => reducedMotion,
}))

// jsdom has no layout, so give each copy an offsetLeft based on its index in
// the track. The copies are the track's only children, so the measured stride
// (second copy minus first copy) comes out to STRIDE.
const STRIDE = 400

const originalOffsetLeft = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetLeft"
)

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ["requestAnimationFrame", "performance", "setTimeout", "clearTimeout"],
  })
  Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
    configurable: true,
    get(this: HTMLElement) {
      const parent = this.parentElement
      if (!parent) return 0
      return Array.prototype.indexOf.call(parent.children, this) * STRIDE
    },
  })
})

afterEach(() => {
  cleanup()
  if (originalOffsetLeft) {
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetLeft",
      originalOffsetLeft
    )
  }
  vi.useRealTimers()
  reducedMotion = false
})

function renderMarquee(props: Partial<ComponentProps<typeof Marquee>> = {}) {
  const { container } = render(
    <Marquee aria-label="Announcements" duration={1} {...props}>
      <span>Item</span>
    </Marquee>
  )
  const root = container.querySelector('[data-slot="marquee"]') as HTMLElement
  return { container, root }
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe("Marquee", () => {
  it("renders duplicated content and starts at the middle copy", async () => {
    const { container, root } = renderMarquee()
    expect(root).toHaveAttribute("tabindex", "0")
    expect(root.querySelectorAll("[aria-hidden]")).toHaveLength(2)
    expect(screen.getAllByText("Item")).toHaveLength(3)
    expect(root.scrollLeft).toBe(STRIDE)
    vi.useRealTimers()
    expect((await axe(container)).violations).toEqual([])
  })

  it("auto-scrolls forward, and backward with reverse", () => {
    const { root } = renderMarquee()
    advance(300)
    expect(root.scrollLeft).toBeGreaterThan(STRIDE)
    cleanup()
    const { root: reversed } = renderMarquee({ reverse: true })
    advance(300)
    expect(reversed.scrollLeft).toBeLessThan(STRIDE)
    expect(reversed.scrollLeft).toBeGreaterThanOrEqual(0.5 * STRIDE)
  })

  it("pauses on hover and resumes from the current position", () => {
    const { root } = renderMarquee()
    fireEvent.pointerEnter(root)
    expect(root).toHaveAttribute("data-paused")
    advance(300)
    expect(root.scrollLeft).toBe(STRIDE)
    // The user scrolls manually while paused.
    root.scrollLeft = 250
    fireEvent.scroll(root)
    fireEvent.pointerLeave(root)
    // Still paused until scrolling settles.
    expect(root).toHaveAttribute("data-paused")
    advance(150)
    expect(root).not.toHaveAttribute("data-paused")
    advance(300)
    expect(root.scrollLeft).toBeGreaterThan(250)
    expect(root.scrollLeft).toBeLessThan(STRIDE)
  })

  it("pauses while focused and resumes on blur", () => {
    const { root } = renderMarquee()
    fireEvent.focus(root)
    expect(root).toHaveAttribute("data-paused")
    advance(300)
    expect(root.scrollLeft).toBe(STRIDE)
    fireEvent.blur(root)
    advance(150)
    expect(root).not.toHaveAttribute("data-paused")
  })

  it("maps a dominant vertical wheel to horizontal scroll", () => {
    const { root } = renderMarquee()
    fireEvent.pointerEnter(root)
    const vertical = new WheelEvent("wheel", {
      deltaY: 40,
      cancelable: true,
      bubbles: true,
    })
    root.dispatchEvent(vertical)
    expect(vertical.defaultPrevented).toBe(true)
    expect(root.scrollLeft).toBe(STRIDE + 40)
    const horizontal = new WheelEvent("wheel", {
      deltaX: 50,
      deltaY: 10,
      cancelable: true,
      bubbles: true,
    })
    root.dispatchEvent(horizontal)
    expect(horizontal.defaultPrevented).toBe(false)
    expect(root.scrollLeft).toBe(STRIDE + 40)
  })

  it("wraps manual scrolling so it never reaches an edge", () => {
    const { root } = renderMarquee()
    fireEvent.pointerEnter(root)
    root.scrollLeft = 1.5 * STRIDE + 50
    fireEvent.scroll(root)
    expect(root.scrollLeft).toBe(0.5 * STRIDE + 50)
    root.scrollLeft = 0.5 * STRIDE - 100
    fireEvent.scroll(root)
    expect(root.scrollLeft).toBe(1.5 * STRIDE - 100)
  })

  it("stays static under reduced motion but still scrolls manually", () => {
    reducedMotion = true
    const { root } = renderMarquee()
    advance(500)
    expect(root.scrollLeft).toBe(STRIDE)
    const wheel = new WheelEvent("wheel", {
      deltaY: 40,
      cancelable: true,
      bubbles: true,
    })
    root.dispatchEvent(wheel)
    expect(root.scrollLeft).toBe(STRIDE + 40)
  })

  it("ignores hover and wheel when pauseOnHover is false", () => {
    const { root } = renderMarquee({ pauseOnHover: false })
    fireEvent.pointerEnter(root)
    expect(root).not.toHaveAttribute("data-paused")
    advance(300)
    expect(root.scrollLeft).toBeGreaterThan(STRIDE)
    const before = root.scrollLeft
    const wheel = new WheelEvent("wheel", {
      deltaY: 40,
      cancelable: true,
      bubbles: true,
    })
    root.dispatchEvent(wheel)
    expect(wheel.defaultPrevented).toBe(false)
    expect(root.scrollLeft).toBe(before)
  })
})

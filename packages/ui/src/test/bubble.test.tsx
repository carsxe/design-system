import * as React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "../components/bubble"

beforeEach(() => {
  Object.defineProperty(window, "isSecureContext", {
    configurable: true,
    value: true,
  })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function clipboard(writeText = vi.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
  return writeText
}

describe("Bubble", () => {
  it("copies each sender's exact text and resets success", async () => {
    vi.useFakeTimers()
    const write = clipboard()
    render(
      <BubbleGroup>
        {["Assistant\nmessage", "User message"].map((text, i) => (
          <Bubble
            key={text}
            align={i ? "end" : "start"}
            copyText={text}
            timestamp={0}
          >
            <BubbleContent>{text}</BubbleContent>
          </Bubble>
        ))}
      </BubbleGroup>
    )
    const buttons = screen.getAllByRole("button", { name: "Copy to clipboard" })
    await act(async () => {
      fireEvent.click(buttons[0])
      fireEvent.click(buttons[1])
    })
    expect(write.mock.calls).toEqual([["Assistant\nmessage"], ["User message"]])
    expect(screen.getAllByRole("button", { name: "Copied" })).toHaveLength(2)
    act(() => vi.advanceTimersByTime(1500))
    expect(
      screen.getAllByRole("button", { name: "Copy to clipboard" })
    ).toHaveLength(2)
  })

  it("announces rejection and permits retry", async () => {
    const error = new Error("Denied")
    const write = clipboard(
      vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce(undefined)
    )
    const onCopyError = vi.fn()
    render(
      <Bubble copyText="Retry me" onCopyError={onCopyError}>
        <BubbleContent>Retry me</BubbleContent>
      </Bubble>
    )
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }))
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Could not copy message"
      )
    )
    expect(onCopyError).toHaveBeenCalledWith(error)
    fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }))
    await screen.findByRole("button", { name: "Copied" })
    expect(write).toHaveBeenCalledTimes(2)
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
  })

  it("formats Date, local ISO and epoch values, and omits invalid values", () => {
    const date = new Date(2026, 8, 15, 3, 14)
    const { container, rerender } = render(<Bubble timestamp={date} />)
    for (const timestamp of [date, "2026-09-15T03:14:00", date.getTime()]) {
      rerender(<Bubble timestamp={timestamp} />)
      expect(container.querySelector("time")).toHaveTextContent(
        "September 15, 3:14 AM"
      )
      expect(container.querySelector("time")).toHaveAttribute(
        "dateTime",
        date.toISOString()
      )
    }
    for (const timestamp of [
      "invalid",
      "2026-02-31",
      NaN,
      new Date(NaN),
      undefined,
    ]) {
      rerender(<Bubble timestamp={timestamp} />)
      expect(container.querySelector("time")).toBeNull()
    }
  })

  it("orders accessible actions after copy and supports tooltips and keyboard", async () => {
    const user = userEvent.setup()
    const first = vi.fn(),
      second = vi.fn()
    render(
      <Bubble
        copyText="hello"
        actions={[
          {
            name: "Helpful",
            icon: <svg data-testid="icon" />,
            onPress: first,
            tooltipLabel: "Mark helpful",
          },
          { name: "Retry", icon: "↻", onPress: second },
        ]}
      />
    )
    expect(
      screen
        .getAllByRole("button")
        .map((button) => button.getAttribute("aria-label"))
    ).toEqual(["Copy to clipboard", "Helpful", "Retry"])
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true"
    )
    await user.hover(screen.getByRole("button", { name: "Helpful" }))
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Mark helpful")
    await user.click(screen.getByRole("button", { name: "Helpful" }))
    expect(first).toHaveBeenCalledOnce()
    await user.tab()
    await user.keyboard("{Enter}")
    expect(second).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: "Retry" })).toHaveAttribute(
      "type",
      "button"
    )
  })

  it("omits absent avatars and renders fallback for a failed image", async () => {
    const { container, rerender } = render(<Bubble copyText="hello" />)
    expect(container.querySelector('[data-slot="avatar"]')).toBeNull()
    rerender(<Bubble avatar={{ name: "Alex Morgan", src: "/missing.png" }} />)
    expect(screen.getByRole("img", { name: "Alex Morgan" })).toBeInTheDocument()
    expect(await screen.findByText("AM")).toBeInTheDocument()
    rerender(
      <Bubble avatar={{ name: "Alex Morgan", fallback: <span>Custom</span> }} />
    )
    expect(screen.getByText("Custom")).toBeInTheDocument()
  })

  it("preserves legacy DOM, variant, alignment, render and reactions", () => {
    const { container, rerender } = render(
      <Bubble variant="secondary" align="end">
        <BubbleContent render={<a href="/vehicle" />}>Vehicle</BubbleContent>
        <BubbleReactions>👍</BubbleReactions>
      </Bubble>
    )
    const bubble = container.firstElementChild!
    expect(bubble).toHaveAttribute("data-variant", "secondary")
    expect(bubble).toHaveAttribute("data-align", "end")
    expect(bubble.children).toHaveLength(2)
    expect(screen.getByRole("link")).toHaveAttribute("href", "/vehicle")
    rerender(
      <Bubble copyText="Vehicle" variant="secondary" align="end">
        <BubbleContent>Vehicle</BubbleContent>
        <BubbleReactions>👍</BubbleReactions>
      </Bubble>
    )
    expect(
      container.querySelector('[data-slot="bubble-reactions"]')?.parentElement
    ).toHaveAttribute("data-slot", "bubble-surface")
    expect(container.querySelector('[data-slot="bubble-surface"]')).toHaveClass(
      "relative"
    )
  })
})

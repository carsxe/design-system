import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { Timeline } from "../components/timeline"

afterEach(cleanup)

type Event = { id: string; title: string; date: string }

const events: Event[] = [
  { id: "ordered", title: "Report ordered", date: "09:14" },
  { id: "decoded", title: "VIN decoded", date: "09:15" },
  { id: "ready", title: "Report ready", date: "09:17" },
]

function slots(container: HTMLElement, slot: string) {
  return Array.from(container.querySelectorAll(`[data-slot="${slot}"]`))
}

describe("Timeline", () => {
  it("renders one event per item, in order", () => {
    const { container } = render(
      <Timeline items={events} content={(event) => event.title} />
    )
    expect(
      slots(container, "timeline-event").map((event) => event.textContent)
    ).toEqual(["Report ordered", "VIN decoded", "Report ready"])
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
  })

  it("renders string items directly when no content template is given", () => {
    const { container } = render(<Timeline items={["One", "Two"]} />)
    expect(
      slots(container, "timeline-content").map((node) => node.textContent)
    ).toEqual(["One", "Two"])
  })

  it("renders empty content for object items with no template", () => {
    const { container } = render(<Timeline items={events} />)
    expect(
      slots(container, "timeline-content").map((node) => node.textContent)
    ).toEqual(["", "", ""])
  })

  it("alternates sides when align is alternate", () => {
    const { container } = render(
      <Timeline
        items={events}
        align="alternate"
        content={(event) => event.title}
      />
    )
    expect(
      slots(container, "timeline-event").map(
        (event) => (event as HTMLElement).dataset.align
      )
    ).toEqual(["start", "end", "start"])
  })

  it("puts every event on the same side for start and end", () => {
    const { container, rerender } = render(
      <Timeline items={events} content={(event) => event.title} />
    )
    expect(
      slots(container, "timeline-event").every(
        (event) => (event as HTMLElement).dataset.align === "start"
      )
    ).toBe(true)

    rerender(
      <Timeline items={events} align="end" content={(event) => event.title} />
    )
    expect(
      slots(container, "timeline-event").every(
        (event) => (event as HTMLElement).dataset.align === "end"
      )
    ).toBe(true)
  })

  it("omits the connector after the last event", () => {
    const { container } = render(
      <Timeline items={events} content={(event) => event.title} />
    )
    expect(slots(container, "timeline-marker")).toHaveLength(3)
    expect(slots(container, "timeline-connector")).toHaveLength(2)
  })

  it("renders the opposite, marker, and connector templates with the item and index", () => {
    const { container } = render(
      <Timeline
        items={events}
        content={(event) => event.title}
        opposite={(event, index) => `${index}: ${event.date}`}
        marker={(event) => <span data-slot="custom-marker">{event.id[0]}</span>}
        connector={() => <span data-slot="custom-connector" />}
      />
    )
    expect(
      slots(container, "timeline-opposite").map((node) => node.textContent)
    ).toEqual(["0: 09:14", "1: 09:15", "2: 09:17"])
    expect(
      slots(container, "custom-marker").map((node) => node.textContent)
    ).toEqual(["o", "d", "r"])
    expect(slots(container, "custom-connector")).toHaveLength(2)
    expect(slots(container, "timeline-marker")).toHaveLength(0)
  })

  it("reserves the opposite column in alternate mode even without a template", () => {
    const { container } = render(
      <Timeline
        items={events}
        align="alternate"
        content={(event) => event.title}
      />
    )
    expect(slots(container, "timeline-opposite")).toHaveLength(3)
  })

  it("reports its orientation", () => {
    const { container } = render(
      <Timeline
        items={events}
        orientation="horizontal"
        content={(event) => event.title}
      />
    )
    const root = container.querySelector('[data-slot="timeline"]')
    expect(root).toHaveAttribute("data-orientation", "horizontal")
  })

  it("keys items by a custom getKey without affecting output", () => {
    const { container } = render(
      <Timeline
        items={events}
        getKey={(event) => event.date}
        content={(event) => event.title}
      />
    )
    expect(slots(container, "timeline-event")).toHaveLength(3)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <Timeline
          items={events}
          align="alternate"
          content={(event) => event.title}
          opposite={(event) => event.date}
        />
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

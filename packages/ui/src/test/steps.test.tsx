import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  Steps,
  StepsContent,
  StepsPanel,
  StepsRoot,
  useSteps,
  type Step,
} from "../components/steps"

afterEach(cleanup)

const steps: Step[] = [
  { id: "vehicle", title: "Vehicle" },
  { id: "owner", title: "Owner", description: "Who is buying" },
  { id: "review", title: "Review" },
]

function triggers() {
  return screen.getAllByRole("button")
}

function Wizard(props: { linear?: boolean; defaultValue?: number }) {
  return (
    <StepsRoot steps={steps} {...props}>
      <Steps />
      <StepsContent>
        <StepsPanel step="vehicle">Vehicle form</StepsPanel>
        <StepsPanel step="owner">Owner form</StepsPanel>
        <StepsPanel step="review">
          {(helpers) => (
            <div>
              <p>Reviewing {helpers.index + 1}</p>
              <button type="button" onClick={helpers.prev}>
                Back
              </button>
              {helpers.isLast && <span>Last step</span>}
            </div>
          )}
        </StepsPanel>
      </StepsContent>
    </StepsRoot>
  )
}

describe("Steps", () => {
  it("keeps working standalone", async () => {
    const onValueChange = vi.fn()
    render(<Steps steps={steps} onValueChange={onValueChange} />)
    expect(triggers()[0]).toHaveAttribute("aria-current", "step")

    await userEvent.click(triggers()[2])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(2)
    expect(triggers()[2]).toHaveAttribute("aria-current", "step")
  })

  it("marks completed, current, and upcoming steps", () => {
    const { container } = render(<Steps steps={steps} value={1} />)
    expect(
      Array.from(container.querySelectorAll("li")).map(
        (item) => item.dataset.state
      )
    ).toEqual(["complete", "current", "upcoming"])
  })

  it("connects every step but the last", () => {
    const { container } = render(<Steps steps={steps} />)
    const connectors = container.querySelectorAll(
      '[data-slot="steps-connector"]'
    )
    expect(connectors).toHaveLength(steps.length - 1)
    // Laid out beside the label rather than over it, so it cannot cross the
    // title: the connector is a flex sibling, never an absolute overlay.
    for (const connector of connectors) {
      expect(connector.className).toContain("flex-1")
      expect(connector.className).not.toContain("absolute")
    }
  })

  it("rails the connectors down the indicators when vertical", () => {
    const { container } = render(<Steps steps={steps} orientation="vertical" />)
    const connectors = container.querySelectorAll(
      '[data-slot="steps-connector"]'
    )
    expect(connectors).toHaveLength(steps.length - 1)
    for (const connector of connectors) {
      expect(connector.className).toContain("absolute")
      expect(connector.className).toContain("w-px")
    }
  })

  it("blocks forward clicks when linear, allowing backward ones", async () => {
    const onValueChange = vi.fn()
    render(
      <Steps
        steps={steps}
        linear
        defaultValue={1}
        onValueChange={onValueChange}
      />
    )
    expect(triggers()[2]).toBeDisabled()

    await userEvent.click(triggers()[2])
    expect(onValueChange).not.toHaveBeenCalled()

    await userEvent.click(triggers()[0])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(0)
  })
})

describe("StepsRoot", () => {
  it("shows only the active panel and keeps the others mounted", async () => {
    const { container } = render(<Wizard />)
    const panels = Array.from(
      container.querySelectorAll('[data-slot="steps-panel"]')
    )
    expect(panels.map((panel) => panel.getAttribute("data-state"))).toEqual([
      "active",
      "inactive",
      "inactive",
    ])
    expect(panels[1]).not.toBeVisible()
    expect(screen.getByText("Owner form")).toBeInTheDocument()

    await userEvent.click(triggers()[1])
    expect(panels[1]).toBeVisible()
    expect(panels[0]).not.toBeVisible()
  })

  it("passes helpers to a panel render prop", async () => {
    render(<Wizard defaultValue={2} />)
    expect(screen.getByText("Reviewing 3")).toBeInTheDocument()
    expect(screen.getByText("Last step")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Back" }))
    expect(screen.getByText("Owner form")).toBeVisible()
  })

  it("navigates with useSteps, ignoring the linear click guard", async () => {
    function Footer() {
      const { next, prev, isFirst, isLast, index, value } = useSteps()
      return (
        <div>
          <span>
            {index}:{value}
          </span>
          <button type="button" onClick={prev} disabled={isFirst}>
            Previous
          </button>
          <button type="button" onClick={next} disabled={isLast}>
            Next
          </button>
        </div>
      )
    }
    render(
      <StepsRoot steps={steps} linear>
        <Steps />
        <Footer />
      </StepsRoot>
    )
    expect(screen.getByText("0:vehicle")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("1:owner")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    // The last step clamps, and Next disables there.
    expect(screen.getByText("2:review")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("jumps to a step by id or index", async () => {
    function Jump() {
      const { goTo } = useSteps()
      return (
        <div>
          <button type="button" onClick={() => goTo("review")}>
            To review
          </button>
          <button type="button" onClick={() => goTo(0)}>
            To first
          </button>
        </div>
      )
    }
    render(
      <StepsRoot steps={steps}>
        <Steps />
        <StepsContent>
          <StepsPanel step="review">Review form</StepsPanel>
        </StepsContent>
        <Jump />
      </StepsRoot>
    )
    await userEvent.click(screen.getByRole("button", { name: "To review" }))
    expect(screen.getByText("Review form")).toBeVisible()

    await userEvent.click(screen.getByRole("button", { name: "To first" }))
    expect(screen.getByText("Review form")).not.toBeVisible()
  })

  it("reports the active step to a controlled owner", async () => {
    const onValueChange = vi.fn()
    render(
      <StepsRoot steps={steps} value={0} onValueChange={onValueChange}>
        <Steps />
      </StepsRoot>
    )
    await userEvent.click(triggers()[2])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(2)
    // Controlled: the indicator stays put until the owner updates value.
    expect(triggers()[0]).toHaveAttribute("aria-current", "step")
  })

  it("throws when useSteps is used without a root", () => {
    function Orphan() {
      useSteps()
      return null
    }
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Orphan />)).toThrow(/StepsRoot/)
    error.mockRestore()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <Wizard defaultValue={1} />
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

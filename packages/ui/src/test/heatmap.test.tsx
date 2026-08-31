import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Heatmap } from "../components/heatmap"

afterEach(cleanup)

describe("Heatmap", () => {
  it("renders with an accessible name and title", () => {
    render(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[{ date: "2026-08-12", value: 1240 }]}
      />
    )
    const chart = screen.getByRole("img", { name: "Daily revenue" })
    expect(chart).toBeVisible()
    expect(chart.querySelector("title")).toHaveTextContent("Daily revenue")
  })

  it("labels cells and supports keyboard selection", () => {
    const onCellSelect = vi.fn()
    render(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[{ date: "2026-08-12", value: 1240 }]}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
        onCellSelect={onCellSelect}
      />
    )
    const cell = screen.getByRole("button", { name: "Aug 12, 2026: $1,240" })
    fireEvent.keyDown(cell, { key: "Enter" })
    expect(onCellSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 1240 })
    )
    const selected = onCellSelect.mock.calls[0]?.[0].date as Date
    expect(selected.getFullYear()).toBe(2026)
    expect(selected.getMonth()).toBe(7)
    expect(selected.getDate()).toBe(12)
  })

  it("renders the empty state without an svg", () => {
    render(
      <Heatmap ariaLabel="Daily revenue" data={[]} emptyMessage="No revenue" />
    )
    expect(screen.getByText("No revenue")).toBeVisible()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("shows and hides the legend", () => {
    const { rerender } = render(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[{ date: "2026-08-12", value: 12100 }]}
      />
    )
    expect(screen.getByText("Less")).toBeVisible()
    expect(screen.getByText("More")).toBeVisible()
    expect(screen.getByText(/up to 12,100/)).toBeVisible()
    rerender(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[{ date: "2026-08-12", value: 12100 }]}
        showLegend={false}
      />
    )
    expect(screen.queryByText("Less")).not.toBeInTheDocument()
  })

  it("renders one cell per in-range day including partial weeks", () => {
    // 2026-08-05 is a Wednesday; the range spans two partial weeks.
    render(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[{ date: "2026-08-06", value: 3 }]}
        startDate="2026-08-05"
        endDate="2026-08-14"
      />
    )
    expect(screen.getAllByRole("button")).toHaveLength(10)
  })

  it("does not shift string dates across the DST boundary", () => {
    // US DST begins 2026-03-08.
    render(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[
          { date: "2026-03-07", value: 1 },
          { date: "2026-03-08", value: 2 },
          { date: "2026-03-09", value: 3 },
        ]}
      />
    )
    expect(
      screen.getByRole("button", { name: "Mar 7, 2026: 1" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Mar 8, 2026: 2" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Mar 9, 2026: 3" })
    ).toBeInTheDocument()
  })

  it("maps values to quantized color levels", () => {
    render(
      <Heatmap
        ariaLabel="Daily revenue"
        data={[
          { date: "2026-08-10", value: 0 },
          { date: "2026-08-11", value: 20 },
          { date: "2026-08-12", value: 100 },
        ]}
        colors={["c1", "c2", "c3", "c4", "c5"]}
        emptyColor="red"
      />
    )
    expect(
      screen.getByRole("button", { name: "Aug 10, 2026: 0" })
    ).toHaveAttribute("fill", "red")
    expect(
      screen.getByRole("button", { name: "Aug 11, 2026: 20" })
    ).toHaveAttribute("fill", "c1")
    expect(
      screen.getByRole("button", { name: "Aug 12, 2026: 100" })
    ).toHaveAttribute("fill", "c5")
  })
})

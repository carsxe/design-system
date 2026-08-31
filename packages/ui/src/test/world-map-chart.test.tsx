import * as React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  WorldMapChart,
  type WorldMapCountry,
} from "../components/world-map-chart"

const chartMock = vi.hoisted(() => ({
  instances: [] as Array<MockChart>,
  hitIndex: 0,
}))

type MockChart = {
  data: {
    labels: string[]
    datasets: Array<Record<string, unknown> & { data: unknown[] }>
  }
  config: Record<string, unknown>
  update: ReturnType<typeof vi.fn>
  destroy: ReturnType<typeof vi.fn>
  setActiveElements: ReturnType<typeof vi.fn>
  getDatasetMeta: ReturnType<typeof vi.fn>
  getElementsAtEventForMode: ReturnType<typeof vi.fn>
}

vi.mock("chart.js", () => {
  class Chart {
    static register = vi.fn()
    data: MockChart["data"]
    config: Record<string, unknown>
    update = vi.fn()
    destroy = vi.fn()
    setActiveElements = vi.fn()
    getDatasetMeta = vi.fn(() => ({
      data: Array.from(
        { length: this.data.datasets[0]?.data.length ?? 180 },
        () => ({
          getCenterPoint: () => ({ x: 120, y: 80 }),
        })
      ),
    }))
    getElementsAtEventForMode = vi.fn(() => [
      { datasetIndex: 0, index: chartMock.hitIndex },
    ])

    constructor(_canvas: HTMLCanvasElement, config: Record<string, unknown>) {
      this.config = config
      this.data = config.data as MockChart["data"]
      chartMock.instances.push(this)
    }
  }

  return { Chart }
})

vi.mock("chartjs-chart-geo", () => ({
  ChoroplethController: class {},
  ColorScale: class {},
  GeoFeature: class {},
  ProjectionScale: class {},
}))

afterEach(() => {
  cleanup()
  chartMock.instances.length = 0
  chartMock.hitIndex = 0
})

describe("WorldMapChart", () => {
  it("normalizes ISO codes, keeps the last duplicate, and selects with the keyboard", async () => {
    const onCountrySelect = vi.fn<(country: WorldMapCountry) => void>()
    render(
      <WorldMapChart
        ariaLabel="Report volume by country"
        data={[
          { countryCode: "us", value: 10 },
          { countryCode: "USA", value: 20 },
          { countryCode: "840", value: 30, label: "United States" },
          { countryCode: "ca", value: 12 },
          { countryCode: "not-a-country", value: 999 },
          { countryCode: "DE", value: Number.NaN },
        ]}
        onCountrySelect={onCountrySelect}
      />
    )

    const canvas = screen.getByRole("img", {
      name: "Report volume by country",
    })
    await waitFor(() => expect(chartMock.instances).toHaveLength(1))

    fireEvent.keyDown(canvas, { key: "ArrowRight" })
    expect(screen.getByRole("tooltip")).toHaveTextContent("United States")
    expect(screen.getByRole("tooltip")).toHaveTextContent("30")
    fireEvent.keyDown(canvas, { key: "Enter" })
    expect(onCountrySelect).toHaveBeenCalledWith(
      expect.objectContaining({ alpha2: "US", numeric: "840", value: 30 })
    )

    fireEvent.keyDown(canvas, { key: "ArrowRight" })
    expect(screen.getByRole("tooltip")).toHaveTextContent("Canada")
    fireEvent.keyDown(canvas, { key: "Escape" })
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("updates data and styles, supports pointer selection, and destroys the chart", async () => {
    const onCountrySelect = vi.fn()
    const { rerender, unmount } = render(
      <WorldMapChart
        ariaLabel="Coverage"
        data={[
          { countryCode: "US", value: -4 },
          { countryCode: "CA", value: 0 },
        ]}
        colors={["#4dccee", "#065774"]}
        selectedCountryCode="CA"
        onCountrySelect={onCountrySelect}
      />
    )
    await waitFor(() => expect(chartMock.instances).toHaveLength(1))
    const instance = chartMock.instances[0]
    const labels = instance.data.labels
    chartMock.hitIndex = labels.indexOf("United States of America")

    const canvas = screen.getByRole("img", { name: "Coverage" })
    fireEvent.mouseMove(canvas, { clientX: 120, clientY: 80 })
    expect(screen.getByRole("tooltip")).toHaveTextContent("United States")
    fireEvent.click(canvas, { clientX: 120, clientY: 80 })
    expect(onCountrySelect).toHaveBeenCalledWith(
      expect.objectContaining({ alpha3: "USA", value: -4 })
    )

    const dataset = instance.data.datasets[0]
    const backgroundColor = dataset.backgroundColor as (context: {
      raw: { value: number }
    }) => string
    const borderColor = dataset.borderColor as (context: {
      raw: { feature: { id: string } }
    }) => string
    expect(backgroundColor({ raw: { value: -4 } })).not.toBe(
      backgroundColor({ raw: { value: Number.NaN } })
    )
    expect(borderColor({ raw: { feature: { id: "124" } } })).not.toBe(
      borderColor({ raw: { feature: { id: "840" } } })
    )

    rerender(
      <WorldMapChart
        ariaLabel="Coverage"
        data={[{ countryCode: "DE", value: 8 }]}
        onCountrySelect={onCountrySelect}
      />
    )
    await waitFor(() => expect(instance.update).toHaveBeenCalled())
    expect(instance.data.datasets[0].data).toEqual(
      expect.arrayContaining([expect.objectContaining({ value: 8 })])
    )

    unmount()
    expect(instance.destroy).toHaveBeenCalledOnce()
  })

  it("renders a readable empty state for invalid data", () => {
    render(
      <WorldMapChart
        ariaLabel="Empty coverage"
        data={[{ countryCode: "ZZZ", value: 1 }]}
        emptyMessage="Add country report data"
      />
    )

    expect(screen.getByText("Add country report data")).toBeVisible()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(chartMock.instances).toHaveLength(0)
  })

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <WorldMapChart
        ariaLabel="Accessible coverage map"
        description="Vehicle reports completed in each country."
        data={[{ countryCode: "US", value: 24 }]}
      />
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

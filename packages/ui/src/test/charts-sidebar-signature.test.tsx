import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  ForceDirectedGraph,
  SankeyChart,
  SunburstChart,
  TreemapChart,
} from "../components/d3-chart"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/sidebar"
import {
  SignaturePad,
  type SignaturePadHandle,
} from "../components/signature-pad"

afterEach(cleanup)

const hierarchy = {
  id: "inventory",
  label: "Inventory",
  children: [
    { id: "suv", label: "SUV", value: 12 },
    { id: "sedan", label: "Sedan", value: 8 },
  ],
}

describe("D3 charts", () => {
  it("renders all four responsive chart types with accessible names", () => {
    render(
      <>
        <SankeyChart
          ariaLabel="Lifecycle"
          nodes={[{ id: "listed" }, { id: "sold" }]}
          links={[{ source: "listed", target: "sold", value: 4 }]}
        />
        <ForceDirectedGraph
          ariaLabel="Records"
          nodes={[{ id: "vehicle" }, { id: "owner" }]}
          links={[{ source: "vehicle", target: "owner" }]}
        />
        <TreemapChart ariaLabel="Composition" data={hierarchy} />
        <SunburstChart ariaLabel="Hierarchy" data={hierarchy} />
      </>
    )

    expect(screen.getByRole("img", { name: "Lifecycle" })).toBeVisible()
    expect(screen.getByRole("img", { name: "Records" })).toBeVisible()
    expect(screen.getByRole("img", { name: "Composition" })).toBeVisible()
    expect(screen.getByRole("img", { name: "Hierarchy" })).toBeVisible()
  })

  it("supports keyboard node selection and empty states", () => {
    const onNodeSelect = vi.fn()
    render(
      <>
        <TreemapChart
          ariaLabel="Composition"
          data={hierarchy}
          onNodeSelect={onNodeSelect}
        />
        <SankeyChart
          ariaLabel="Empty flow"
          nodes={[]}
          links={[]}
          emptyMessage="No lifecycle records"
        />
      </>
    )
    fireEvent.keyDown(screen.getByRole("button", { name: "SUV: 12" }), {
      key: "Enter",
    })
    expect(onNodeSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "suv" })
    )
    expect(screen.getByText("No lifecycle records")).toBeVisible()
  })
})

describe("Signature Pad", () => {
  it("draws, submits, undoes, redoes, clears, and exports SVG", () => {
    const ref = React.createRef<SignaturePadHandle>()
    const onPathsChange = vi.fn()
    render(
      <SignaturePad
        ref={ref}
        label="Authorization"
        name="authorization"
        onPathsChange={onPathsChange}
      />
    )
    const segment = screen.getByRole("img", { name: "Authorization" })
    Object.defineProperties(segment, {
      setPointerCapture: { value: vi.fn() },
      hasPointerCapture: { value: () => true },
      releasePointerCapture: { value: vi.fn() },
      getBoundingClientRect: {
        value: () => ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 500,
          bottom: 200,
          width: 500,
          height: 200,
          toJSON: () => ({}),
        }),
      },
    })

    fireEvent.pointerDown(segment, { pointerId: 1, clientX: 40, clientY: 80 })
    fireEvent.pointerMove(segment, { pointerId: 1, clientX: 180, clientY: 110 })
    fireEvent.pointerUp(segment, { pointerId: 1, clientX: 220, clientY: 120 })

    expect(onPathsChange).toHaveBeenCalled()
    const input = document.querySelector<HTMLInputElement>(
      'input[name="authorization"]'
    )
    expect(input?.value).not.toBe("[]")
    expect(ref.current?.toSVG()).toContain("<svg")

    fireEvent.click(
      screen.getByRole("button", { name: "Undo signature stroke" })
    )
    expect(input?.value).toBe("[]")
    fireEvent.click(
      screen.getByRole("button", { name: "Redo signature stroke" })
    )
    expect(input?.value).not.toBe("[]")
    fireEvent.click(screen.getByRole("button", { name: "Clear signature" }))
    expect(input?.value).toBe("[]")
  })
})

describe("Sidebar", () => {
  it("toggles through its trigger and keyboard shortcut", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarContent />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    )
    const sidebar = container.querySelector('[data-slot="sidebar"]')
    expect(sidebar).toHaveAttribute("data-state", "expanded")
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
    fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    expect(sidebar).toHaveAttribute("data-state", "expanded")
  })

  it("supports controlled state", () => {
    const change = vi.fn()
    render(
      <SidebarProvider open={false} onOpenChange={change}>
        <Sidebar collapsible="offcanvas">
          <SidebarContent />
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
    expect(change).toHaveBeenCalledWith(true)
  })
})

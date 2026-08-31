import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  collectTreeViewIds,
  moveTreeViewItem,
  toggleTreeViewChecked,
  TreeView,
  type TreeViewItem,
  type TreeViewMoveDetails,
} from "../components/tree-view"

afterEach(cleanup)

const items: TreeViewItem[] = [
  {
    id: "vehicles",
    label: "Vehicles",
    children: [
      { id: "sedan", label: "Sedan" },
      { id: "truck", label: "Truck" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    children: [{ id: "history", label: "History report" }],
  },
]

function row(container: HTMLElement, id: string) {
  const node = container.querySelector<HTMLElement>(
    `[data-id="${id}"] > [data-slot="tree-view-item"]`
  )
  if (!node) throw new Error(`No row for ${id}`)
  return node
}

function labels(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('[data-slot="tree-view-item-trigger"]')
  ).map((node) => node.textContent)
}

/** jsdom has no drag data or layout, so both are supplied by hand. */
function dataTransfer() {
  const store = new Map<string, string>()
  return {
    effectAllowed: "",
    dropEffect: "",
    setData: (key: string, value: string) => store.set(key, value),
    getData: (key: string) => store.get(key) ?? "",
  }
}

/**
 * jsdom builds DragEvent without the mouse coordinates, so drag events are
 * dispatched as mouse events carrying a hand-made dataTransfer.
 */
function drag(
  node: HTMLElement,
  type: "dragstart" | "dragover" | "drop",
  transfer: ReturnType<typeof dataTransfer>,
  clientY = 0
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientY,
  })
  Object.defineProperty(event, "dataTransfer", { value: transfer })
  fireEvent(node, event)
}

function stubRow(node: HTMLElement) {
  node.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    width: 200,
    height: 36,
    right: 200,
    bottom: 36,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
  return node
}

describe("tree helpers", () => {
  it("collects ids, optionally only branches", () => {
    expect(collectTreeViewIds(items)).toEqual([
      "vehicles",
      "sedan",
      "truck",
      "reports",
      "history",
    ])
    expect(collectTreeViewIds(items, { branchesOnly: true })).toEqual([
      "vehicles",
      "reports",
    ])
  })

  it("cascades checks down and promotes ancestors", () => {
    const one = toggleTreeViewChecked(items, [], "sedan")
    expect(one).toEqual(["sedan"])

    const both = toggleTreeViewChecked(items, one, "truck")
    expect([...both].sort()).toEqual(["sedan", "truck", "vehicles"])

    const cleared = toggleTreeViewChecked(items, both, "vehicles")
    expect(cleared).toEqual([])
  })

  it("checks a whole subtree from its parent", () => {
    expect([...toggleTreeViewChecked(items, [], "vehicles")].sort()).toEqual([
      "sedan",
      "truck",
      "vehicles",
    ])
  })

  it("moves items before, after, and inside a target", () => {
    const inside = moveTreeViewItem(items, "sedan", "reports", "inside")
    expect(inside[0].children?.map((child) => child.id)).toEqual(["truck"])
    expect(inside[1].children?.map((child) => child.id)).toEqual([
      "history",
      "sedan",
    ])

    const before = moveTreeViewItem(items, "history", "sedan", "before")
    expect(before[0].children?.map((child) => child.id)).toEqual([
      "history",
      "sedan",
      "truck",
    ])

    const after = moveTreeViewItem(items, "history", "vehicles", "after")
    expect(after.map((item) => item.id)).toEqual([
      "vehicles",
      "history",
      "reports",
    ])
  })

  it("refuses to move an item into its own subtree", () => {
    expect(moveTreeViewItem(items, "vehicles", "sedan", "inside")).toBe(items)
    expect(moveTreeViewItem(items, "sedan", "sedan", "after")).toBe(items)
  })
})

describe("TreeView", () => {
  it("selects one item at a time by default", async () => {
    const onValueChange = vi.fn()
    render(
      <TreeView
        aria-label="Tree"
        items={items}
        defaultExpanded={["vehicles"]}
        onValueChange={onValueChange}
      />
    )
    await userEvent.click(screen.getByText("Sedan"))
    await userEvent.click(screen.getByText("Truck"))
    expect(onValueChange).toHaveBeenNthCalledWith(1, ["sedan"])
    expect(onValueChange).toHaveBeenNthCalledWith(2, ["truck"])
  })

  it("keeps the multiple prop working", async () => {
    const onValueChange = vi.fn()
    render(
      <TreeView
        aria-label="Tree"
        items={items}
        multiple
        defaultExpanded={["vehicles"]}
        onValueChange={onValueChange}
      />
    )
    await userEvent.click(screen.getByText("Sedan"))
    await userEvent.click(screen.getByText("Truck"))
    expect(onValueChange).toHaveBeenLastCalledWith(["sedan", "truck"])
    expect(screen.getByRole("tree")).toHaveAttribute(
      "data-selection-mode",
      "multiple"
    )
  })

  it("reports mixed state for partially checked branches", async () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        selectionMode="checkbox"
        value={["sedan"]}
        defaultExpanded={["vehicles"]}
        onValueChange={onValueChange}
      />
    )
    expect(container.querySelector('[data-id="vehicles"]')).toHaveAttribute(
      "aria-checked",
      "mixed"
    )
    expect(container.querySelector('[data-id="sedan"]')).toHaveAttribute(
      "aria-checked",
      "true"
    )
    expect(
      row(container, "vehicles").querySelector(
        '[data-slot="tree-view-item-checkbox"]'
      )
    ).toHaveAttribute("data-state", "indeterminate")

    await userEvent.click(screen.getByText("Truck"))
    expect([...onValueChange.mock.calls[0][0]].sort()).toEqual([
      "sedan",
      "truck",
      "vehicles",
    ])
  })

  it("filters leniently, keeping the matched subtree", () => {
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        filter="vehicles"
        defaultExpanded={["vehicles"]}
      />
    )
    expect(labels(container)).toEqual(["Vehicles", "Sedan", "Truck"])
  })

  it("filters strictly, pruning to the matching path", () => {
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        filter="vehicles"
        filterMode="strict"
        defaultExpanded={["vehicles"]}
      />
    )
    expect(labels(container)).toEqual(["Vehicles"])
  })

  it("reveals matches without expanding the whole tree", () => {
    const { container } = render(
      <TreeView aria-label="Tree" items={items} filter="truck" />
    )
    expect(labels(container)).toEqual(["Vehicles", "Truck"])
  })

  it("shows the empty message when nothing matches", () => {
    render(
      <TreeView
        aria-label="Tree"
        items={items}
        filter="motorcycle"
        emptyMessage="Nothing here."
      />
    )
    expect(screen.getByText("Nothing here.")).toBeInTheDocument()
  })

  it("debounces the filter field", async () => {
    const onFilterChange = vi.fn()
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        showFilter
        filterDelay={20}
        onFilterChange={onFilterChange}
      />
    )
    await userEvent.type(screen.getByLabelText("Filter tree"), "truck")
    expect(onFilterChange).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledExactlyOnceWith("truck")
    })
    await waitFor(() => {
      expect(labels(container)).toEqual(["Vehicles", "Truck"])
    })
  })

  it("loads lazy children once, showing a spinner", async () => {
    let resolve = () => {}
    const onExpand = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={[{ id: "remote", label: "Remote", lazy: true }]}
        onExpand={onExpand}
      />
    )
    await userEvent.click(screen.getByLabelText("Expand"))
    expect(onExpand).toHaveBeenCalledTimes(1)
    expect(
      container.querySelector('[data-slot="tree-view-item-toggle"]')
    ).toHaveAttribute("data-loading", "true")

    resolve()
    await waitFor(() => {
      expect(
        container.querySelector('[data-slot="tree-view-item-toggle"]')
      ).not.toHaveAttribute("data-loading")
    })
  })

  it("renders a row template with the item state", () => {
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        value={["vehicles"]}
        defaultExpanded={["vehicles"]}
        renderItem={(item, state) => `${item.id}:${state.level}`}
      />
    )
    expect(labels(container)).toEqual([
      "vehicles:1",
      "sedan:2",
      "truck:2",
      "reports:1",
    ])
  })

  it("leaves unselectable and disabled items inert", async () => {
    const onValueChange = vi.fn()
    render(
      <TreeView
        aria-label="Tree"
        items={[
          { id: "locked", label: "Locked", selectable: false },
          { id: "off", label: "Off", disabled: true },
        ]}
        onValueChange={onValueChange}
      />
    )
    await userEvent.click(screen.getByText("Locked"))
    await userEvent.click(screen.getByText("Off"))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("moves an item on drop and reports the new tree", () => {
    const onItemsMove = vi.fn<(details: TreeViewMoveDetails) => void>()
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        dragAndDrop
        defaultExpanded={["vehicles", "reports"]}
        onItemsMove={onItemsMove}
      />
    )
    const transfer = dataTransfer()
    drag(row(container, "sedan"), "dragstart", transfer)
    const target = stubRow(row(container, "reports"))
    drag(target, "dragover", transfer, 18)
    expect(target).toHaveAttribute("data-drop-position", "inside")
    drag(target, "drop", transfer, 18)

    expect(onItemsMove).toHaveBeenCalledTimes(1)
    const details = onItemsMove.mock.calls[0][0]
    expect(details.position).toBe("inside")
    expect(details.item.id).toBe("sedan")
    expect(details.target.id).toBe("reports")
    expect(details.items[1].children?.map((child) => child.id)).toEqual([
      "history",
      "sedan",
    ])
  })

  it("drops before or after depending on the cursor", () => {
    const onItemsMove = vi.fn<(details: TreeViewMoveDetails) => void>()
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        dragAndDrop
        defaultExpanded={["vehicles", "reports"]}
        onItemsMove={onItemsMove}
      />
    )
    const transfer = dataTransfer()
    drag(row(container, "history"), "dragstart", transfer)
    const target = stubRow(row(container, "sedan"))
    drag(target, "dragover", transfer, 2)
    expect(target).toHaveAttribute("data-drop-position", "before")
    drag(target, "drop", transfer, 2)
    expect(onItemsMove.mock.calls[0][0].position).toBe("before")
    expect(
      onItemsMove.mock.calls[0][0].items[0].children?.map((child) => child.id)
    ).toEqual(["history", "sedan", "truck"])
  })

  it("refuses to drop a branch inside its own descendant", () => {
    const onItemsMove = vi.fn<(details: TreeViewMoveDetails) => void>()
    const { container } = render(
      <TreeView
        aria-label="Tree"
        items={items}
        dragAndDrop
        defaultExpanded={["vehicles"]}
        onItemsMove={onItemsMove}
      />
    )
    const transfer = dataTransfer()
    drag(row(container, "vehicles"), "dragstart", transfer)
    const target = stubRow(row(container, "sedan"))
    drag(target, "dragover", transfer, 18)
    expect(target).not.toHaveAttribute("data-drop-position")
    drag(target, "drop", transfer, 18)
    expect(onItemsMove).not.toHaveBeenCalled()
  })

  it("expands with the arrow keys", async () => {
    const { container } = render(<TreeView aria-label="Tree" items={items} />)
    const first = container.querySelector<HTMLElement>('[data-id="vehicles"]')
    first?.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(labels(container)).toEqual(["Vehicles", "Sedan", "Truck", "Reports"])
    await userEvent.keyboard("{ArrowLeft}")
    expect(labels(container)).toEqual(["Vehicles", "Reports"])
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <TreeView
          aria-label="Tree"
          items={items}
          selectionMode="checkbox"
          value={["sedan"]}
          defaultExpanded={["vehicles"]}
          showFilter
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

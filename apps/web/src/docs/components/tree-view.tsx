import * as React from "react"
import { FileTextIcon, FolderIcon } from "lucide-react"
import { Button } from "@carsxe/design-system/components/button"
import {
  collectTreeViewIds,
  TreeView,
  type TreeViewItem,
} from "@carsxe/design-system/components/tree-view"

import type { ComponentDoc } from "./types"

const catalog: TreeViewItem[] = [
  {
    id: "vehicle",
    label: "Vehicle data",
    children: [
      { id: "specs", label: "Specifications" },
      { id: "recalls", label: "Recalls" },
      { id: "images", label: "Vehicle images" },
    ],
  },
  {
    id: "history",
    label: "History",
    children: [
      { id: "title", label: "Title check" },
      { id: "theft", label: "Theft record" },
      { id: "sales", label: "Sales listings" },
    ],
  },
  {
    id: "market",
    label: "Market value",
    children: [{ id: "value", label: "Market value" }],
  },
]

function TreeViewDefaultExample() {
  return (
    <TreeView
      aria-label="API catalog"
      items={catalog}
      defaultExpanded={["vehicle"]}
      defaultValue={["specs"]}
    />
  )
}

function TreeViewCheckboxExample() {
  const [value, setValue] = React.useState<string[]>(["specs"])

  return (
    <div className="flex flex-col items-start gap-2">
      <TreeView
        aria-label="Report sections"
        items={catalog}
        selectionMode="checkbox"
        value={value}
        onValueChange={setValue}
        defaultExpanded={["vehicle", "history"]}
      />
      <p className="text-xs text-muted-foreground">
        {value.length} checked. A branch shows a dash while only some of its
        children are checked.
      </p>
    </div>
  )
}

function TreeViewFilterExample() {
  return (
    <TreeView
      aria-label="Searchable catalog"
      items={catalog}
      showFilter
      filterDelay={250}
    />
  )
}

function TreeViewStrictFilterExample() {
  return (
    <TreeView
      aria-label="Strictly filtered catalog"
      items={catalog}
      showFilter
      filterMode="strict"
      emptyMessage="No endpoint matches that search."
    />
  )
}

function TreeViewLazyExample() {
  const [items, setItems] = React.useState<TreeViewItem[]>([
    { id: "reports", label: "Reports", lazy: true },
  ])

  return (
    <TreeView
      aria-label="Lazy catalog"
      items={items}
      onExpand={async (item) => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        setItems((current) =>
          current.map((node) =>
            node.id === item.id
              ? {
                  ...node,
                  children: [
                    { id: "vin", label: "VIN decoder" },
                    { id: "plate", label: "Plate decoder" },
                  ],
                }
              : node
          )
        )
      }}
    />
  )
}

function TreeViewTemplateExample() {
  return (
    <TreeView
      aria-label="Templated catalog"
      items={catalog}
      defaultExpanded={["vehicle"]}
      renderItem={(item, state) => (
        <span className="flex items-center gap-2">
          {state.level === 1 ? (
            <FolderIcon className="size-4 text-muted-foreground" />
          ) : (
            <FileTextIcon className="size-4 text-muted-foreground" />
          )}
          {item.label}
          {state.selected && (
            <span className="text-xs text-muted-foreground">selected</span>
          )}
        </span>
      )}
    />
  )
}

function TreeViewExpandAllExample() {
  const [expanded, setExpanded] = React.useState<string[]>([])

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setExpanded(collectTreeViewIds(catalog, { branchesOnly: true }))
          }
        >
          Expand all
        </Button>
        <Button size="sm" variant="outline" onClick={() => setExpanded([])}>
          Collapse all
        </Button>
      </div>
      <TreeView
        aria-label="Controlled catalog"
        items={catalog}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    </div>
  )
}

function TreeViewDragAndDropExample() {
  const [items, setItems] = React.useState(catalog)

  return (
    <div className="flex flex-col items-start gap-2">
      <TreeView
        aria-label="Reorderable catalog"
        items={items}
        dragAndDrop
        defaultExpanded={["vehicle", "history", "market"]}
        onItemsMove={(details) => setItems(details.items)}
      />
      <p className="text-xs text-muted-foreground">
        Drag a row onto the top or bottom edge of another to reorder it, or onto
        its middle to nest it.
      </p>
    </div>
  )
}

const treeView = {
  slug: "tree-view",
  title: "Tree view",
  description:
    "A hierarchical list with keyboard navigation. It selects one node, several nodes, or cascades checkboxes with a derived mixed state; filters with a debounced search field in either lenient or strict mode; loads children on demand; templates each row; and reorders by dragging.",
  importName: "TreeView",
  importPath: "@carsxe/design-system/components/tree-view",
  usage: `import { TreeView } from "@carsxe/design-system/components/tree-view"

<TreeView
  aria-label="API catalog"
  items={catalog}
  defaultExpanded={["vehicle"]}
  defaultValue={["specs"]}
/>`,
  preview: <TreeViewDefaultExample />,
  previewCode: `<TreeView
  aria-label="API catalog"
  items={catalog}
  defaultExpanded={["vehicle"]}
  defaultValue={["specs"]}
/>`,
  examples: [
    {
      title: "Cascading checkboxes",
      preview: <TreeViewCheckboxExample />,
      code: `// value holds the fully checked ids; mixed state is derived from them.
<TreeView
  aria-label="Report sections"
  items={catalog}
  selectionMode="checkbox"
  value={value}
  onValueChange={setValue}
/>`,
    },
    {
      title: "Filtering",
      preview: <TreeViewFilterExample />,
      code: `// showFilter renders a search field; typing is debounced by filterDelay.
<TreeView aria-label="Searchable catalog" items={catalog} showFilter filterDelay={250} />`,
    },
    {
      title: "Strict filtering",
      preview: <TreeViewStrictFilterExample />,
      code: `// strict prunes a matched branch to the matching path; lenient keeps its subtree.
<TreeView
  aria-label="Strictly filtered catalog"
  items={catalog}
  showFilter
  filterMode="strict"
  emptyMessage="No endpoint matches that search."
/>`,
    },
    {
      title: "Lazy children",
      preview: <TreeViewLazyExample />,
      code: `// A lazy node calls onExpand once and shows a spinner until it resolves.
<TreeView
  aria-label="Lazy catalog"
  items={items}
  onExpand={async (item) => {
    const children = await fetchChildren(item.id)
    setItems((current) => attach(current, item.id, children))
  }}
/>`,
    },
    {
      title: "Row template",
      preview: <TreeViewTemplateExample />,
      code: `<TreeView
  aria-label="Templated catalog"
  items={catalog}
  renderItem={(item, state) => (
    <span className="flex items-center gap-2">
      {state.level === 1 ? <FolderIcon /> : <FileTextIcon />}
      {item.label}
    </span>
  )}
/>`,
    },
    {
      title: "Expand and collapse all",
      preview: <TreeViewExpandAllExample />,
      code: `// collectTreeViewIds returns every id, or only the branches.
<Button onClick={() => setExpanded(collectTreeViewIds(catalog, { branchesOnly: true }))}>
  Expand all
</Button>
<TreeView items={catalog} expanded={expanded} onExpandedChange={setExpanded} />`,
    },
    {
      title: "Drag and drop",
      preview: <TreeViewDragAndDropExample />,
      code: `// onItemsMove hands back the reordered tree, ready to store.
<TreeView
  aria-label="Reorderable catalog"
  items={items}
  dragAndDrop
  onItemsMove={(details) => setItems(details.items)}
/>`,
    },
  ],
  props: [
    { name: "items", type: "TreeViewItem[]" },
    { name: "value", type: "string[]" },
    { name: "defaultValue", type: "string[]", defaultValue: "[]" },
    { name: "onValueChange", type: "(value: string[]) => void" },
    { name: "expanded", type: "string[]" },
    { name: "defaultExpanded", type: "string[]", defaultValue: "[]" },
    { name: "onExpandedChange", type: "(value: string[]) => void" },
    {
      name: "selectionMode",
      type: '"single" | "multiple" | "checkbox"',
      defaultValue: '"single"',
    },
    { name: "multiple", type: "boolean", defaultValue: "false" },
    { name: "filter", type: "string" },
    { name: "defaultFilter", type: "string", defaultValue: '""' },
    { name: "onFilterChange", type: "(filter: string) => void" },
    { name: "showFilter", type: "boolean", defaultValue: "false" },
    { name: "filterDelay", type: "number", defaultValue: "300" },
    {
      name: "filterMode",
      type: '"lenient" | "strict"',
      defaultValue: '"lenient"',
    },
    { name: "emptyMessage", type: "ReactNode" },
    { name: "onExpand", type: "(item: TreeViewItem) => void | Promise<void>" },
    {
      name: "renderItem",
      type: "(item: TreeViewItem, state: TreeViewItemState) => ReactNode",
    },
    { name: "dragAndDrop", type: "boolean", defaultValue: "false" },
    { name: "onItemsMove", type: "(details: TreeViewMoveDetails) => void" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
  ],
} satisfies ComponentDoc

export {
  treeView,
  TreeViewCheckboxExample,
  TreeViewDefaultExample,
  TreeViewDragAndDropExample,
  TreeViewExpandAllExample,
  TreeViewFilterExample,
  TreeViewLazyExample,
  TreeViewStrictFilterExample,
  TreeViewTemplateExample,
}

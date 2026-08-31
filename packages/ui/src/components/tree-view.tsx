"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronRightIcon,
  MinusIcon,
  SearchIcon,
} from "lucide-react"
import { useControllableState } from "../lib/use-controllable-state"
import { cn } from "@carsxe/design-system/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@carsxe/design-system/components/input-group"
import { Spinner } from "@carsxe/design-system/components/spinner"

export type TreeViewItem = {
  id: string
  label: React.ReactNode
  textValue?: string
  disabled?: boolean
  children?: TreeViewItem[]
  /** Rendered before the label. */
  icon?: React.ReactNode
  /** Opt a single node out of selection while keeping it expandable. */
  selectable?: boolean
  /** Children are fetched on first expand through `onExpand`. */
  lazy?: boolean
  draggable?: boolean
  droppable?: boolean
}

type TreeViewSelectionMode = "single" | "multiple" | "checkbox"
type TreeViewFilterMode = "lenient" | "strict"
type TreeViewDropPosition = "before" | "after" | "inside"

type TreeViewItemState = {
  selected: boolean
  expanded: boolean
  checked: boolean
  indeterminate: boolean
  level: number
  disabled: boolean
}

type TreeViewMoveDetails = {
  item: TreeViewItem
  target: TreeViewItem
  position: TreeViewDropPosition
  items: TreeViewItem[]
}

type TreeViewProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  items: TreeViewItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (value: string[]) => void
  /** Shorthand for `selectionMode="multiple"`. An explicit mode wins. */
  multiple?: boolean
  /**
   * `checkbox` turns `value` into the list of fully checked ids; partial state
   * is derived from it, never stored.
   */
  selectionMode?: TreeViewSelectionMode
  disabled?: boolean
  filter?: string
  defaultFilter?: string
  onFilterChange?: (filter: string) => void
  /** Renders a search field above the tree. */
  showFilter?: boolean
  filterDelay?: number
  /** `lenient` keeps a matched node's subtree; `strict` prunes to matches. */
  filterMode?: TreeViewFilterMode
  emptyMessage?: React.ReactNode
  /** Called when a `lazy` node without children is expanded. */
  onExpand?: (item: TreeViewItem) => void | Promise<void>
  /** Replaces the row content. */
  renderItem?: (item: TreeViewItem, state: TreeViewItemState) => React.ReactNode
  dragAndDrop?: boolean
  onItemsMove?: (details: TreeViewMoveDetails) => void
}

function itemText(item: TreeViewItem) {
  if (item.textValue !== undefined) return item.textValue
  return typeof item.label === "string" ? item.label : ""
}

/** Every id in the tree, optionally only the ones that have children. */
function collectTreeViewIds(
  items: TreeViewItem[],
  options?: { branchesOnly?: boolean }
): string[] {
  const ids: string[] = []
  const walk = (nodes: TreeViewItem[]) => {
    for (const node of nodes) {
      const hasChildren = !!node.children?.length
      if (hasChildren || !options?.branchesOnly) ids.push(node.id)
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return ids
}

function findTreeViewItem(
  items: TreeViewItem[],
  id: string
): TreeViewItem | undefined {
  for (const node of items) {
    if (node.id === id) return node
    const found = node.children
      ? findTreeViewItem(node.children, id)
      : undefined
    if (found) return found
  }
  return undefined
}

function isTreeViewDescendant(
  items: TreeViewItem[],
  ancestorId: string,
  id: string
): boolean {
  const ancestor = findTreeViewItem(items, ancestorId)
  if (!ancestor?.children) return false
  return collectTreeViewIds(ancestor.children).includes(id)
}

/**
 * Moves `sourceId` next to or inside `targetId`, returning a new tree. Moving a
 * node into its own subtree is a no-op.
 */
function moveTreeViewItem(
  items: TreeViewItem[],
  sourceId: string,
  targetId: string,
  position: TreeViewDropPosition
): TreeViewItem[] {
  if (sourceId === targetId) return items
  if (isTreeViewDescendant(items, sourceId, targetId)) return items
  const source = findTreeViewItem(items, sourceId)
  const target = findTreeViewItem(items, targetId)
  if (!source || !target) return items

  const remove = (nodes: TreeViewItem[]): TreeViewItem[] =>
    nodes
      .filter((node) => node.id !== sourceId)
      .map((node) =>
        node.children ? { ...node, children: remove(node.children) } : node
      )

  const insert = (nodes: TreeViewItem[]): TreeViewItem[] =>
    nodes.flatMap((node) => {
      if (node.id === targetId) {
        if (position === "inside") {
          return [{ ...node, children: [...(node.children ?? []), source] }]
        }
        const withChildren = node.children
          ? { ...node, children: insert(node.children) }
          : node
        return position === "before"
          ? [source, withChildren]
          : [withChildren, source]
      }
      return node.children
        ? [{ ...node, children: insert(node.children) }]
        : [node]
    })

  return insert(remove(items))
}

/**
 * Checks or unchecks `id` and cascades: checking adds every enabled descendant
 * and promotes ancestors whose children are now all checked, unchecking removes
 * the descendants and the ancestors.
 */
function toggleTreeViewChecked(
  items: TreeViewItem[],
  value: string[],
  id: string
): string[] {
  const node = findTreeViewItem(items, id)
  if (!node) return value
  const next = new Set(value)
  const descendants = node.children ? node.children : []

  const cascade = (nodes: TreeViewItem[], check: boolean) => {
    for (const child of nodes) {
      if (!child.disabled) {
        if (check) next.add(child.id)
        else next.delete(child.id)
      }
      if (child.children) cascade(child.children, check)
    }
  }

  const check = !next.has(id)
  if (check) next.add(id)
  else next.delete(id)
  cascade(descendants, check)

  // Ancestors follow their children: fully checked promotes, anything else demotes.
  const settle = (nodes: TreeViewItem[]): void => {
    for (const parent of nodes) {
      if (!parent.children?.length) continue
      settle(parent.children)
      const relevant = parent.children.filter((child) => !child.disabled)
      const all =
        relevant.length > 0 && relevant.every((child) => next.has(child.id))
      if (all && !parent.disabled) next.add(parent.id)
      else next.delete(parent.id)
    }
  }
  settle(items)

  return Array.from(next)
}

function filterTreeViewItems(
  items: TreeViewItem[],
  query: string,
  mode: TreeViewFilterMode
): TreeViewItem[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return items
  const walk = (nodes: TreeViewItem[]): TreeViewItem[] =>
    nodes.flatMap((node) => {
      const self = itemText(node).toLowerCase().includes(needle)
      if (self && mode === "lenient") return [node]
      const children = node.children ? walk(node.children) : []
      if (!self && !children.length) return []
      return [
        {
          ...node,
          children: children.length ? children : undefined,
        },
      ]
    })
  return walk(items)
}

/** Ids of the branches that have a match below them, so matches are visible. */
function revealTreeViewMatches(items: TreeViewItem[], query: string) {
  const needle = query.trim().toLowerCase()
  const ids = new Set<string>()
  if (!needle) return ids
  const walk = (nodes: TreeViewItem[]): boolean => {
    let found = false
    for (const node of nodes) {
      const below = node.children ? walk(node.children) : false
      if (below) ids.add(node.id)
      if (below || itemText(node).toLowerCase().includes(needle)) found = true
    }
    return found
  }
  walk(items)
  return ids
}

function TreeView({
  items,
  value,
  defaultValue = [],
  onValueChange,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  multiple,
  selectionMode,
  disabled,
  filter,
  defaultFilter = "",
  onFilterChange,
  showFilter,
  filterDelay = 300,
  filterMode = "lenient",
  emptyMessage = "No matches found.",
  onExpand,
  renderItem,
  dragAndDrop,
  onItemsMove,
  className,
  ...props
}: TreeViewProps) {
  const mode = selectionMode ?? (multiple ? "multiple" : "single")
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [open, setOpen] = useControllableState({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const [query, setQuery] = useControllableState({
    value: filter,
    defaultValue: defaultFilter,
    onChange: onFilterChange,
  })
  const [draft, setDraft] = React.useState(query)
  const [loading, setLoading] = React.useState<string[]>([])
  const [drag, setDrag] = React.useState<{
    id: string
    over?: string
    position?: TreeViewDropPosition
  } | null>(null)
  const root = React.useRef<HTMLDivElement>(null)
  const debounce = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const hover = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => setDraft(query), [query])
  React.useEffect(
    () => () => {
      if (debounce.current) clearTimeout(debounce.current)
      if (hover.current) clearTimeout(hover.current)
    },
    []
  )

  const visibleItems = React.useMemo(
    () => filterTreeViewItems(items, query, filterMode),
    [items, query, filterMode]
  )
  // Matches are revealed without touching the caller's expanded state.
  const revealed = React.useMemo(
    () => revealTreeViewMatches(visibleItems, query),
    [query, visibleItems]
  )

  const search = (next: string) => {
    setDraft(next)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => setQuery(next), filterDelay)
  }

  const select = (item: TreeViewItem) => {
    if (disabled || item.disabled || item.selectable === false) return
    if (mode === "checkbox") {
      setSelected(toggleTreeViewChecked(items, selected, item.id))
      return
    }
    setSelected(
      mode === "multiple"
        ? selected.includes(item.id)
          ? selected.filter((id) => id !== item.id)
          : [...selected, item.id]
        : [item.id]
    )
  }

  const expand = (item: TreeViewItem, next: boolean) => {
    setOpen(
      next ? [...open, item.id] : open.filter((entry) => entry !== item.id)
    )
    if (!next || !item.lazy || item.children?.length || !onExpand) return
    setLoading((current) => [...current, item.id])
    void Promise.resolve(onExpand(item)).finally(() => {
      setLoading((current) => current.filter((entry) => entry !== item.id))
    })
  }

  const toggle = (item: TreeViewItem, isExpanded: boolean) =>
    expand(item, !isExpanded)

  const drop = (target: TreeViewItem, position: TreeViewDropPosition) => {
    if (!drag) return
    const item = findTreeViewItem(items, drag.id)
    setDrag(null)
    if (hover.current) clearTimeout(hover.current)
    if (!item) return
    const next = moveTreeViewItem(items, drag.id, target.id, position)
    if (next === items) return
    onItemsMove?.({ item, target, position, items: next })
  }

  const dropPosition = (
    event: React.DragEvent<HTMLElement>,
    item: TreeViewItem
  ): TreeViewDropPosition | null => {
    if (!drag || drag.id === item.id) return null
    if (isTreeViewDescendant(items, drag.id, item.id)) return null
    const rect = event.currentTarget.getBoundingClientRect()
    // Without layout the row cannot be split into thirds, so aim for the middle.
    const ratio =
      rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5
    if (ratio < 0.25) return "before"
    if (ratio > 0.75) return "after"
    return item.droppable === false ? null : "inside"
  }

  const branch = (nodes: TreeViewItem[], level: number) =>
    nodes.map((item) => {
      const hasChildren = !!item.children?.length || item.lazy === true
      const isExpanded = open.includes(item.id) || revealed.has(item.id)
      const isSelected = selected.includes(item.id)
      const isLoading = loading.includes(item.id)
      const indeterminate =
        mode === "checkbox" &&
        !isSelected &&
        !!item.children?.length &&
        collectTreeViewIds(item.children).some((id) => selected.includes(id))
      const isDisabled = disabled === true || item.disabled === true
      const state: TreeViewItemState = {
        selected: isSelected,
        expanded: isExpanded,
        checked: mode === "checkbox" && isSelected,
        indeterminate,
        level,
        disabled: isDisabled,
      }
      const canDrag =
        dragAndDrop === true && !isDisabled && item.draggable !== false
      const over = drag?.over === item.id ? drag.position : undefined

      return (
        <div
          key={item.id}
          role="treeitem"
          aria-level={level}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={mode === "checkbox" ? undefined : isSelected}
          aria-checked={
            mode === "checkbox"
              ? indeterminate
                ? "mixed"
                : isSelected
              : undefined
          }
          aria-disabled={item.disabled}
          tabIndex={
            isSelected || (!selected.length && level === 1 && nodes[0] === item)
              ? 0
              : -1
          }
          data-id={item.id}
          className="outline-none"
          onKeyDown={(e) => {
            const rows = Array.from(
              root.current?.querySelectorAll<HTMLElement>("[role=treeitem]") ??
                []
            )
            const index = rows.indexOf(e.currentTarget)
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault()
              rows[index + (e.key === "ArrowDown" ? 1 : -1)]?.focus()
            } else if (e.key === "Home") {
              e.preventDefault()
              rows[0]?.focus()
            } else if (e.key === "End") {
              e.preventDefault()
              rows[rows.length - 1]?.focus()
            } else if (e.key === "ArrowRight" && hasChildren) {
              e.preventDefault()
              if (!isExpanded) expand(item, true)
              else rows[index + 1]?.focus()
            } else if (e.key === "ArrowLeft" && isExpanded) {
              e.preventDefault()
              expand(item, false)
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              select(item)
            } else if (e.key === "Escape" && drag) {
              setDrag(null)
            }
          }}
        >
          <div
            data-slot="tree-view-item"
            data-selected={isSelected || undefined}
            data-drop-position={over}
            data-dragging={drag?.id === item.id || undefined}
            draggable={canDrag || undefined}
            className={cn(
              "flex min-h-9 items-center rounded-xl px-2 text-sm hover:bg-accent aria-selected:bg-accent aria-selected:text-foreground data-dragging:opacity-50 data-selected:bg-accent data-selected:text-foreground",
              "data-[drop-position=after]:shadow-[inset_0_-2px_0_0_var(--color-primary)] data-[drop-position=before]:shadow-[inset_0_2px_0_0_var(--color-primary)] data-[drop-position=inside]:ring-2 data-[drop-position=inside]:ring-primary/60"
            )}
            style={{ paddingInlineStart: `${8 + (level - 1) * 16}px` }}
            onDragStart={(event) => {
              if (!canDrag) return
              event.dataTransfer.effectAllowed = "move"
              event.dataTransfer.setData("text/plain", item.id)
              setDrag({ id: item.id })
            }}
            onDragEnd={() => setDrag(null)}
            onDragOver={(event) => {
              if (!dragAndDrop || !drag) return
              const position = dropPosition(event, item)
              if (!position) return
              event.preventDefault()
              event.dataTransfer.dropEffect = "move"
              if (drag.over === item.id && drag.position === position) return
              setDrag({ ...drag, over: item.id, position })
              if (hover.current) clearTimeout(hover.current)
              if (position === "inside" && hasChildren && !isExpanded) {
                hover.current = setTimeout(() => expand(item, true), 700)
              }
            }}
            onDragLeave={() => {
              if (hover.current) clearTimeout(hover.current)
            }}
            onDrop={(event) => {
              if (!dragAndDrop || !drag) return
              const position = dropPosition(event, item)
              if (!position) return
              event.preventDefault()
              drop(item, position)
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                data-slot="tree-view-item-toggle"
                data-loading={isLoading || undefined}
                aria-label={isExpanded ? "Collapse" : "Expand"}
                onClick={() => toggle(item, isExpanded)}
                className="mr-1 size-6"
              >
                {isLoading ? (
                  <Spinner className="m-auto size-4" />
                ) : (
                  <ChevronRightIcon
                    className={cn(
                      "m-auto size-4 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                )}
              </button>
            ) : (
              <span className="mr-1 size-6" />
            )}
            <button
              type="button"
              data-slot="tree-view-item-trigger"
              disabled={isDisabled || item.selectable === false}
              onClick={() => select(item)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none disabled:cursor-default"
            >
              {mode === "checkbox" && (
                <span
                  data-slot="tree-view-item-checkbox"
                  data-state={
                    indeterminate
                      ? "indeterminate"
                      : isSelected
                        ? "checked"
                        : "unchecked"
                  }
                  aria-hidden="true"
                  className="grid size-4 shrink-0 place-content-center rounded-none border border-border bg-card text-primary-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary [&>svg]:size-3.5"
                >
                  {indeterminate ? (
                    <MinusIcon />
                  ) : isSelected ? (
                    <CheckIcon />
                  ) : null}
                </span>
              )}
              {item.icon}
              <span className="min-w-0 flex-1 truncate">
                {renderItem ? renderItem(item, state) : item.label}
              </span>
            </button>
          </div>
          {item.children?.length && isExpanded ? (
            <div role="group">{branch(item.children, level + 1)}</div>
          ) : null}
        </div>
      )
    })

  const tree = (
    <div
      ref={root}
      role="tree"
      aria-multiselectable={mode === "single" ? undefined : true}
      aria-disabled={disabled}
      data-slot="tree-view"
      data-selection-mode={mode}
      className={cn(
        "min-w-56 rounded-2xl border border-border bg-card p-1",
        className
      )}
      {...props}
    >
      {visibleItems.length ? (
        branch(visibleItems, 1)
      ) : (
        <p
          data-slot="tree-view-empty"
          className="px-3 py-2 text-sm text-muted-foreground"
        >
          {emptyMessage}
        </p>
      )}
    </div>
  )

  if (!showFilter) return tree

  return (
    <div data-slot="tree-view-container" className="flex flex-col gap-2">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          data-slot="tree-view-filter"
          aria-label="Filter tree"
          placeholder="Search"
          value={draft}
          disabled={disabled}
          onChange={(event) => search(event.target.value)}
        />
      </InputGroup>
      {tree}
    </div>
  )
}

export {
  collectTreeViewIds,
  filterTreeViewItems,
  findTreeViewItem,
  moveTreeViewItem,
  toggleTreeViewChecked,
  TreeView,
  type TreeViewDropPosition,
  type TreeViewFilterMode,
  type TreeViewItemState,
  type TreeViewMoveDetails,
  type TreeViewProps,
  type TreeViewSelectionMode,
}

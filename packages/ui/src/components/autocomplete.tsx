"use client"

import * as React from "react"
import {
  Autocomplete as AutocompletePrimitive,
  Combobox as ComboboxPrimitive,
} from "@base-ui/react"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"

import { cn } from "@carsxe/design-system/lib/utils"
import { useControllableState } from "../lib/use-controllable-state"
import { Button } from "@carsxe/design-system/components/button"
import { Spinner } from "@carsxe/design-system/components/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@carsxe/design-system/components/input-group"

type AutocompleteGroupedItems<T> = readonly {
  value: React.ReactNode
  items: readonly T[]
}[]

type AutocompleteItems<T> = readonly T[] | AutocompleteGroupedItems<T>

type AutocompleteFilter<T> =
  | null
  | ((item: T, query: string, itemToString?: (item: T) => string) => boolean)

type AutocompleteSharedProps<T> = {
  /**
   * Suggestions to render. Either a flat array or an array of
   * `{ value, items }` groups.
   */
  items?: AutocompleteItems<T>
  /** Debounce in milliseconds applied to `onQueryChange`. */
  delay?: number
  /**
   * Called with the debounced query. Providing it switches the component into
   * async mode: built-in filtering is disabled so `items` render verbatim.
   */
  onQueryChange?: (query: string) => void
  /** Characters required before the popup opens and queries fire. */
  minLength?: number
  /** Shows the status row and marks the list busy. */
  loading?: boolean
  /** Custom matcher, or `null` to disable built-in filtering. */
  filter?: AutocompleteFilter<T>
  /** Maximum number of items rendered. */
  limit?: number
  itemToStringValue?: (item: T) => string
  mode?: "list" | "both" | "inline" | "none"
  autoHighlight?: boolean | "always"
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called with the suggestion that was picked. */
  onSelect?: (item: T) => void
  onClear?: () => void
  openOnInputClick?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  id?: string
  children?: React.ReactNode
}

type AutocompleteSingleProps<T> = AutocompleteSharedProps<T> & {
  multiple?: false
  /** The input text. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Clears text that does not match a suggestion when the popup closes. */
  forceSelection?: boolean
}

type AutocompleteMultipleProps<T> = AutocompleteSharedProps<T> & {
  multiple: true
  /** The selected suggestions. */
  value?: T[]
  defaultValue?: T[]
  onValueChange?: (value: T[]) => void
  onUnselect?: (item: T) => void
}

type AutocompleteProps<T> =
  AutocompleteSingleProps<T> | AutocompleteMultipleProps<T>

type AutocompleteContextValue = {
  loading: boolean
  multiple: boolean
  invalid: boolean
  disabled: boolean
}

const AutocompleteContext = React.createContext<AutocompleteContextValue>({
  loading: false,
  multiple: false,
  invalid: false,
  disabled: false,
})

function useAutocompleteContext() {
  return React.useContext(AutocompleteContext)
}

function isGrouped<T>(
  items: AutocompleteItems<T>
): items is AutocompleteGroupedItems<T> {
  const first = items[0] as { items?: readonly unknown[] } | undefined
  return !!first && typeof first === "object" && Array.isArray(first.items)
}

function flattenItems<T>(items: AutocompleteItems<T> | undefined): T[] {
  if (!items || items.length === 0) return []
  if (isGrouped(items)) return items.flatMap((group) => [...group.items])
  return [...items]
}

function itemToText<T>(item: T, itemToStringValue?: (item: T) => string) {
  if (itemToStringValue) return itemToStringValue(item)
  if (item == null) return ""
  if (typeof item === "string") return item
  if (typeof item === "object") {
    const record = item as Record<string, unknown>
    if ("label" in record && record.label != null) return String(record.label)
    if ("value" in record && record.value != null) return String(record.value)
  }
  return String(item)
}

function Autocomplete<T>(props: AutocompleteProps<T>) {
  const {
    items,
    delay = 250,
    onQueryChange,
    minLength = 1,
    loading = false,
    filter,
    limit,
    itemToStringValue,
    mode,
    autoHighlight,
    open: openProp,
    defaultOpen,
    onOpenChange,
    onSelect,
    onClear,
    openOnInputClick,
    disabled = false,
    readOnly,
    required,
    invalid = false,
    name,
    id,
    children,
  } = props

  const multiple = props.multiple === true
  const single = multiple ? undefined : props
  const many = multiple ? props : undefined

  const [text, setText] = useControllableState<string>({
    value: single?.value,
    defaultValue: single?.defaultValue ?? "",
    onChange: single?.onValueChange,
  })
  const [selected, setSelected] = useControllableState<T[]>({
    value: many?.value,
    defaultValue: many?.defaultValue ?? [],
    onChange: many?.onValueChange,
  })
  const [multipleQuery, setMultipleQuery] = React.useState("")
  const [openState, setOpenState] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  })

  const query = multiple ? multipleQuery : text
  const flatItems = React.useMemo(() => flattenItems(items), [items])

  // The popup is normally gated behind `minLength`, but an explicit trigger or
  // input press (dropdown mode) should reveal every suggestion.
  const [bypassMinLength, setBypassMinLength] = React.useState(false)
  const meetsMinLength = query.trim().length >= minLength
  const open = openState && (bypassMinLength || meetsMinLength)

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const scheduleQuery = React.useCallback(
    (next: string) => {
      if (!onQueryChange) return
      if (timerRef.current) clearTimeout(timerRef.current)
      if (next.trim().length < minLength) return
      if (delay <= 0) {
        onQueryChange(next)
        return
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        onQueryChange(next)
      }, delay)
    },
    [delay, minLength, onQueryChange]
  )

  const findItemByText = React.useCallback(
    (value: string) =>
      flatItems.find((item) => itemToText(item, itemToStringValue) === value),
    [flatItems, itemToStringValue]
  )

  const handleSingleValueChange = React.useCallback(
    (next: string, details: AutocompletePrimitive.Root.ChangeEventDetails) => {
      setText(next)
      const reason = details.reason
      if (reason === "item-press") {
        const item = findItemByText(next)
        if (item !== undefined) onSelect?.(item)
        return
      }
      if (reason === "clear-press" || reason === "input-clear") {
        onClear?.()
      }
      scheduleQuery(next)
    },
    [findItemByText, onClear, onSelect, scheduleQuery, setText]
  )

  const handleMultipleInputChange = React.useCallback(
    (next: string, details: ComboboxPrimitive.Root.ChangeEventDetails) => {
      setMultipleQuery(next)
      const reason = details.reason
      if (reason === "clear-press" || reason === "input-clear") {
        onClear?.()
      }
      scheduleQuery(next)
    },
    [onClear, scheduleQuery]
  )

  const handleMultipleValueChange = React.useCallback(
    (next: T[]) => {
      const added = next.filter((item) => !selected.includes(item))
      const removed = selected.filter((item) => !next.includes(item))
      setSelected(next)
      added.forEach((item) => onSelect?.(item))
      removed.forEach((item) => many?.onUnselect?.(item))
    },
    [many, onSelect, selected, setSelected]
  )

  const handleOpenChange = React.useCallback(
    (next: boolean, details: AutocompletePrimitive.Root.ChangeEventDetails) => {
      const reason = details.reason
      if (next) {
        setBypassMinLength(
          reason === "trigger-press" || reason === "input-press"
        )
      } else {
        setBypassMinLength(false)
        if (!multiple && single?.forceSelection) {
          const current = text
          if (current !== "" && findItemByText(current) === undefined) {
            setText("")
          }
        }
      }
      setOpenState(next)
    },
    [
      findItemByText,
      multiple,
      setOpenState,
      setText,
      single?.forceSelection,
      text,
    ]
  )

  // Async consumers own filtering, so the built-in matcher is switched off
  // unless the caller passed an explicit `filter`.
  const resolvedFilter =
    filter !== undefined ? filter : onQueryChange ? null : undefined

  const context = React.useMemo(
    () => ({ loading, multiple, invalid, disabled }),
    [disabled, invalid, loading, multiple]
  )

  const shared = {
    items: items as never,
    filter: resolvedFilter as never,
    limit,
    open,
    onOpenChange: handleOpenChange as never,
    openOnInputClick,
    disabled,
    readOnly,
    required,
    name,
    id,
    children,
  }

  return (
    <AutocompleteContext.Provider value={context}>
      {multiple ? (
        <ComboboxPrimitive.Root
          multiple
          value={selected}
          onValueChange={handleMultipleValueChange}
          inputValue={multipleQuery}
          onInputValueChange={handleMultipleInputChange}
          itemToStringValue={itemToStringValue}
          autoHighlight={autoHighlight === "always" ? true : autoHighlight}
          {...shared}
        />
      ) : (
        <AutocompletePrimitive.Root
          value={text}
          onValueChange={handleSingleValueChange}
          itemToStringValue={itemToStringValue}
          mode={mode}
          autoHighlight={autoHighlight}
          {...shared}
        />
      )}
    </AutocompleteContext.Provider>
  )
}

function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props) {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  )
}

function AutocompleteTrigger({
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  const { multiple } = useAutocompleteContext()
  const Trigger = multiple
    ? ComboboxPrimitive.Trigger
    : (AutocompletePrimitive.Trigger as typeof ComboboxPrimitive.Trigger)
  return (
    <Trigger
      data-slot="autocomplete-trigger"
      // The default trigger is icon-only, so it needs a name of its own.
      aria-label={
        ariaLabel ?? (children == null ? "Show suggestions" : undefined)
      }
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </Trigger>
  )
}

function AutocompleteClear({
  className,
  ...props
}: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="autocomplete-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function AutocompleteInput({
  className,
  children,
  disabled,
  showTrigger = false,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  const context = useAutocompleteContext()
  const isDisabled = disabled ?? context.disabled
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        data-slot="autocomplete-input"
        aria-invalid={context.invalid || undefined}
        render={<InputGroupInput disabled={isDisabled} />}
        {...props}
      />
      {(showTrigger || showClear || context.loading) && (
        <InputGroupAddon align="inline-end">
          {context.loading && (
            <Spinner
              data-slot="autocomplete-loading"
              className="size-4 text-muted-foreground"
            />
          )}
          {showTrigger && !context.loading && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              render={<AutocompleteTrigger />}
              data-slot="input-group-button"
              className="group-has-data-[slot=autocomplete-clear]/input-group:hidden data-pressed:bg-transparent"
              disabled={isDisabled}
            />
          )}
          {showClear && <AutocompleteClear disabled={isDisabled} />}
        </InputGroupAddon>
      )}
      {children}
    </InputGroup>
  )
}

function AutocompleteContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="autocomplete-content"
          data-chips={!!anchor}
          className={cn(
            "group/autocomplete-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function AutocompleteList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  const { loading } = useAutocompleteContext()
  return (
    <ComboboxPrimitive.List
      data-slot="autocomplete-list"
      aria-busy={loading || undefined}
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  const { multiple } = useAutocompleteContext()
  const Item = multiple
    ? ComboboxPrimitive.Item
    : (AutocompletePrimitive.Item as typeof ComboboxPrimitive.Item)
  return (
    <Item
      data-slot="autocomplete-item"
      className={cn(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      {multiple && (
        <ComboboxPrimitive.ItemIndicator
          render={
            <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
          }
        >
          <CheckIcon className="pointer-events-none" />
        </ComboboxPrimitive.ItemIndicator>
      )}
    </Item>
  )
}

function AutocompleteGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="autocomplete-group"
      className={cn(className)}
      {...props}
    />
  )
}

function AutocompleteLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="autocomplete-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function AutocompleteCollection({
  ...props
}: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  )
}

function AutocompleteEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/autocomplete-content:flex",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteStatus({
  className,
  children,
  ...props
}: ComboboxPrimitive.Status.Props) {
  const { loading } = useAutocompleteContext()
  return (
    <ComboboxPrimitive.Status
      data-slot="autocomplete-status"
      data-loading={loading || undefined}
      className={cn(
        "flex items-center justify-center gap-2 py-2 text-center text-sm text-muted-foreground not-data-loading:hidden",
        className
      )}
      {...props}
    >
      {loading && (
        <>
          <Spinner className="size-4" />
          {children ?? "Loading…"}
        </>
      )}
    </ComboboxPrimitive.Status>
  )
}

function AutocompleteSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function AutocompleteChips({
  className,
  ...props
}: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="autocomplete-chips"
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding px-2.5 py-1 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=autocomplete-chip]:px-1 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="autocomplete-chip"
      className={cn(
        "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-2xl bg-input px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=autocomplete-chip-remove]:pr-0.5 dark:bg-input/60",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="-ml-0.5 size-4.5 opacity-50 hover:opacity-100 aria-disabled:pointer-events-none"
          data-slot="autocomplete-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function AutocompleteChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="autocomplete-chips-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  )
}

function useAutocompleteAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Autocomplete,
  AutocompleteChip,
  AutocompleteChips,
  AutocompleteChipsInput,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
  useAutocompleteAnchor,
  type AutocompleteFilter,
  type AutocompleteItems,
  type AutocompleteMultipleProps,
  type AutocompleteProps,
  type AutocompleteSingleProps,
}

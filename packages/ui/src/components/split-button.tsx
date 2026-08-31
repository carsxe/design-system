"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@carsxe/design-system/lib/utils"
import { Button } from "@carsxe/design-system/components/button"
import { ButtonGroup } from "@carsxe/design-system/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@carsxe/design-system/components/dropdown-menu"
import { Spinner } from "@carsxe/design-system/components/spinner"

type SplitButtonItem = {
  id?: string
  label?: React.ReactNode
  icon?: React.ReactNode
  onSelect?: () => void
  /** Renders the item as a link. */
  href?: string
  disabled?: boolean
  destructive?: boolean
  /** Renders a divider instead of an item; every other field is ignored. */
  separator?: boolean
  /** One level of submenu. */
  items?: SplitButtonItem[]
}

type SplitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "className"
> & {
  /** Applied to the group wrapping both buttons. */
  className?: string
  items: SplitButtonItem[]
  loading?: boolean
  /** Accessible name for the menu trigger. */
  menuLabel?: string
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>
}

const iconSizes = {
  default: "icon",
  lg: "icon-lg",
  sm: "icon-sm",
  xs: "icon-xs",
  icon: "icon",
  "icon-lg": "icon-lg",
  "icon-sm": "icon-sm",
  "icon-xs": "icon-xs",
} as const

function menuTriggerSize(size: SplitButtonProps["size"]) {
  return size ? iconSizes[size] : "icon"
}

function renderItems(items: SplitButtonItem[]) {
  return items.map((item, index) => {
    const key = item.id ?? index
    if (item.separator) return <DropdownMenuSeparator key={key} />
    if (item.items?.length) {
      return (
        <DropdownMenuSub key={key}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {item.icon}
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {renderItems(item.items)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )
    }
    return (
      <DropdownMenuItem
        key={key}
        disabled={item.disabled}
        variant={item.destructive ? "destructive" : "default"}
        onClick={item.onSelect}
        render={item.href ? <a href={item.href} /> : undefined}
      >
        {item.icon}
        {item.label}
      </DropdownMenuItem>
    )
  })
}

/**
 * A primary action joined to a menu of related ones. The primary button keeps
 * every `Button` prop; `items` describes the menu.
 */
function SplitButton({
  items,
  loading,
  menuLabel = "More options",
  contentProps,
  variant = "default",
  size = "default",
  disabled,
  children,
  className,
  ...props
}: SplitButtonProps) {
  const inert = disabled === true || loading === true
  return (
    <ButtonGroup data-slot="split-button" className={className}>
      <Button
        data-slot="split-button-action"
        variant={variant}
        size={size}
        disabled={inert}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              data-slot="split-button-menu"
              variant={variant}
              size={menuTriggerSize(size)}
              disabled={inert}
              aria-label={menuLabel}
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          {...contentProps}
          className={cn("min-w-40", contentProps?.className)}
        >
          {renderItems(items)}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export { SplitButton, type SplitButtonItem, type SplitButtonProps }

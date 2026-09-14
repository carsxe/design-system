import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@carsxe/design-system/lib/utils"
import { Separator } from "@carsxe/design-system/components/separator"

/**
 * The panel a navigation dropdown opens: zones of columns, each column a run of
 * labelled rows.
 *
 * Every row is polymorphic through `render`, because the element a nav link has
 * to be is the consumer's to decide — a framework `Link`, an analytics wrapper,
 * or a plain anchor. The panel paints its own surface, so a positioner carrying
 * it should not paint one too.
 */
function MegaMenu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mega-menu"
      className={cn(
        "flex max-h-[calc(100vh-8rem)] w-max items-stretch overflow-y-auto rounded-2xl bg-popover py-[18px] text-popover-foreground shadow-panel ring-1 ring-panel-ring",
        className
      )}
      {...props}
    />
  )
}

/** A vertical run of groups. Zones of columns are split by `MegaMenuSeparator`. */
function MegaMenuColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mega-menu-column"
      className={cn("flex flex-col gap-3.5 px-4", className)}
      {...props}
    />
  )
}

/** A labelled run of rows. Omit the label for a menu with one implicit group. */
function MegaMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mega-menu-group"
      className={cn("flex flex-col gap-px", className)}
      {...props}
    />
  )
}

/**
 * Zone heading. `--foreground-tertiary` rather than `--muted-foreground`: the
 * latter is a caption token and does not reach WCAG AA on `--popover`.
 */
function MegaMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mega-menu-group-label"
      className={cn(
        "px-2 pb-[5px] text-[11px] font-bold tracking-[0.08em] text-foreground-tertiary uppercase",
        className
      )}
      {...props}
    />
  )
}

/**
 * The hairline between zones. Vertical, unless a menu stacks its zones —
 * `Separator` sizes itself from `orientation`, so only the default differs.
 */
function MegaMenuSeparator({
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="mega-menu-separator"
      orientation={orientation}
      {...props}
    />
  )
}

type MegaMenuItemProps = useRender.ComponentProps<"a"> & {
  /**
   * The row's mark. Carry no size or colour on it — the chip sets both, and a
   * baked-in `size-6` or `text-*` on the svg would win over the chip's.
   */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}

/**
 * A menu row: icon chip, title, and a line of description.
 *
 * Descendant selectors size the icon so an svg that arrived with its own
 * dimensions still lands at 15px.
 */
function MegaMenuItem({
  className,
  icon,
  title,
  description,
  render,
  ...props
}: MegaMenuItemProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "flex items-start gap-2.5 rounded-xl px-2 py-[7px] transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
          className
        ),
        children: (
          <>
            {icon != null && (
              <span
                data-slot="mega-menu-item-icon"
                className="mt-px inline-flex size-[26px] flex-none items-center justify-center rounded-lg bg-accent text-accent-foreground [&_svg]:size-[15px]"
              >
                {icon}
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-px">
              <span
                data-slot="mega-menu-item-title"
                className="text-[13px] leading-[18px] font-semibold text-foreground"
              >
                {title}
              </span>
              {description != null && (
                <span
                  data-slot="mega-menu-item-description"
                  className="text-[11.5px] leading-4 text-foreground-tertiary"
                >
                  {description}
                </span>
              )}
            </span>
          </>
        ),
      },
      props
    ),
    render,
    state: { slot: "mega-menu-item" },
  })
}

/**
 * A plain text row, for a column of links that carry no icon or description.
 */
function MegaMenuLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "rounded-xl px-2 py-[5px] text-[13px] leading-[18px] font-medium text-foreground transition-colors outline-none hover:bg-muted hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "mega-menu-link" },
  })
}

/**
 * The "All products →" link that closes a column or a zone. The arrow is the
 * component's, so every one of them points the same way in every locale.
 *
 * Styled here rather than as `buttonVariants({ variant: "link" })`: that shares
 * only `text-primary underline-offset-4 hover:underline` with this row, and
 * would drag in the button base — `h-10 px-8`, `rounded-2xl`, a border, the
 * press translate — all of which a menu row then has to override.
 */
function MegaMenuMore({
  className,
  children,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "mt-0.5 inline-flex items-center gap-1 self-start rounded-xl px-2 py-0.5 text-[12.5px] font-medium text-primary underline-offset-4 transition-colors outline-none hover:text-primary-hover hover:underline focus-visible:ring-3 focus-visible:ring-ring/30",
          className
        ),
        children: (
          <>
            {children}{" "}
            <span aria-hidden="true" className="rtl:rotate-180">
              &rarr;
            </span>
          </>
        ),
      },
      props
    ),
    render,
    state: { slot: "mega-menu-more" },
  })
}

/**
 * Fills columns top-to-bottom, left-to-right, so reading order matches the DOM
 * order a screen reader and the keyboard tab sequence follow.
 */
function splitIntoColumns<T>(items: readonly T[], columnCount: number): T[][] {
  const perColumn = Math.ceil(items.length / columnCount)
  return Array.from({ length: columnCount }, (_, i) =>
    items.slice(i * perColumn, (i + 1) * perColumn)
  ).filter((column) => column.length > 0)
}

export {
  MegaMenu,
  MegaMenuColumn,
  MegaMenuGroup,
  MegaMenuGroupLabel,
  MegaMenuItem,
  type MegaMenuItemProps,
  MegaMenuLink,
  MegaMenuMore,
  MegaMenuSeparator,
  splitIntoColumns,
}

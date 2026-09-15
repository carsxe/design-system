"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { LayoutGroup, motion, useReducedMotion } from "motion/react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@carsxe/design-system/lib/utils"
import { Separator } from "@carsxe/design-system/components/separator"
import {
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@carsxe/design-system/components/navigation-menu"

const hoverSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.55,
}

const panelSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.7,
}

const columnReveal = {
  ...panelSpring,
  stiffness: 380,
  damping: 28,
}

type MegaMenuMotionValue = {
  indicatorId: string
  visibleKey: string | null
  setHoveredKey: React.Dispatch<React.SetStateAction<string | null>>
  setOpenKey: React.Dispatch<React.SetStateAction<string | null>>
}

const MegaMenuMotionContext = React.createContext<MegaMenuMotionValue | null>(
  null
)

function useMegaMenuHover() {
  const reduced = Boolean(useReducedMotion())
  const [highlight, setHighlight] = React.useState(false)
  return {
    reduced,
    highlight,
    motionState: reduced ? "rest" : highlight ? "hover" : "rest",
    transition: reduced ? { duration: 0 } : hoverSpring,
    hoverProps: {
      onPointerEnter: () => setHighlight(true),
      onPointerLeave: () => setHighlight(false),
      onFocus: () => setHighlight(true),
      onBlur: () => setHighlight(false),
    },
  }
}

function MegaMenuHoverFill({
  active,
  reduced,
  className,
}: {
  active: boolean
  reduced: boolean
  className?: string
}) {
  if (reduced) return null
  return (
    <motion.span
      aria-hidden="true"
      data-slot="mega-menu-hover-fill"
      className={cn("absolute inset-0 -z-10 rounded-xl bg-muted", className)}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    />
  )
}

/**
 * Scopes the sliding trigger indicator. Wrap the same `NavigationMenuList`
 * that holds `MegaMenuTrigger`s so the pill can travel between them.
 */
function MegaMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuList>) {
  const id = React.useId()
  const [hoveredKey, setHoveredKey] = React.useState<string | null>(null)
  const [openKey, setOpenKey] = React.useState<string | null>(null)
  const value = React.useMemo(
    () => ({
      indicatorId: `${id}-indicator`,
      visibleKey: hoveredKey ?? openKey,
      setHoveredKey,
      setOpenKey,
    }),
    [id, hoveredKey, openKey]
  )
  return (
    <MegaMenuMotionContext.Provider value={value}>
      <LayoutGroup id={id}>
        <NavigationMenuList className={cn("relative", className)} {...props} />
      </LayoutGroup>
    </MegaMenuMotionContext.Provider>
  )
}

/**
 * The panel a navigation dropdown opens: zones of columns, each column a run of
 * labelled rows.
 *
 * Every row is polymorphic through `render`, because the element a nav link has
 * to be is the consumer's to decide — a framework `Link`, an analytics wrapper,
 * or a plain anchor. Standalone, the panel paints its own surface. Inside
 * NavigationMenu the positioner already paints one, so this shell goes
 * transparent and the inner spacing is what you see.
 *
 * Opening springs the panel up and staggers its columns; NavigationMenu keeps a
 * single shared viewport that morphs size as the active trigger changes.
 */
function MegaMenu({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const reduced = Boolean(useReducedMotion())
  return (
    <motion.div
      data-slot="mega-menu"
      className={cn(
        "flex max-h-[calc(100vh-8rem)] w-max items-stretch overflow-y-auto rounded-2xl bg-popover py-6 text-popover-foreground shadow-panel ring-1 ring-panel-ring in-data-[slot=navigation-menu-content]:rounded-none in-data-[slot=navigation-menu-content]:bg-transparent in-data-[slot=navigation-menu-content]:shadow-none in-data-[slot=navigation-menu-content]:ring-0",
        className
      )}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.18 }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {React.Children.map(children, (child, index) => {
        if (child == null || child === false) return child
        return (
          <motion.div
            key={React.isValidElement(child) ? (child.key ?? index) : index}
            className="flex items-stretch"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { ...columnReveal, delay: 0.1 + index * 0.16 }
            }
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/** A vertical run of groups. Zones of columns are split by `MegaMenuSeparator`. */
function MegaMenuColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mega-menu-column"
      className={cn("flex flex-col gap-5 px-5", className)}
      {...props}
    />
  )
}

/** A labelled run of rows. Omit the label for a menu with one implicit group. */
function MegaMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mega-menu-group"
      className={cn("flex flex-col gap-1", className)}
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
        "px-3 pb-2.5 text-[11px] font-bold tracking-[0.08em] text-foreground-tertiary uppercase",
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

function MegaMenuTriggerSurface({
  renderProps,
  open,
  reduced,
  indicatorId,
  triggerKey,
  motionCtx,
  localActive,
}: {
  renderProps: React.ComponentProps<"button">
  open: boolean
  reduced: boolean
  indicatorId: string
  triggerKey: string
  motionCtx: MegaMenuMotionValue | null
  localActive: boolean
}) {
  const { children: triggerChildren, ...rest } = renderProps
  const setOpenKey = motionCtx?.setOpenKey

  React.useEffect(() => {
    if (!setOpenKey) return
    if (open) setOpenKey(triggerKey)
    else setOpenKey((current) => (current === triggerKey ? null : current))
    return () =>
      setOpenKey((current) => (current === triggerKey ? null : current))
  }, [open, setOpenKey, triggerKey])

  const showIndicator =
    !reduced && (motionCtx ? motionCtx.visibleKey === triggerKey : localActive)

  return (
    <button type="button" {...rest}>
      {showIndicator ? (
        <motion.span
          layoutId={indicatorId}
          data-slot="mega-menu-indicator"
          className="absolute inset-0 -z-10 bg-muted"
          style={{ borderRadius: 16 }}
          transition={panelSpring}
        />
      ) : null}
      {triggerChildren}
    </button>
  )
}

/**
 * Opens a MegaMenu panel. Same Base UI trigger as `NavigationMenuTrigger`, so
 * it belongs in a `NavigationMenuItem` next to `NavigationMenuContent` that
 * wraps the panel — that is what actually opens the popup.
 *
 * When several of these sit in a `MegaMenuList`, a shared `layoutId` pill
 * springs between the hovered or open trigger.
 */
function MegaMenuTrigger({
  className,
  children,
  render,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  const reduced = Boolean(useReducedMotion())
  const motionCtx = React.useContext(MegaMenuMotionContext)
  const triggerKey = React.useId()
  const indicatorId = motionCtx?.indicatorId ?? "mega-menu-indicator"
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)

  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="mega-menu-trigger"
      className={cn(
        navigationMenuTriggerStyle(),
        "group/mega-menu-trigger relative isolate h-10 gap-1 bg-transparent px-3 font-semibold hover:bg-transparent focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent",
        className
      )}
      onPointerEnter={(event) => {
        setHovered(true)
        motionCtx?.setHoveredKey(triggerKey)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        motionCtx?.setHoveredKey((current) =>
          current === triggerKey ? null : current
        )
        onPointerLeave?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        motionCtx?.setHoveredKey(triggerKey)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        motionCtx?.setHoveredKey((current) =>
          current === triggerKey ? null : current
        )
        onBlur?.(event)
      }}
      render={
        render ??
        ((renderProps, state) => (
          <MegaMenuTriggerSurface
            renderProps={renderProps as React.ComponentProps<"button">}
            open={state.open}
            reduced={reduced}
            indicatorId={indicatorId}
            triggerKey={triggerKey}
            motionCtx={motionCtx}
            localActive={hovered || focused || state.open}
          />
        ))
      }
      {...props}
    >
      <motion.span
        className="relative inline-flex items-center"
        whileHover={reduced ? undefined : { y: -1 }}
        transition={reduced ? { duration: 0 } : hoverSpring}
      >
        {children}
      </motion.span>{" "}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3.5 transition duration-300 group-data-popup-open/mega-menu-trigger:rotate-180 group-data-open/mega-menu-trigger:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
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
 * dimensions still lands at 16px. Hover uses motion for the chip and a soft
 * fill; `prefers-reduced-motion` keeps a colour-only CSS fallback.
 */
function MegaMenuItem({
  className,
  icon,
  title,
  description,
  render,
  ...props
}: MegaMenuItemProps) {
  const { reduced, highlight, motionState, transition, hoverProps } =
    useMegaMenuHover()
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "group/mega-menu-item relative isolate flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
          reduced && "transition-colors hover:bg-muted",
          className
        ),
        ...hoverProps,
        children: (
          <>
            <MegaMenuHoverFill active={highlight} reduced={reduced} />
            {icon != null && (
              <motion.span
                data-slot="mega-menu-item-icon"
                className="mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-lg bg-accent text-accent-foreground [&_svg]:size-4"
                initial={false}
                variants={{
                  rest: { scale: 1, y: 0 },
                  hover: { scale: 1.06, y: -1 },
                }}
                animate={motionState}
                transition={transition}
              >
                {icon}
              </motion.span>
            )}
            <span className="flex min-w-0 flex-col gap-0.5">
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
  children,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  const { reduced, highlight, hoverProps } = useMegaMenuHover()
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "group/mega-menu-link relative isolate block rounded-xl px-3 py-2 text-[13px] leading-[18px] font-medium text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
          reduced && "transition-colors hover:bg-muted hover:text-primary",
          !reduced && "hover:text-primary",
          className
        ),
        ...hoverProps,
        children: (
          <>
            <MegaMenuHoverFill active={highlight} reduced={reduced} />
            {children}
          </>
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
  const { reduced, motionState, transition, hoverProps } = useMegaMenuHover()
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "mt-1 inline-flex items-center gap-1.5 self-start rounded-xl px-3 py-1 text-[12.5px] font-medium text-primary underline-offset-4 outline-none hover:text-primary-hover hover:underline focus-visible:ring-3 focus-visible:ring-ring/30",
          className
        ),
        ...hoverProps,
        children: (
          <>
            {children}{" "}
            <motion.span
              aria-hidden="true"
              className="inline-block rtl:rotate-180"
              initial={false}
              variants={{
                rest: { x: 0 },
                hover: { x: 4 },
              }}
              animate={reduced ? "rest" : motionState}
              transition={transition}
            >
              &rarr;
            </motion.span>
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
  MegaMenuList,
  MegaMenuMore,
  MegaMenuSeparator,
  MegaMenuTrigger,
  splitIntoColumns,
}

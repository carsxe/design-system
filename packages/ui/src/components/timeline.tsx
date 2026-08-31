import * as React from "react"

import { cn } from "@carsxe/design-system/lib/utils"

type TimelineOrientation = "vertical" | "horizontal"
type TimelineAlign = "start" | "end" | "alternate"

type TimelineRenderer<T> = (item: T, index: number) => React.ReactNode

// `content` is also an HTML attribute, so it has to be dropped before ours.
type TimelineProps<T> = Omit<
  React.ComponentProps<"ol">,
  "children" | "content"
> & {
  items: readonly T[]
  orientation?: TimelineOrientation
  /**
   * Which side the content sits on. `alternate` swaps sides per event, so the
   * rail runs down (or across) the middle.
   */
  align?: TimelineAlign
  /** The event body. Defaults to the item itself when it is renderable. */
  content?: TimelineRenderer<T>
  /** Rendered on the far side of the rail, e.g. a date. */
  opposite?: TimelineRenderer<T>
  /** Replaces the default dot. */
  marker?: TimelineRenderer<T>
  /** Replaces the default line between events. */
  connector?: TimelineRenderer<T>
  getKey?: (item: T, index: number) => React.Key
}

function defaultKey<T>(item: T, index: number): React.Key {
  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>
    const id = record.id ?? record.key
    if (typeof id === "string" || typeof id === "number") return id
  }
  return index
}

/**
 * Objects need a `content` template; strings, numbers, and elements can be
 * rendered as they are.
 */
function renderableItem(item: unknown): React.ReactNode {
  if (typeof item === "string" || typeof item === "number") return item
  return React.isValidElement(item) ? item : null
}

function Timeline<T>({
  items,
  orientation = "vertical",
  align = "start",
  content,
  opposite,
  marker,
  connector,
  getKey = defaultKey,
  className,
  ...props
}: TimelineProps<T>) {
  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      data-align={align}
      className={cn(
        "flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const side =
          align === "alternate" ? (index % 2 === 0 ? "start" : "end") : align
        const isLast = index === items.length - 1
        const showOpposite = opposite !== undefined || align === "alternate"
        return (
          <li
            key={getKey(item, index)}
            data-slot="timeline-event"
            data-align={side}
            className={cn(
              "flex gap-4",
              orientation === "vertical"
                ? "flex-row data-[align=end]:flex-row-reverse"
                : "flex-col data-[align=end]:flex-col-reverse"
            )}
          >
            {showOpposite && (
              <div
                data-slot="timeline-opposite"
                className={cn(
                  "flex-1 text-sm text-muted-foreground",
                  orientation === "vertical"
                    ? "pt-0.5 text-right data-[align=end]:text-left"
                    : "text-center"
                )}
                data-align={side}
              >
                {opposite?.(item, index)}
              </div>
            )}
            <div
              data-slot="timeline-separator"
              className={cn(
                "flex items-center",
                orientation === "vertical" ? "flex-col" : "w-full flex-row"
              )}
            >
              {marker ? (
                marker(item, index)
              ) : (
                <span
                  data-slot="timeline-marker"
                  className="size-3 shrink-0 rounded-full bg-primary ring-4 ring-primary/15"
                />
              )}
              {!isLast &&
                (connector ? (
                  connector(item, index)
                ) : (
                  <span
                    data-slot="timeline-connector"
                    className={cn(
                      "bg-border",
                      orientation === "vertical"
                        ? "my-1 w-px flex-1"
                        : "mx-1 h-px flex-1"
                    )}
                  />
                ))}
            </div>
            <div
              data-slot="timeline-content"
              data-align={side}
              className={cn(
                "flex-1 text-sm",
                orientation === "vertical"
                  ? "pb-6 data-[align=end]:text-right"
                  : "pe-6 pt-2 text-center"
              )}
            >
              {content ? content(item, index) : renderableItem(item)}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export {
  Timeline,
  type TimelineAlign,
  type TimelineOrientation,
  type TimelineProps,
}

"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { format, isValid, parseISO } from "date-fns"
import { enUS } from "date-fns/locale"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@carsxe/design-system/components/avatar"
import { Button } from "@carsxe/design-system/components/button"
import { Clipboard } from "@carsxe/design-system/components/clipboard"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@carsxe/design-system/components/tooltip"

import { cn } from "@carsxe/design-system/lib/utils"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted:
          "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BubbleAction = {
  icon: React.ReactNode
  onPress: React.MouseEventHandler<HTMLButtonElement>
  name: string
  tooltipLabel?: string
}

export type BubbleProps = React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
    copyText?: string
    timestamp?: Date | string | number
    actions?: BubbleAction[]
    avatar?: { src?: string; name: string; fallback?: React.ReactNode }
    onCopyError?: (error: unknown) => void
  }

function Bubble({
  variant = "default",
  align = "start",
  className,
  children,
  copyText,
  timestamp,
  actions,
  avatar,
  onCopyError,
  ...props
}: BubbleProps) {
  const [copyError, setCopyError] = React.useState(0)
  const date =
    timestamp === undefined
      ? undefined
      : typeof timestamp === "string"
        ? parseISO(timestamp)
        : new Date(timestamp)
  const validDate = date && isValid(date) ? date : undefined
  const hasControls = copyText !== undefined || Boolean(actions?.length)
  const enhanced =
    avatar !== undefined || timestamp !== undefined || hasControls
  const content = enhanced ? (
    <>
      {avatar && (
        <Avatar className="mt-1" role="img" aria-label={avatar.name}>
          {avatar.src && <AvatarImage src={avatar.src} alt="" />}
          <AvatarFallback>
            {avatar.fallback ??
              avatar.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        data-slot="bubble-body"
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <div
          data-slot="bubble-surface"
          className={cn(
            bubbleVariants({ variant }),
            "max-w-full group-data-[align=end]/bubble:self-end has-[[data-slot=bubble-reactions][data-side=bottom]]:mb-3"
          )}
        >
          {children}
        </div>
        {(validDate || hasControls) && (
          <div
            data-slot="bubble-footer"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground group-data-[align=end]/bubble:justify-end group-data-[align=end]/message:justify-end"
          >
            {validDate && (
              <time dateTime={validDate.toISOString()}>
                {format(validDate, "MMMM d, h:mm a", { locale: enUS })}
              </time>
            )}
            {hasControls && (
              <div
                data-slot="bubble-controls"
                className="flex flex-wrap items-center gap-1 opacity-0 transition-opacity group-focus-within/bubble:opacity-100 group-hover/bubble:opacity-100 [@media(hover:none)]:opacity-100 [@media(pointer:coarse)]:opacity-100"
              >
                {copyText !== undefined && (
                  <Clipboard
                    value={copyText}
                    className="h-8 rounded-lg border-transparent bg-transparent px-2 text-xs"
                    onCopy={() => setCopyError(0)}
                    onCopyError={(error) => {
                      setCopyError((count) => count + 1)
                      onCopyError?.(error)
                    }}
                  />
                )}
                <TooltipProvider>
                  {actions?.map((action, index) => {
                    const button = (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={action.name}
                        onClick={action.onPress}
                      >
                        <span aria-hidden="true">{action.icon}</span>
                      </Button>
                    )
                    return action.tooltipLabel !== undefined ? (
                      <Tooltip key={index}>
                        <TooltipTrigger render={button} />
                        <TooltipContent role="tooltip">
                          {action.tooltipLabel}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <React.Fragment key={index}>{button}</React.Fragment>
                    )
                  })}
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
        {copyText !== undefined && (
          <span role="status" className="sr-only">
            {copyError > 0 && (
              <span key={copyError}>Could not copy message</span>
            )}
          </span>
        )}
      </div>
    </>
  ) : (
    children
  )
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        bubbleVariants({ variant }),
        enhanced &&
          "flex-row gap-2 group-data-[align=end]/message:flex-row-reverse data-[align=end]:flex-row-reverse",
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-3 py-2.5 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/30",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }

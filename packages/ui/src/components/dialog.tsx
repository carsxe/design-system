"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@carsxe/design-system/lib/utils"
import { Button } from "@carsxe/design-system/components/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function dialogTokens(className: unknown) {
  return typeof className === "string"
    ? className.trim().split(/\s+/).filter(Boolean)
    : []
}

function bareUtility(token: string) {
  const parts = token.split(":")
  return (parts[parts.length - 1] ?? token).replace(/^!/, "")
}

function hasUtility(tokens: string[], name: string) {
  return tokens.some((token) => bareUtility(token) === name)
}

/** p-0, px-4, pt-6, sm:p-8, p-0! — any padding utility the caller already set. */
function hasOwnPadding(tokens: string[]) {
  return tokens.some((token) =>
    /^(?:p|px|py|pt|pr|pb|pl|ps|pe)-/.test(bareUtility(token))
  )
}

function fillsViewport(tokens: string[]) {
  return tokens.some((token) => {
    const bare = bareUtility(token)
    return (
      bare === "h-dvh" ||
      bare === "h-screen" ||
      bare === "h-full" ||
      bare === "inset-0" ||
      bare.startsWith("h-[100")
    )
  })
}

function isElementOf<T extends React.ElementType>(
  child: React.ReactNode,
  type: T
): child is React.ReactElement {
  return React.isValidElement(child) && child.type === type
}

/**
 * Opens fragments so a header wrapped in <>...</> still pins.
 * Leaves every other slot alone: nested arrays stay nested, and null or
 * boolean holes stay put. React.Children.toArray and forEach flatten those
 * slots and re-index what follows, so a warning line that appears while
 * typing remounts the inputs after it.
 */
function dialogSlots(children: React.ReactNode): React.ReactNode[] {
  const source = Array.isArray(children) ? children : [children]
  const slots: React.ReactNode[] = []
  for (const child of source) {
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      slots.push(...dialogSlots(child.props.children))
      continue
    }
    slots.push(child)
  }
  return slots
}

function isPresentChild(child: React.ReactNode) {
  return child != null && typeof child !== "boolean"
}

/**
 * DialogContent is a flex column capped at 90vh (`overflow-hidden`).
 * Direct `DialogHeader` and `DialogFooter` children stay pinned (`flex-none`).
 * Everything else is wrapped as one group in `DialogBody` (`flex-1 min-h-0
 * overflow-y-auto overflow-x-hidden`), created automatically when callers
 * omit it. The group keeps the caller's element identity and keys.
 * `overflow-hidden` skips that split and keeps the default padding.
 * A viewport height or `p-0` also skips the split. `p-0` (or any padding
 * utility) replaces the default `p-6`.
 */
function partitionDialogChildren(children: React.ReactNode) {
  const header: React.ReactNode[] = []
  const footer: React.ReactNode[] = []
  const body: React.ReactNode[] = []

  for (const child of dialogSlots(children)) {
    if (isElementOf(child, DialogHeader)) header.push(child)
    else if (isElementOf(child, DialogFooter)) footer.push(child)
    else body.push(child)
  }

  return { header, footer, body }
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  const tokens = dialogTokens(className)
  const viewport = fillsViewport(tokens)
  // overflow-hidden only skips the automatic body. Padding stays unless the
  // caller set its own. p-0 and viewport-filling dialogs also skip the body
  // so a flush dialog or fullscreen viewer is not wrapped in a second scrollport.
  const skipWrap =
    hasUtility(tokens, "overflow-hidden") ||
    viewport ||
    hasUtility(tokens, "p-0")
  const { header, footer, body } = skipWrap
    ? { header: [], footer: [], body: [] }
    : partitionDialogChildren(children)
  const gap0 = hasUtility(tokens, "gap-0")
  // Ignore null and boolean holes so a conditional sibling does not change
  // whether the caller already owns the scrollport.
  const renderedBody = body.filter(isPresentChild)
  const explicitBody =
    renderedBody.length > 0 &&
    renderedBody.every((child) => isElementOf(child, DialogBody))

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] min-w-0 -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none sm:max-w-md dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          viewport ? undefined : "max-h-[90vh]",
          // Default padding stays inside the max width. A caller padding utility
          // replaces it; overflow-hidden does not.
          hasOwnPadding(tokens) ? undefined : "p-6",
          className,
          // After className so a caller overflow-y-auto cannot turn the shell into the scrollport.
          "overflow-hidden"
        )}
        {...props}
      >
        {skipWrap ? (
          children
        ) : (
          <>
            {header}
            {explicitBody ? (
              body
            ) : renderedBody.length > 0 ? (
              <DialogBody className={gap0 ? "gap-0" : undefined}>
                {body}
              </DialogBody>
            ) : null}
            {footer}
          </>
        )}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4 bg-secondary"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-none flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "flex min-h-0 w-full max-w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-none flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

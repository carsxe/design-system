---
name: carsxe-design-system
description: Use @carsxe/design-system as the Carsxe UI kit. Covers shadcn components (Button and others), CSS tokens, install, and theming. Do not run shadcn add in consumer apps. Widget/edit-mode belongs in @carsxe/ui.
---

# Carsxe Design System

Use this skill whenever you build UI with `@carsxe/design-system` — buttons, inputs, dialogs, tokens, or any shadcn primitive in a Carsxe app.

The package name is `@carsxe/design-system`. `@carsxe/ui` is a separate widget package. Do not confuse them.

Ark-inspired advanced controls such as Tour, Tree View, Image Cropper, Color
Picker, and Signature Pad are native Carsxe components. Import them from this
package; do not add Ark UI or Zag to a consumer.

## Install

```bash
bun add @carsxe/design-system
```

```bash
npm install @carsxe/design-system
```

```bash
pnpm add @carsxe/design-system
```

Peer dependencies: `react` and `react-dom`.

## Import components

Prefer the per-component path:

```tsx
import { Button } from "@carsxe/design-system/components/button"
```

The package root also works:

```tsx
import { Button } from "@carsxe/design-system"
```

## Load CSS

If the app already uses Tailwind v4:

```ts
import "@carsxe/design-system/globals.css"
```

Otherwise use the prebuilt stylesheet:

```ts
import "@carsxe/design-system/styles.css"
```

Both of those put the palette on `:root`. If the app has its own palette and
only part of the page should be ours — a header inside an app themed some other
way — take the tokens on their own and scope them instead:

```ts
import "@carsxe/design-system/tokens.css"
```

```tsx
<div className="cx-theme">{/* design system components */}</div>
```

Custom properties inherit, so everything inside that class gets our palette and
the rest of the page keeps its own. `tokens.css` carries no utilities, so the
host maps the variables in its own config — plain hex, no `hsl()`:

```js
colors: { popover: "var(--popover)", accent: "var(--accent)" }
```

Non-colour tokens — shadows, radii — map straight across too:

```js
boxShadow: {
  panel: "var(--panel-shadow)"
}
```

## Do not

- Do not run `shadcn add` in the consumer app. Components ship from this package.
- Do not copy component source into the app.
- Do not create wrapper components around design-system primitives.
- Do not add widget or edit-mode behavior to these primitives. That belongs in the consumer (`@carsxe/ui`).

## Customize

Use `variant`, `size`, `className`, and native element props (`value`, `onChange`, `disabled`, and so on). Tokens live on `:root` and `.dark`. `--radius` is `0` (sharp corners). Toggle dark mode by adding the `dark` class on a parent, usually `<html>`.

See `reference.md` in this folder for the component list, import paths, and token names.

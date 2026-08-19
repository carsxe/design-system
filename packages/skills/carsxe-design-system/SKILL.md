---
name: carsxe-design-system
description: Use @carsxe/design-system as the Carsxe UI kit. Covers shadcn components (Button and others), CSS tokens, install, and theming. Do not run shadcn add in consumer apps. Widget/edit-mode belongs in @carsxe/ui.
---

# Carsxe Design System

Use this skill whenever you build UI with `@carsxe/design-system` — buttons, inputs, dialogs, tokens, or any shadcn primitive in a Carsxe app.

The package name is `@carsxe/design-system`. `@carsxe/ui` is a separate widget package. Do not confuse them.

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

## Do not

- Do not run `shadcn add` in the consumer app. Components ship from this package.
- Do not copy component source into the app.
- Do not create wrapper components around design-system primitives.
- Do not add widget or edit-mode behavior to these primitives. That belongs in the consumer (`@carsxe/ui`).

## Customize

Use `variant`, `size`, `className`, and native element props (`value`, `onChange`, `disabled`, and so on). Tokens live on `:root` and `.dark`. `--radius` is `0` (sharp corners). Toggle dark mode by adding the `dark` class on a parent, usually `<html>`.

See `reference.md` in this folder for the component list, import paths, and token names.

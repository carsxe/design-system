# Carsxe Design System

Publishable shadcn/ui package (`@carsxe/design-system`) themed to the [Carsxe Rebrand Figma file](https://www.figma.com/design/fT1rCw7OXQishsxdcpGrMd/Carsxe-Rebrand?node-id=1-4). Components are installed from the shadcn `base-rhea` registry and restyled through CSS variables.

## Packages

- `packages/ui` — `@carsxe/design-system` component library
- `apps/storybook` — Storybook 10 for every component
- `apps/web` — TanStack Start playground

## Using the package

```tsx
import { Button } from "@carsxe/design-system/components/button"
```

Load the theme:

```css
@import "@carsxe/design-system/globals.css";
```

Consumers who do not compile Tailwind can import the prebuilt stylesheet instead:

```ts
import "@carsxe/design-system/styles.css"
```

## Adding components

```bash
bunx shadcn@latest add dialog -c packages/ui
```

## Scripts

```bash
bun install
bun run dev          # web + storybook
bun run build        # ui dist + apps
bun run typecheck
```

Storybook runs at `http://localhost:6006`.

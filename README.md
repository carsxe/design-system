# Carsxe Design System

Publishable shadcn/ui package (`@carsxe/design-system`) themed to the [Carsxe Rebrand Figma file](https://www.figma.com/design/fT1rCw7OXQishsxdcpGrMd/Carsxe-Rebrand?node-id=1-4). Components are installed from the shadcn `base-rhea` registry and restyled through CSS variables.

## Packages

- `packages/ui` — `@carsxe/design-system` component library
- `packages/skills` — copy-pastable agent skills (see `AGENTS.md`)
- `apps/storybook` — Storybook 10 for every component
- `apps/web` — docs site (TanStack Start)

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

Both put the palette on `:root`. An app with its own palette that only hosts a
few of our components can take the tokens alone, scoped to a class, so the rest
of the page is untouched:

```ts
import "@carsxe/design-system/tokens.css"
```

```tsx
<div className="cx-theme">{/* design system components */}</div>
```

A Tailwind v3 host whose config wraps tokens in `hsl()` wants the triplet build
instead — same values, shaped for `hsl(var(--token))`:

```ts
import "@carsxe/design-system/tokens-hsl.css"
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

Locally, Storybook runs at `http://localhost:6006` and the docs at `http://localhost:3000`.

Production:

- Docs — <https://ui.carsxe.com>
- Storybook — <https://storybook.carsxe.com>
- Package — <https://www.npmjs.com/package/@carsxe/design-system>

## Deploy (Cloudflare)

Both apps deploy with Wrangler. Log in once:

```bash
bunx wrangler login
```

Then:

```bash
bun run deploy:web        # docs → carsxe-design-system.workers.dev
bun run deploy:storybook  # storybook → carsxe-design-system-storybook.workers.dev
bun run deploy            # both
```

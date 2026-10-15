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

## Release to npm

GitHub Actions typechecks, tests, builds, and verifies the packed design system
on pull requests and pushes to `main`. Publishing a GitHub release runs the same
checks, then publishes `@carsxe/design-system` to npm with the release tag's version.

### One-time setup

In the npm package's **Settings → Trusted publishing**, add a GitHub Actions
publisher with these values:

- Organization: `carsxe`
- Repository: `design-system`
- Workflow filename: `release.yml`
- Environment: leave blank
- Allowed actions: enable direct publishing with `npm publish`

This uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
with OIDC; no `NPM_TOKEN` secret is required. Commit and push the workflow before
creating the first release.

### Publish a version

1. Open GitHub's **Releases → Draft a new release**.
2. Create a new tag such as `v0.3.8` targeting the commit you want to release
   (normally the latest `main`).
3. Add release notes and click **Publish release**.

The tag is the source of truth: CI sets the package version for the published
artifact, so you do not need to bump `package.json` or the lockfile beforehand.
It does not commit the version change back to the repository. Tags without `v`
(such as `0.3.8`) also work. A tag push alone or a draft release does not publish.

For a prerelease, use a tag such as `v0.4.0-beta.1` and check **Set as a
pre-release**. Prereleases publish under npm's `next` tag; stable releases use
`latest`. The checkbox must match the tag. Build metadata (`+...`) is not accepted.
Use a new version for every release; npm cannot overwrite an existing version.
If a run fails before publishing, fix the cause and rerun the failed jobs in
GitHub Actions.

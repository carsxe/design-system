---
name: carsxe-migrate-loop
description: >-
  Loop until a consumer app is fully migrated onto @carsxe/design-system. Grep leftover
  shadcn/local UI, migrate one slice, browser screenshot/video QA, repeat until complete.
  Use when the user wants to migrate an app to the Carsxe design system, run a migrate
  loop, or fully replace local ui/ components with @carsxe/design-system.
---

# Carsxe migrate loop

Same-session greploop: inventory leftover UI → migrate one slice → browser QA → repeat until the app is fully on `@carsxe/design-system`. This is not a timed `/loop` heartbeat.

Migration rules live in the `carsxe-design-system` skill. This skill owns the loop, inventory, and visual proof.

## Inputs

- **App root** (optional): directory to migrate. Default: current working directory.
- Do not commit or push unless the user asked. Keep work in the working tree.

## Instructions

### 0. Prerequisites

Read `carsxe-design-system/SKILL.md` and `reference.md` before changing any UI.

If those files are missing from this skills folder, copy **both** `carsxe-design-system` and `carsxe-migrate-loop` from `packages/skills` (or from the docs catalog) into the agent skills directory, then continue.

Do not confuse `@carsxe/design-system` with `@carsxe/ui`. Do not migrate widget or edit-mode behavior. Do not run `shadcn add`. Do not create wrappers around design-system primitives.

### 1. Bootstrap once

Detect the package manager from lockfiles (`bun.lock` / `bun.lockb` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm).

```bash
bun add @carsxe/design-system
# or: pnpm add @carsxe/design-system
# or: npm install @carsxe/design-system
```

Load CSS in the app entry (layout, `main.tsx`, or global stylesheet):

- Tailwind v4 app → `@carsxe/design-system/globals.css`
- Otherwise → `@carsxe/design-system/styles.css`

Skip reinstall if the package is already a dependency. Still verify the CSS import exists.

### 2. Inventory

Read [inventory.md](inventory.md). Grep the app (exclude `node_modules`, `dist`, `.next`, `.output`, `coverage`, `build`, `.turbo`, `.carsxe-migrate-loop`).

Count **covered** leftover hits. That count is the unresolved-work number for this loop. List uncovered third-party UI separately; it is not a failure.

Record `HITS_BEFORE` at the start of every iteration.

### 3. Loop

Repeat the following cycle. **Max 20 iterations.** Stop early if an iteration does not reduce the hit count.

#### A. Pick a slice

Choose one coherent slice: a single route/page, or one component family (`Button` + usages, `Dialog` + usages). Do not migrate the whole app in one iteration.

Prefer slices that still import from `@/components/ui` or a local `components/ui` folder.

#### B. Migrate the slice

For each leftover primitive in the slice:

1. Swap imports to `@carsxe/design-system/components/<name>` (package root is allowed).
2. Keep `variant`, `size`, `className`, and native element props. Drop wrapper components.
3. Delete local source copies of covered primitives only when nothing else imports them.
4. Keep app-specific composites (page layouts, feature widgets). Those are not design-system primitives.

#### C. Typecheck / lint

If the app has `typecheck` or `lint` scripts, run them on the changed files (or the package). Fix failures caused by this slice before QA.

#### D. Visual QA

Follow [visual-qa.md](visual-qa.md). Screenshot and interact with every route touched this iteration. Record video when the tool supports it. Fail the iteration on visual regressions (rounded `--radius`, wrong tokens/fonts, broken layout or wiring).

#### E. Fix and re-inventory

Fix QA and type failures, then grep again. Set `HITS_AFTER`.

If `HITS_AFTER >= HITS_BEFORE` and covered leftovers remain, **stop** and report blockers. Do not loop without progress.

If covered leftovers remain and the count dropped, go back to **A**.

### 4. Exit conditions

Stop the loop if **any** of these are true:

- **Done:** all of the following hold:
  - Covered inventory hit count is 0
  - CSS import is present
  - No local source copies remain for covered primitives
  - Visual QA passed on every route migrated in this run
  - Typecheck/lint of changed files passed, if those scripts exist
- Max iterations reached (report remaining hits)
- Zero-progress iteration (report blockers)

Uncovered UI (charts, maps, widgets, custom composites) must be listed in the report. It does not block “done”.

After a successful inventory of 0, run a **final full-app visual sweep** of remaining user-facing routes (not only the last slice) per `visual-qa.md`. If that sweep fails, treat it as remaining work and continue the loop if iterations remain.

### 5. Report

```
carsxe-migrate-loop complete.
  Iterations:    N
  Inventory:     0 leftover hits
  Routes QA'd:   N
  Screenshots:   N
  Video:         yes/no
```

If not fully migrated:

```
carsxe-migrate-loop stopped after N iterations.
  Inventory:     M leftover hits
  Routes QA'd:   N
  Screenshots:   N
  Video:         yes/no

Remaining hits:
  - src/components/ui/button.tsx — local primitive copy
  - src/app/settings/page.tsx — import from @/components/ui/dialog

Uncovered (not blocking):
  - src/components/Chart.tsx — third-party chart
```

## Additional resources

- Leftover grep patterns: [inventory.md](inventory.md)
- Screenshot, interaction, and video protocol: [visual-qa.md](visual-qa.md)

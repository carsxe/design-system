# Visual QA

Prove each migrated slice in a real browser. Screenshots are required. Video is required when the tool can record it.

## Tooling

Prefer browser automation the agent already has (Cursor browser / computer-use: navigate, snapshot, screenshot, interact).

If none is available, use Playwright as a **one-off fallback** in this session. Do not add a Playwright CI suite or check in test files unless the app already has them.

Playwright fallback (example):

```bash
npx playwright install chromium
```

Record video and screenshots to `.carsxe-migrate-loop/` (gitignored; do not commit):

```ts
const context = await browser.newContext({
  recordVideo: { dir: ".carsxe-migrate-loop/video" },
})
await page.screenshot({
  path: `.carsxe-migrate-loop/screenshots/${name}.png`,
  fullPage: true,
})
```

If video cannot be recorded, say so in the iteration notes and keep screenshots.

## Dev server

Start or reuse the app’s existing dev command (`dev`, `start`, Vite, Next, TanStack Start). Do not start a second copy on the same port.

Wait until the server is actually serving before opening routes.

## Each iteration

1. Collect every user-facing route touched this slice.
2. Open each route in the browser.
3. If the app has a theme toggle, capture **light** and **`.dark`**.
4. Full-page screenshot of the default state.
5. Screenshot key interactive states that this slice migrated (open dialog, open dropdown, toast visible, tabs switched, select open).
6. Interact with migrated controls: click buttons, type into inputs, open/close overlays. Broken `onClick` / form wiring fails the iteration.
7. Record a short walkthrough video of the slice when recording is available.

Name artifacts:

```
.carsxe-migrate-loop/screenshots/iter-N-<route>-<theme>-<state>.png
.carsxe-migrate-loop/video/iter-N-<route>.webm
```

## Fail the iteration if

- Controls use rounded corners. `--radius` is `0`; corners are sharp. Circular controls (`Switch`, radio, slider thumbs, progress, avatars) may stay `rounded-full`.
- Brand tokens look wrong. Primary should read as `#065774` (teal), not the default shadcn zinc/slate palette.
- Fonts are not the design-system stack: Manrope (UI, body, inputs), DM Sans (headings).
- Layout overflow, clipped overlays, or controls that do not open/close.
- Default control height looks compact vs 40px (`h-10`) unless the slice intentionally passed `className` (for example `h-8` on Input).

## Final sweep

When covered inventory hits reach 0, walk remaining user-facing routes (nav links, primary flows), not only the last slice. Screenshot each. Record one walkthrough video of the main flow if video is available.

A failed final sweep is remaining work: fix and continue the loop if iterations remain.

## After QA

Note in the loop report: routes visited, screenshot count, whether video was captured, and any fail reasons. Leave artifacts on disk under `.carsxe-migrate-loop/` for the user; do not paste large binaries into chat.

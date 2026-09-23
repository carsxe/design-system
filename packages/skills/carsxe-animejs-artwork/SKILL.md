---
name: carsxe-animejs-artwork
description: Turn CarsXE feature artwork into production-ready inline SVG animations powered by Anime.js v4. Always start from a concept image produced by the carsxe-feature-artwork companion skill (new or already accepted); this skill must not complete without that concept stage. Use for draw-on vehicle-workflow illustrations, animated auth side panels and feature carousels, SVG line reveals, data-flow connectors, motion paths, optional loop controls, @carsxe/design-system token inheritance, and React/TanStack Start/Vite integration.
---

# CarsXE Anime.js SVG Artwork

Turn a CarsXE feature-artwork concept into lightweight animation that explains the feature. Preserve product meaning and the established navy-and-cyan workflow style; do not merely add motion to every visible object.

## Required companion skill

`carsxe-feature-artwork` is a mandatory dependency. It owns the visual system (1536×1024, `#F9F9F9` canvas, generic silver sedan, navy linework, cyan `#00B6E5` connectors, thin square cards, short uppercase labels). This skill owns only the vector reconstruction and motion.

- Load and follow `carsxe-feature-artwork` before drawing SVG or writing Anime.js code.
- The concept is either:
  - a **new** image generated with `carsxe-feature-artwork` for the requested feature, or
  - an **already accepted** `carsxe-feature-artwork` output for the same feature (for example `apps/web/public/images/auth/<feature-slug>-workflow.png` or the published examples at <https://ui.carsxe.com/docs/skills/carsxe-feature-artwork>).
- A screenshot, rough sketch, or unrelated SVG is not a concept. Use it as input to `carsxe-feature-artwork` and generate a proper concept first.
- Inspect the concept image at full size before implementation. Never treat a prompt alone as the concept output.
- Build the handoff described in [references/animation-handoff.md](references/animation-handoff.md) from the concept before planning SVG geometry.
- Use the image only as a visual and compositional reference. Never embed the raster inside the final SVG.
- If `carsxe-feature-artwork` is not installed or cannot be loaded, stop and tell the user to copy the whole `packages/skills/carsxe-feature-artwork` folder (including its `assets/` reference image). Do not silently approximate its style.
- If image generation fails, follow the companion's correction rules. Do not replace the concept stage with prose, CSS art, or a hand-written placeholder.

## Anime.js setup

Before writing any animation code, check whether the consuming app already has Anime.js v4 (`animejs` at `^4` in its `package.json` and an existing `import … from 'animejs'`).

- If it is missing, or the app is on v3, stop and follow the official Anime.js setup guides first: [Installation](https://animejs.com/documentation/getting-started/installation) and [Module imports](https://animejs.com/documentation/getting-started/module-imports). Use the app's package manager (`bun add animejs` in the CarsXE monorepo).
- Install it in the consuming app, never in `@carsxe/design-system`.
- If the app is on v3, follow the official v3 → v4 migration guide before continuing; do not mix v3 `anime()` calls with v4 APIs.
- Confirm the setup works (the app builds and a trivial `animate()` runs) before starting the artwork.

## Required workflow

1. Load `carsxe-feature-artwork` and confirm the destination.
   - Determine the exact feature, destination (auth side panel, feature carousel, marketing section), rendered size, aspect ratio, and crop behavior.
   - Inspect the destination component and the `@carsxe/design-system` tokens it inherits (see "Inherit the design system").
   - Separate verified product facts and labels from conservative inferences.
2. Obtain the concept image.
   - Reuse an accepted `carsxe-feature-artwork` output for this feature, or generate a new one with the companion's prompt template.
   - When generating for animation, ask for clean separable groups: vehicle, primary identifier, connectors, and three to six cards with clear gaps so each can be reconstructed with SVG primitives.
3. Inspect the concept and write the handoff.
   - Verify it against the companion's visual invariants and the feature's real vocabulary.
   - Map meaningful regions to SVG groups and reject invented labels, claims, logos, badges, or fake interface details.
   - Identify halftone, texture, and generated artifacts that must not carry into the SVG.
4. Define a motion story before writing code.
   - Use two to four beats. The CarsXE default: vehicle linework draws, cyan connectors carry data out, cards reveal, the system settles.
   - Make the order explain the workflow (input → vehicle → outputs, or identifier → vehicle → decoded groups).
   - Animate once on entry by default. When repeat playback is useful, expose a `loop` option instead of forcing it.
5. Build semantic SVG layers.
   - Separate drawable strokes, fill reveals, moving markers, labels, and ambient accents.
   - Give groups stable `cx-`-prefixed IDs or `data-anim` attributes.
   - Keep important geometry as native `path`, `line`, `polyline`, `polygon`, `rect`, or `circle` elements.
   - Keep the `0 0 1536 1024` viewBox of the concept so layouts that already hold the bitmap can swap in the SVG.
6. Implement with Anime.js v4 (complete "Anime.js setup" first if the app does not have it).
   - Use `svg.createDrawable()` for line drawing.
   - Use `svg.createMotionPath()` for a marker that must follow a meaningful connector.
   - Use `svg.morphTo()` only when one shape genuinely transforms into another.
   - Use `createTimeline()` to coordinate narrative beats and `createScope()` for component-local lifecycle cleanup.
7. Add progressive enhancement and accessibility.
   - The final static SVG must remain understandable if JavaScript fails.
   - Include `<title>` and `<desc>` and wire them with `aria-labelledby`.
   - Honor `prefers-reduced-motion`; show the completed state immediately.
   - Avoid essential information conveyed only through motion or color.
8. Integrate in the destination component and test.
   - Scope selectors to one root. Never animate generic global classes such as `.line`.
   - Start on viewport entry unless the surrounding page (for example a carousel) already controls playback.
   - Clean up animations and observers on unmount.
   - Check desktop, mobile, light and `.dark` themes, replay behavior, reduced motion, and console errors.
9. Run `python3 scripts/audit_svg.py <file.svg>` on standalone SVG files and fix errors before delivery.

## Vectorization rules

Treat the concept-to-SVG step as semantic reconstruction, not automatic tracing.

- Keep the sedan as the primary focus and only the geometry needed to explain the feature.
- Redraw the sedan as a small set of clean outline paths (body, glasshouse, wheels, a few panel lines), not a traced silhouette with thousands of nodes.
- Replace halftone shading with at most one flat pale fill or a light `pattern`; never trace dots into hundreds of shapes.
- Keep cards as square `rect`s with thin borders — `@carsxe/design-system` uses `--radius: 0` and no card shadows.
- Convert labels to real SVG `<text>` using the design-system fonts (`--font-mono` for uppercase technical labels). Reproduce the companion's verified labels verbatim; fix any generated lettering errors.
- Never invent product metrics, VIN values, prices, dates, or integrations beyond generic placeholders the companion allows.
- No CarsXE logo, vehicle brand badges, customer logos, or watermarks.

## Inherit the design system

Treat `@carsxe/design-system` tokens as authoritative. Do not make a separate mini-brand for the artwork.

- Keep the SVG inline (a React component) so CSS custom properties and fonts reach its children. An `<img>` or `<object>` blocks token inheritance.
- Map artwork roles through a wrapper bridge so the SVG itself only references `--art-*` variables.
- Cyan `#00B6E5` is the one artwork-specific color from the companion; it is not a design-system token, so keep it in the bridge as `--art-connector`, with the dark-theme `--chart-2` cyan.
- Use fallback values only for standalone previews. Keep fallbacks inside `var()` so the project always wins.
- Never load or hardcode a new font for the illustration.
- Test both light and `.dark` themes.

```css
[data-cx-artwork] {
  --art-bg: var(--background, #f9f9f9);        /* matches the #F9F9F9 canvas */
  --art-line: var(--chart-5, #162849);         /* navy technical linework */
  --art-detail: var(--muted-foreground, #a8a8a8); /* pale secondary details */
  --art-panel: var(--card, #ffffff);
  --art-panel-border: var(--border, #ebebeb);
  --art-tint: var(--accent, #eaf5ff);          /* pale blue-gray fills */
  --art-connector: #00b6e5;                    /* companion cyan */
  --art-label: var(--foreground, #3a3a3a);
  --art-radius: var(--radius, 0);
  color: var(--art-line);
  font-family: var(--font-sans, inherit);
}

.dark [data-cx-artwork] {
  --art-connector: var(--chart-2, #4dccee);
}

[data-cx-artwork] text {
  font-family: var(--font-mono, inherit);
  letter-spacing: 0.04em;
}
```

In `.dark`, `--chart-5` becomes a pale blue-gray and `--background`/`--card` go dark, so the same SVG inverts correctly without edits.

## Motion grammar

Choose motion from meaning:

| Meaning | SVG treatment | Anime.js treatment |
| --- | --- | --- |
| Vehicle and card structure | restrained navy strokes | `svg.createDrawable()` |
| Data leaving the vehicle or identifier | cyan connector plus marker | `svg.createMotionPath()` |
| State transformation (e.g. raw VIN → decoded) | paired compatible shapes | `svg.morphTo()` |
| Card or value becoming available | grouped fill/opacity reveal | timeline `add()` |
| Live but idle system | one subtle connector pulse | slow bounded loop |

Use one dominant motion idea. Keep secondary motion subordinate.

Recommended defaults:

- Total first-play duration: 2.5–6 seconds.
- Stroke width: visually consistent at the side-panel rendered size.
- Easing: `outCubic` for reveals, `inOutQuad` for flow, `linear` for route traversal.
- Stagger: 40–140 ms.
- Loops: no more than one or two low-amplitude ambient groups.

## Playback options

Expose a small configuration surface when the asset may be reused:

```js
const playback = {
  autoplay: true,
  loop: false,
  loopDelay: 1200,
};

createTimeline({
  autoplay: playback.autoplay,
  loop: playback.loop,
  loopDelay: playback.loop ? playback.loopDelay : 0,
});
```

- Default to one complete play and a settled final state.
- Allow a boolean prop, data attribute, or UI toggle to enable full-sequence looping.
- Add a quiet hold between iterations so the reset is readable.
- Restart cleanly from the first semantic state; do not leave ambient loops or old scopes running underneath.
- Disable full-sequence looping for `prefers-reduced-motion`; show the complete static state instead.
- In a carousel, let the carousel start playback when the slide becomes active and revert when it leaves.

## Minimal Anime.js v4 pattern

```js
import { createScope, createTimeline, stagger, svg, utils } from 'animejs';

const root = document.querySelector('[data-cx-artwork]');

const scope = createScope({
  root,
  mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
}).add((self) => {
  const drawables = svg.createDrawable('[data-anim="draw"]');

  if (self.matches.reduceMotion) {
    utils.set(drawables, { draw: '0 1' });
    utils.set('[data-anim="reveal"]', { opacity: 1, y: 0 });
    return;
  }

  createTimeline({ defaults: { ease: 'outCubic' } })
    .add(drawables, {
      draw: ['0 0', '0 1'],
      duration: 900,
      delay: stagger(70),
    }, 0)
    .add('[data-anim="packet"]', {
      ...svg.createMotionPath('[data-path="vin-route"]'),
      duration: 1100,
      ease: 'linear',
    }, '-=300')
    .add('[data-anim="reveal"]', {
      opacity: [0, 1],
      y: [8, 0],
      duration: 450,
      delay: stagger(80),
    }, '-=250');
});

// React effect cleanup or route teardown:
// return () => scope.revert();
```

For React, create the scope inside `useEffect` or `useLayoutEffect`, pass the component root element as `root`, and return `scope.revert()` from the effect cleanup. If `animejs` is not installed yet, follow "Anime.js setup" above first.

## Good outcomes

- VIN specifications: the VIN field draws, a cyan marker travels down each connector, then identity, engine, dimensions, and equipment cards reveal.
- Vehicle history: the sedan draws, the dated timeline fills left to right, then ownership, title, accidents, service, and mileage cards appear.
- Market value: value tier cards reveal, the price range curve draws, then comparable sales rows fade in.
- Vehicle images: the camera frame draws around the sedan, the angle set fills in sequence, then the output library settles.
- Each outcome begins with an inspected `carsxe-feature-artwork` concept and visibly matches it.

## Bad outcomes

- Embedding the concept PNG/WebP inside SVG and animating its opacity.
- Skipping `carsxe-feature-artwork` and inventing a new style for the animated version.
- Writing SVG or Anime.js code before obtaining and inspecting a concept image.
- Tracing halftone shading or the sedan silhouette into thousands of nodes.
- Making the car drive around when the feature is identity, history, or pricing.
- Drawing every outline simultaneously with no narrative order.
- Rounded floating cards or drop shadows (the design system is square and flat).
- Looping the entire illustration forever without an explicit user-facing option.
- Morphing incompatible arbitrary paths only because the API exists.
- Repeating the page headline, description, CTA, or CarsXE logo inside the artwork.
- Shipping v3 syntax such as a default `anime()` call.
- Unscoped selectors that animate other icons or illustrations on the page.
- Hiding the final asset until JavaScript runs.
- Hardcoding colors or fonts instead of the `--art-*` bridge.
- Rendering token-dependent artwork through `<img>` or `<object>`.

## Quality gate

Before accepting the result, verify:

1. The animation explains the actual feature without the surrounding copy.
2. The SVG still communicates the idea as a static image and matches the concept's hierarchy.
3. Every animated object has a semantic reason to move.
4. The first play finishes quickly and settles into a calm final state.
5. Labels, IDs, selectors, and product terms are accurate and verbatim from the handoff.
6. The asset is legible at its real side-panel or carousel size and safe under expected cropping.
7. Reduced-motion users see the complete result immediately.
8. Component teardown leaves no observer, listener, or animation running.
9. No raster `<image>`, watermark, logo, badge, or fabricated claim remains.
10. It reads as the same family as the `carsxe-feature-artwork` examples.
11. Switching between light and `.dark` updates the artwork without editing the SVG.
12. Both once and loop modes restart cleanly, and reduced-motion mode never loops.
13. `scripts/audit_svg.py` reports no errors.
14. Anime.js v4 is installed in the consuming app per the official setup guide, not in `@carsxe/design-system`.

## References

- Read [references/animation-handoff.md](references/animation-handoff.md) to turn a `carsxe-feature-artwork` concept into an SVG plan.
- Read [references/animejs-v4-patterns.md](references/animejs-v4-patterns.md) for framework integration, entry triggers, motion paths, morphing, and cleanup patterns.
- Read [references/do-dont-examples.md](references/do-dont-examples.md) when planning motion or reviewing whether it is meaningful.

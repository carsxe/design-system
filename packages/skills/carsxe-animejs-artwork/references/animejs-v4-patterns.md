# Anime.js v4 SVG patterns

## Contents

1. Line drawing
2. Narrative timelines
3. Motion paths
4. Morphing
5. Viewport entry
6. Component cleanup
7. Reduced motion
8. Performance
9. Design-system inheritance
10. Optional looping
11. CarsXE concept handoff

## 1. Line drawing

`svg.createDrawable(target)` accepts SVG line-like elements and returns proxy elements with a `draw` property. Animate from `'0 0'` to `'0 1'` for a draw-on reveal.

```js
import { animate, stagger, svg } from 'animejs';

animate(svg.createDrawable('[data-anim="draw"]'), {
  draw: ['0 0', '0 1'],
  duration: 1000,
  delay: stagger(80),
  ease: 'inOutQuad',
});
```

Do not apply this to filled silhouettes with no intentional stroke. Create a clean outline path or reveal the fill separately.

## 2. Narrative timelines

Use explicit overlap to avoid a mechanical one-step-after-another feel.

```js
import { createTimeline, stagger, svg } from 'animejs';

createTimeline()
  .add(svg.createDrawable('[data-anim="frame"]'), {
    draw: ['0 0', '0 1'], duration: 800, delay: stagger(60),
  }, 0)
  .add('[data-anim="event"]', {
    opacity: [0, 1], x: [-8, 0], duration: 350, delay: stagger(90),
  }, '-=220')
  .add('[data-anim="result"]', {
    opacity: [0, 1], scale: [0.96, 1], duration: 420,
  }, '-=80');
```

Use labels when positions need names reused across several additions.

## 3. Motion paths

Use motion paths for a request, event, cursor, vehicle, packet, or similar subject whose route is meaningful.

```js
import { animate, svg } from 'animejs';

animate('[data-anim="packet"]', {
  ...svg.createMotionPath('[data-path="event-route"]'),
  duration: 1500,
  ease: 'linear',
});
```

Keep the route visible or draw it immediately before the moving marker. Do not send decorative dots around arbitrary curves.

## 4. Morphing

Morph only compatible semantic states, such as raw event to structured event, open folder to completed folder, or collapsed to expanded data group.

```js
import { animate, svg } from 'animejs';

animate('[data-shape="raw"]', {
  d: svg.morphTo('[data-shape="structured"]'),
  duration: 650,
  ease: 'inOutCirc',
});
```

Keep the hidden target shape in the same viewBox. Inspect the interpolation at intermediate frames; correct self-intersections rather than accepting them.

## 5. Viewport entry

Prefer an `IntersectionObserver` when the page does not already have a scroll-animation system. Create the animation only after entry or create it paused and play once. Disconnect the observer after the first successful play.

```js
const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  playArtwork();
  observer.disconnect();
}, { threshold: 0.3 });

observer.observe(root);
```

Do not replay continuously while the user makes tiny scroll movements across the threshold.

## 6. Component cleanup

Use `createScope({ root })` for component-local selectors. A scope can revert all Anime.js objects it owns. Return its cleanup from React effects and remove custom observers/listeners in the scope constructor cleanup.

```js
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */);
  const scope = createScope({ root: rootRef.current }).add(() => {
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  });

  return () => scope.revert();
}, []);
```

## 7. Reduced motion

Set the completed static state instead of merely shortening the same complex motion.

```js
const scope = createScope({
  root,
  mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
}).add((self) => {
  if (self.matches.reduceMotion) {
    utils.set(svg.createDrawable('[data-anim="draw"]'), { draw: '0 1' });
    utils.set('[data-anim="reveal"]', { opacity: 1, transform: 'none' });
    return;
  }
  playArtwork();
});
```

## 8. Performance

- Prefer transforms and opacity for moving filled groups.
- Keep path point counts low.
- Avoid animating blur filters, huge shadows, or many masks on large canvases.
- Avoid `vector-effect="non-scaling-stroke"` on paths whose scale changes every frame; drawable length must be recalculated.
- Test at the real rendered dimensions, not only in a tiny isolated preview.
- Pause or avoid ambient loops when the asset is offscreen.

## 9. Design-system inheritance

Keep token-dependent SVG inline so CSS custom properties and inherited fonts reach its children. Use a wrapper token bridge when the project uses different names.

```css
[data-cx-artwork] {
  --art-bg: var(--background, transparent);
  --art-fg: var(--foreground, currentColor);
  --art-panel: var(--card, var(--art-bg));
  --art-border: var(--border, currentColor);
  --art-accent: var(--primary, currentColor);
  --art-radius: var(--radius, 0);
  color: var(--art-fg);
  font-family: var(--font-sans, inherit);
}

[data-cx-artwork] svg text {
  font-family: var(--font-mono, inherit);
}
```

Use `var(--token, fallback)` only for standalone portability. Never place a generated palette or font above the project token in the cascade.

## 10. Optional looping

Keep full-sequence looping configurable and off by default.

```js
function createArtworkTimeline({ loop = false } = {}) {
  return createTimeline({
    loop,
    loopDelay: loop ? 1200 : 0,
    defaults: { ease: 'outCubic' },
  })
    .add(/* structure */)
    .add(/* flow */)
    .add(/* result */);
}
```

When a UI toggle or prop changes, revert the existing scope before creating the new playback mode. Never enable full looping under `prefers-reduced-motion`.

## 11. CarsXE concept handoff

Before using these Anime.js patterns, load `carsxe-feature-artwork`, obtain or generate the concept image for the feature, inspect it, and write the handoff in `animation-handoff.md`. Build SVG geometry from that handoff.

The concept image is a reference only. Do not embed it in the final SVG, sample a hardcoded palette from it, or treat generated details as verified product facts.

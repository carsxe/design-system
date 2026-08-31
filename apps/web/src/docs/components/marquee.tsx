import { Marquee } from "@carsxe/design-system/components/marquee"

import type { ComponentDoc } from "./types"

const endpoints = [
  "VIN Decoder",
  "License Plate Lookup",
  "Vehicle History",
  "Market Value",
  "Vehicle Images",
  "OBD Codes",
  "Vehicle Recalls",
  "Vehicle Specs",
]

function MarqueeItems() {
  return (
    <>
      {endpoints.map((endpoint) => (
        <span
          key={endpoint}
          className="whitespace-nowrap rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground"
        >
          {endpoint}
        </span>
      ))}
    </>
  )
}

function MarqueeDefaultExample() {
  return (
    <div className="grid w-full max-w-xl gap-2">
      <Marquee aria-label="CarsXE API endpoints">
        <MarqueeItems />
      </Marquee>
      <p className="text-xs text-muted-foreground">
        Hover to pause, then scroll through the items with your wheel,
        trackpad, or a swipe.
      </p>
    </div>
  )
}

function MarqueeReverseExample() {
  return (
    <div className="w-full max-w-xl">
      <Marquee aria-label="CarsXE API endpoints, reversed" reverse duration={16}>
        <MarqueeItems />
      </Marquee>
    </div>
  )
}

function MarqueeAlwaysRunningExample() {
  return (
    <div className="w-full max-w-xl">
      <Marquee aria-label="CarsXE API endpoints ticker" pauseOnHover={false}>
        <MarqueeItems />
      </Marquee>
    </div>
  )
}

const marquee = {
  slug: "marquee",
  title: "Marquee",
  description:
    "An auto-scrolling strip that loops its content seamlessly. Hovering or focusing pauses the motion and hands control to the user, who can scroll through the items with a wheel, trackpad, or swipe; when they leave, the marquee resumes from wherever they stopped. Respects prefers-reduced-motion by staying static while remaining manually scrollable.",
  importName: "Marquee",
  importPath: "@carsxe/design-system/components/marquee",
  usage: `import { Marquee } from "@carsxe/design-system/components/marquee"

<Marquee>
  <span>VIN Decoder</span>
  <span>License Plate Lookup</span>
  <span>Vehicle History</span>
</Marquee>`,
  preview: <MarqueeDefaultExample />,
  previewCode: `<Marquee aria-label="CarsXE API endpoints">
  {endpoints.map((endpoint) => (
    <span key={endpoint} className="whitespace-nowrap rounded-full border bg-card px-4 py-1.5 text-sm">
      {endpoint}
    </span>
  ))}
</Marquee>`,
  examples: [
    {
      title: "Reversed with a faster loop",
      preview: <MarqueeReverseExample />,
      code: `<Marquee aria-label="CarsXE API endpoints, reversed" reverse duration={16}>
  <MarqueeItems />
</Marquee>`,
    },
    {
      title: "Always running",
      preview: <MarqueeAlwaysRunningExample />,
      code: `<Marquee aria-label="CarsXE API endpoints ticker" pauseOnHover={false}>
  <MarqueeItems />
</Marquee>`,
    },
  ],
  props: [
    {
      name: "duration",
      type: "number",
      defaultValue: "24 (seconds per loop)",
    },
    { name: "reverse", type: "boolean", defaultValue: "false" },
    { name: "pauseOnHover", type: "boolean", defaultValue: "true" },
  ],
} satisfies ComponentDoc

export {
  marquee,
  MarqueeAlwaysRunningExample,
  MarqueeDefaultExample,
  MarqueeReverseExample,
}

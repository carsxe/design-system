import { CustomFont, ImageResponse } from "cf-workers-og"

import logoDark from "../../public/logo-dark.png?inline"
import logoLight from "../../public/logo-light.png?inline"

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const TITLE_MAX = 48
const DEFAULT_BACKGROUND = "#f9f9f9"
const INK_ON_LIGHT = "#0b1a22"
const INK_ON_DARK = "#ffffff"
const LIGHT_BACKGROUND_LUMINANCE = 0.6
const DM_SANS_CSS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&display=swap"
const SAFARI_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"

let dmSansPromise: Promise<ArrayBuffer> | undefined

function clampTitle(title: string) {
  if (title.length <= TITLE_MAX) {
    return title
  }

  return `${title.slice(0, TITLE_MAX - 1).trimEnd()}…`
}

function isLightBackground(hex: string) {
  const value = hex.replace("#", "")
  const r = Number.parseInt(value.slice(0, 2), 16) / 255
  const g = Number.parseInt(value.slice(2, 4), 16) / 255
  const b = Number.parseInt(value.slice(4, 6), 16) / 255

  return 0.299 * r + 0.587 * g + 0.114 * b > LIGHT_BACKGROUND_LUMINANCE
}

async function fetchDmSans() {
  const cssResponse = await fetch(DM_SANS_CSS, {
    headers: { "User-Agent": SAFARI_UA },
  })
  const css = await cssResponse.text()
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, "")

  if (!fontUrl) {
    throw new Error("DM Sans font URL not found")
  }

  const fontResponse = await fetch(fontUrl)
  return fontResponse.arrayBuffer()
}

async function loadDmSans() {
  try {
    dmSansPromise ??= fetchDmSans()
    return await dmSansPromise
  } catch {
    dmSansPromise = undefined
    return undefined
  }
}

function OgCard({
  title,
  eyebrow,
  background = DEFAULT_BACKGROUND,
}: {
  title: string
  eyebrow?: string
  background?: string
}) {
  const onLight = isLightBackground(background)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background,
        color: onLight ? INK_ON_LIGHT : INK_ON_DARK,
        padding: 72,
        fontFamily: "DM Sans",
      }}
    >
      <img src={onLight ? logoLight : logoDark} height={48} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 28,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.72,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ fontSize: 28, opacity: 0.72 }}>ui.carsxe.com</div>
    </div>
  )
}

export async function createOgImage(
  title: string,
  eyebrow?: string,
  background?: string
) {
  const data = await loadDmSans()
  const fonts = data
    ? [new CustomFont("DM Sans", data, { weight: 600 })]
    : undefined

  return ImageResponse.create(
    <OgCard
      title={clampTitle(title)}
      eyebrow={eyebrow}
      background={background}
    />,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    }
  )
}

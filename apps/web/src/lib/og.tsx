import { CustomFont, ImageResponse } from "cf-workers-og"

import logoDark from "../../public/logo-dark.png?inline"

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const TITLE_MAX = 80
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

function OgCard({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#00aed5",
        color: "#ffffff",
        padding: 72,
        fontFamily: "DM Sans",
      }}
    >
      <img src={logoDark} height={48} alt="" />
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

export async function createOgImage(title: string, eyebrow?: string) {
  const data = await loadDmSans()
  const fonts = data
    ? [new CustomFont("DM Sans", data, { weight: 600 })]
    : undefined

  return ImageResponse.create(
    <OgCard title={clampTitle(title)} eyebrow={eyebrow} />,
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

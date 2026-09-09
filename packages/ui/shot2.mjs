import { chromium } from "@playwright/test"
const b = await chromium.launch()
for (const t of ["light","dark"]) {
  const p = await b.newPage({ viewport: { width: 900, height: 620 }, deviceScaleFactor: 2 })
  await p.goto("file:///tmp/claude-1000/-home-yuraks/d16eb01d-0173-4833-8951-88ed4a51ce71/scratchpad/mono-" + t + ".html")
  await p.waitForTimeout(250)
  await p.screenshot({ path: "/tmp/claude-1000/-home-yuraks/d16eb01d-0173-4833-8951-88ed4a51ce71/scratchpad/mono-" + t + ".png", fullPage: true })
}
await b.close(); console.log("shot ok")

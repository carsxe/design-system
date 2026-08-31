import { expect, test } from "@playwright/test"

test("world map supports keyboard inspection and selection", async ({
  page,
}) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))

  await page.goto(
    "/iframe.html?id=components-world-map-chart--default&viewMode=story"
  )
  const canvas = page.getByRole("img", {
    name: "Vehicle report volume by country",
  })
  await expect(canvas).toBeVisible()
  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()
  await canvas.focus()
  await page.keyboard.press("ArrowRight")
  const tooltip = page.getByRole("tooltip")
  await expect(tooltip).toContainText("United States")
  const tooltipPosition = await tooltip.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      left: Number.parseFloat(style.left),
      top: Number.parseFloat(style.top),
    }
  })
  await page.keyboard.press("Escape")
  await expect(tooltip).toBeHidden()
  if (box) {
    await page.mouse.move(
      box.x + tooltipPosition.left - 18,
      box.y + tooltipPosition.top - 6
    )
    await expect(tooltip).toBeVisible()
  }
  await canvas.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("world-map-selection")).toContainText(
    "United States"
  )
  await page.keyboard.press("ArrowRight")
  await expect(tooltip).toContainText("Canada")
  await page.keyboard.press("Escape")
  await expect(tooltip).toBeHidden()
  expect(pageErrors).toEqual([])
})

test("world map renders in dark mode without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(
    "/iframe.html?id=components-world-map-chart--default&viewMode=story&globals=theme:dark"
  )
  await expect(
    page.getByRole("img", { name: "Vehicle report volume by country" })
  ).toBeVisible()
  const darkImage = await page
    .getByRole("img", { name: "Vehicle report volume by country" })
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
  await expect
    .poll(() =>
      page
        .locator("#storybook-root")
        .evaluate((root) => root.scrollWidth <= root.clientWidth)
    )
    .toBe(true)

  await page.goto(
    "/iframe.html?id=components-world-map-chart--default&viewMode=story&globals=theme:light"
  )
  const lightImage = await page
    .getByRole("img", { name: "Vehicle report volume by country" })
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
  expect(lightImage).not.toBe(darkImage)
})

test("world map controlled and empty stories expose their state", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-world-map-chart--controlled-selection&viewMode=story"
  )
  const canvas = page.getByRole("img", { name: "Controlled market selection" })
  const selectedGermany = await canvas.evaluate((element: HTMLCanvasElement) =>
    element.toDataURL()
  )
  await canvas.focus()
  await page.keyboard.press("Home")
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("controlled-world-map-selection")).toHaveText(
    "Selected market: US"
  )
  await expect
    .poll(() =>
      canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())
    )
    .not.toBe(selectedGermany)

  await page.goto(
    "/iframe.html?id=components-world-map-chart--empty&viewMode=story"
  )
  await expect(
    page.getByText("Add country report data to draw the map.")
  ).toBeVisible()
  await expect(page.getByRole("img")).toHaveCount(0)
})

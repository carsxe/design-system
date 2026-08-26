import { expect, test } from "@playwright/test"

test("sidebar collapses from its trigger and keyboard shortcut", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-sidebar--icon-collapse&viewMode=story"
  )
  const sidebar = page.locator('[data-slot="sidebar"][data-state]')
  const trigger = page.locator('[data-slot="sidebar-trigger"]')

  await expect(sidebar).toHaveAttribute("data-state", "expanded")
  await trigger.click()
  await expect(sidebar).toHaveAttribute("data-state", "collapsed")
  await page.keyboard.press("Control+b")
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
  await page.locator('[data-slot="sidebar-rail"]').click({ force: true })
  await expect(sidebar).toHaveAttribute("data-state", "collapsed")
})

test("sidebar supports controlled, right-side, and RTL configurations", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=components-sidebar--controlled&viewMode=story"
  )
  await expect(page.getByTestId("sidebar-state")).toHaveText("Expanded")
  await page.getByRole("button", { name: "Toggle externally" }).click()
  await expect(page.getByTestId("sidebar-state")).toHaveText("Collapsed")

  await page.goto(
    "/iframe.html?id=components-sidebar--right-to-left&viewMode=story"
  )
  await expect(
    page.locator('[data-slot="sidebar"][data-state]')
  ).toHaveAttribute("data-side", "right")
  await expect(page.locator('[dir="rtl"]')).toBeVisible()
})

test("mobile sidebar opens as a sheet and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/iframe.html?id=components-sidebar--mobile&viewMode=story")
  const trigger = page.locator('[data-slot="sidebar-trigger"]')
  await trigger.focus()
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "Sidebar" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Sidebar" })).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("signature pad draws and history controls work", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=components-signature-pad--default&viewMode=story"
  )
  const segment = page.getByRole("img", { name: "Authorized signature" })
  const box = await segment.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return

  await page.mouse.move(box.x + 60, box.y + 100)
  await page.mouse.down()
  await page.mouse.move(box.x + 210, box.y + 65, { steps: 8 })
  await page.mouse.move(box.x + 360, box.y + 115, { steps: 8 })
  await page.mouse.up()

  const input = page.locator('input[name="authorization"]')
  await expect(input).not.toHaveValue("[]")
  await page.getByRole("button", { name: "Undo signature stroke" }).click()
  await expect(input).toHaveValue("[]")
  await page.getByRole("button", { name: "Redo signature stroke" }).click()
  await expect(input).not.toHaveValue("[]")
  await page.getByRole("button", { name: "Clear signature" }).click()
  await expect(input).toHaveValue("[]")
})

test("all chart families and D3 charts render without clipping", async ({
  page,
}) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))

  await page.goto(
    "/iframe.html?id=components-chart--all-families&viewMode=story"
  )
  for (const heading of [
    "Inventory velocity",
    "Sales channels",
    "Valuation signals",
    "Lead sources",
    "Inspection profile",
    "Report completion",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible()
  }
  const charts = page.locator('[data-slot="chart"]')
  await expect(charts).toHaveCount(14)
  const firstChart = charts.first()
  await firstChart.scrollIntoViewIfNeeded()
  const firstChartBox = await firstChart.boundingBox()
  expect(firstChartBox).not.toBeNull()
  if (firstChartBox) {
    await page.mouse.move(firstChartBox.x + 120, firstChartBox.y + 80)
  }
  await page.locator("#storybook-root").evaluate((root) => {
    root.style.width = "760px"
  })
  await expect
    .poll(() =>
      page.locator("#storybook-root").evaluate((root) => ({
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
      }))
    )
    .toEqual({ clientWidth: 760, scrollWidth: 760 })
  await expect(page.locator(".recharts-area-area").first()).toBeVisible()
  await expect(charts).toHaveCount(14)

  await page.goto(
    "/iframe.html?id=components-chart--interactive&viewMode=story"
  )
  const wholesaleButton = page.getByRole("button", { name: "wholesale" })
  await wholesaleButton.click()
  await expect(wholesaleButton).toHaveAttribute("aria-pressed", "true")

  await page.goto(
    "/iframe.html?id=components-chart--d-3-relationships-and-hierarchy&viewMode=story"
  )
  await expect(
    page.getByRole("img", { name: "Vehicle lifecycle flow" })
  ).toBeVisible()
  await expect(
    page.getByRole("img", { name: "Vehicle record network" })
  ).toBeVisible()
  await expect(
    page.getByRole("img", { name: "Inventory composition treemap" })
  ).toBeVisible()
  await expect(
    page.getByRole("img", { name: "Inventory hierarchy sunburst" })
  ).toBeVisible()
  const lifecycleNode = page.getByRole("button", { name: /Listed:/ })
  await lifecycleNode.focus()
  await expect(lifecycleNode).toBeFocused()
  expect(pageErrors).toEqual([])
})

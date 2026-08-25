import { expect, test } from "@playwright/test"

test("catalog controls work with pointer and keyboard input", async ({ page }) => {
  await page.goto("/iframe.html?id=components-ark-inspired-catalog--inputs&viewMode=story")
  const angle = page.getByRole("slider", { name: "Direction" })
  await angle.focus()
  await page.keyboard.press("ArrowRight")
  await expect(angle).toHaveAttribute("aria-valuenow", "1")

  await page.getByRole("button", { name: "Increase value" }).click()
  await expect(page.getByRole("spinbutton", { name: "Quantity" })).toHaveValue("4")
  await expect(page.getByRole("radiogroup", { name: "Experience rating" })).toBeVisible()
})

test("tour opens, advances, and restores focus", async ({ page }) => {
  await page.goto("/iframe.html?id=components-ark-inspired-catalog--surfaces&viewMode=story")
  const trigger = page.getByRole("button", { name: "Start tour" })
  await trigger.focus()
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "Welcome" })).toBeVisible()
  await page.getByRole("button", { name: "Next" }).click()
  await expect(page.getByRole("dialog", { name: "Vehicle search" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

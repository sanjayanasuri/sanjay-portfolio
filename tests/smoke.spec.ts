import { test, expect } from "@playwright/test";

test("home and posts render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Sanjay/i })).toBeVisible();
  await page.goto("/posts");
  await expect(page.getByRole("heading", { name: /Posts/i })).toBeVisible();
});

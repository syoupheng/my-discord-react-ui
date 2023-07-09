import { test, expect } from "../playwright/fixtures";

test("should display the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/channels/@me");
});

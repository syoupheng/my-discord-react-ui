import { test, expect } from "./fixtures";

test("should display the home page", async ({ page, context }) => {
  console.log("storageState", await context.storageState());
  await page.goto("/");
  await expect(page).toHaveURL("/channels/@me");
});

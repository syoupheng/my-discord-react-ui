import { test, expect } from "@playwright/test";

test("register", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page.getByTestId("label-email")).toHaveClass(/text-danger/);
  await expect(page.getByTestId("label-username")).toHaveClass(/text-danger/);
  await expect(page.getByTestId("label-password")).toHaveClass(/text-danger/);
});

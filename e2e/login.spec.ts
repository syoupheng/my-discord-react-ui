import { test, expect } from "@playwright/test";

// test.use({ storageState: undefined });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});

test.describe("email input validation", () => {
  test("should display an error message when the email is empty", async ({ page, context }) => {
    console.log("context", await context.storageState());
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-email")).toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-email")).toContainText("Veuillez renseigner votre email");
  });

  test("should display an error message when the email is invalid", async ({ page }) => {
    await page.getByLabel("E-mail").fill("invalid-email");
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-email")).toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-email")).toContainText("Veuillez renseigner une adresse email valide");
  });

  test("should not display an error message when the email is valid", async ({ page }) => {
    await page.getByLabel("E-mail").fill("some-email@gmail.com");
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-email")).not.toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-email")).not.toContainText("Veuillez renseigner une adresse email valide");
  });
});

test.describe("password input validation", () => {
  test("should display an error message when the password is empty", async ({ page }) => {
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-password")).toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-password")).toContainText("Votre mot de passe doit contenir au moins 8 caractères");
  });

  test("should display an error message when the password is too short", async ({ page }) => {
    await page.getByLabel("Mot de passe").fill("1234567");
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-password")).toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-password")).toContainText("Votre mot de passe doit contenir au moins 8 caractères");
  });

  test("should not display an error message when the password is valid", async ({ page }) => {
    await page.getByLabel("Mot de passe").fill("12345678");
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-password")).not.toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-password")).not.toContainText("Votre mot de passe doit contenir au moins 8 caractères");
  });
});

test("should display an error message when the user email does not exist", async ({ page }) => {
  await page.getByLabel("E-mail").fill("userThatDoesNotExist@gmail.com");
  await page.getByLabel("Mot de passe").fill("password");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page.getByText("Aucun utilisateur n'existe avec cet email")).toBeVisible();
  await expect(page).not.toHaveURL("/channels/@me");
});

test("should display an error when wrong password", async ({ page }) => {
  await page.getByLabel("E-mail").fill("userThatExists@gmail.com");
  await page.getByLabel("Mot de passe").fill("wrong-password");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page.getByText("Identifiant ou mot de passe invalide.")).toBeVisible();
  await expect(page).not.toHaveURL("/channels/@me");
});

test("should redirect to home page when the user is successfully logged in", async ({ page }) => {
  await page.getByLabel("E-mail").fill("userThatExists@gmail.com");
  await page.getByLabel("Mot de passe").fill("password");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page).toHaveURL("/channels/@me");
});

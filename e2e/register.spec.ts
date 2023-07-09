import { test, expect } from "@playwright/test";

// test.use({ storageState: undefined });

test.beforeEach(async ({ page }) => {
  await page.goto("/register");
  await expect(page).toHaveURL("/register");
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

test.describe("username input validation", () => {
  test("should display an error message when the username is empty", async ({ page }) => {
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-username")).toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-username")).toContainText("Veuillez renseigner votre nom d'utilisateur");
  });

  test("should not display an error message when the username is valid", async ({ page }) => {
    await page.getByLabel("Nom d'utilisateur").fill("some-username");
    await page.getByRole("button", { name: "Connexion" }).click();
    await expect(page.getByTestId("label-username")).not.toHaveClass(/text-danger/);
    await expect(page.getByTestId("label-username")).not.toContainText("Veuillez renseigner votre nom d'utilisateur");
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

test("should display an error message when the user already exists", async ({ page }) => {
  await page.getByLabel("E-mail").fill("userThatExists@gmail.com");
  await page.getByLabel("Nom d'utilisateur").fill("userThatExists");
  await page.getByLabel("Mot de passe").fill("12345678");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page.getByText("Cet email est déjà pris !")).toBeVisible();
});

test("should successfully register the user", async ({ page }) => {
  await page.getByLabel("E-mail").fill("newUser@gmail.com");
  await page.getByLabel("Nom d'utilisateur").fill("newUser");
  await page.getByLabel("Mot de passe").fill("12345678");
  await page.getByRole("button", { name: "Connexion" }).click();
  await expect(page).toHaveURL("/channels/@me");
  await expect(page.getByText("Bienvenue sur mon clone de Discord !")).toBeVisible();
});

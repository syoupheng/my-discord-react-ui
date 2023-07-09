import { test, expect } from "@playwright/test";
import { AuthForm } from "../playwright/auth-form";

// test.use({ storageState: undefined });

let authForm: AuthForm;

test.beforeEach(async ({ page }) => {
  authForm = new AuthForm(page);
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});

test.describe("email input validation", () => {
  test("should display an error message when the email is empty", async () => {
    await authForm.submit();
    await expect(authForm.emailLabel).toHaveClass(AuthForm.errorClass);
    await expect(authForm.emailLabel).toContainText("Veuillez renseigner votre email");
  });

  test("should display an error message when the email is invalid", async () => {
    await authForm.fillEmail("invalid-email");
    await authForm.submit();
    await expect(authForm.emailLabel).toHaveClass(AuthForm.errorClass);
    await expect(authForm.emailLabel).toContainText("Veuillez renseigner une adresse email valide");
  });

  test("should not display an error message when the email is valid", async () => {
    await authForm.fillEmail("some-email@gmail.com");
    await authForm.submit();
    await expect(authForm.emailLabel).not.toHaveClass(AuthForm.errorClass);
    await expect(authForm.emailLabel).not.toContainText("Veuillez renseigner une adresse email valide");
  });
});

test.describe("password input validation", () => {
  test("should display an error message when the password is empty", async () => {
    await authForm.submit();
    await expect(authForm.passwordLabel).toHaveClass(AuthForm.errorClass);
    await expect(authForm.passwordLabel).toContainText("Votre mot de passe doit contenir au moins 8 caractères");
  });

  test("should display an error message when the password is too short", async () => {
    await authForm.fillPassword("1234567");
    await authForm.submit();
    await expect(authForm.passwordLabel).toHaveClass(AuthForm.errorClass);
    await expect(authForm.passwordLabel).toContainText("Votre mot de passe doit contenir au moins 8 caractères");
  });

  test("should not display an error message when the password is valid", async () => {
    await authForm.fillPassword("12345678");
    await authForm.submit();
    await expect(authForm.passwordLabel).not.toHaveClass(AuthForm.errorClass);
    await expect(authForm.passwordLabel).not.toContainText("Votre mot de passe doit contenir au moins 8 caractères");
  });
});

test("should display an error message when the user email does not exist", async ({ page }) => {
  await authForm.fillEmail("userThatDoesNotExist@gmail.com");
  await authForm.fillPassword("password");
  await authForm.submit();
  await expect(page.getByText("Aucun utilisateur n'existe avec cet email")).toBeVisible();
  await expect(page).not.toHaveURL("/channels/@me");
});

test("should display an error when wrong password", async ({ page }) => {
  await authForm.fillEmail("userThatExists@gmail.com");
  await authForm.fillPassword("wrong-password");
  await authForm.submit();
  await expect(page.getByText("Identifiant ou mot de passe invalide.")).toBeVisible();
  await expect(page).not.toHaveURL("/channels/@me");
});

test("should redirect to home page when the user is successfully logged in", async ({ page }) => {
  await authForm.fillEmail("userThatExists@gmail.com");
  await authForm.fillPassword("password");
  await authForm.submit();
  await expect(page).toHaveURL("/channels/@me");
});

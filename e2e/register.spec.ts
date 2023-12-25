import { test, expect } from "@playwright/test";
import { AuthForm } from "../playwright/page-object-models/auth-form.model";

let authForm: AuthForm;

test.beforeEach(async ({ page }) => {
  authForm = new AuthForm(page);
  await page.goto("/register");
  await expect(page).toHaveURL("/register");
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

test.describe("username input validation", () => {
  test("should display an error message when the username is empty", async () => {
    await authForm.submit();
    await expect(authForm.usernameLabel).toHaveClass(AuthForm.errorClass);
    await expect(authForm.usernameLabel).toContainText("Veuillez renseigner votre nom d'utilisateur");
  });

  test("should not display an error message when the username is valid", async () => {
    await authForm.fillUsername("some-username");
    await authForm.submit();
    await expect(authForm.usernameLabel).not.toHaveClass(AuthForm.errorClass);
    await expect(authForm.usernameLabel).not.toContainText("Veuillez renseigner votre nom d'utilisateur");
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

test("should display an error message when the user already exists", async ({ page }) => {
  await authForm.fillEmail("userThatExists@gmail.com");
  await authForm.fillUsername("userThatExists");
  await authForm.fillPassword("12345678");
  await authForm.submit();
  await expect(page.getByText("Cet email est déjà pris !")).toBeVisible();
});

test("should successfully register the user", async ({ page }) => {
  await authForm.fillEmail("newUser@gmail.com");
  await authForm.fillUsername("newUser");
  await authForm.fillPassword("12345678");
  await authForm.submit();
  await expect(page).toHaveURL("/channels/@me");
  await expect(page.getByText("Bienvenue sur Discord-GPT !")).toBeVisible();
});

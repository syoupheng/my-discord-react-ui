import { Locator, Page } from "@playwright/test";

export class AuthForm {
  readonly emailLabel: Locator;
  readonly usernameLabel: Locator;
  readonly passwordLabel: Locator;

  static readonly errorClass: RegExp | string | (RegExp | string)[] = /text-danger/;

  constructor(public readonly page: Page) {
    this.emailLabel = page.getByTestId("label-email");
    this.usernameLabel = page.getByTestId("label-username");
    this.passwordLabel = page.getByTestId("label-password");
  }

  async fillEmail(email: string) {
    await this.page.getByLabel("E-mail").fill(email);
  }

  async fillUsername(username: string) {
    await this.page.getByLabel("Nom d'utilisateur").fill(username);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel("Mot de passe").fill(password);
  }

  async submit() {
    await this.page.getByRole("button", { name: "Connexion" }).click();
  }
}

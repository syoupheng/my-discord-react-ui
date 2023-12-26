import { Locator, Page } from "@playwright/test";
import { UserPage } from "./user-page.model";

export class SenderPage extends UserPage {
  readonly chatTextbox: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.chatTextbox = page.getByTestId("chat-editor");
  }

  async goToChat() {
    await this.page.goto("/channels/@me");
    await this.page
      .getByTestId("message-room-list")
      .getByText(/receiver/)
      .click();
  }

  async sendMessage(message: string) {
    await this.chatTextbox.click();
    await this.chatTextbox.pressSequentially(message);
    await this.chatTextbox.press("Enter");
  }
}

import { Locator, Page } from "@playwright/test";
import { UserPage } from "./user-page.model";

export class ReceiverPage extends UserPage {
  readonly messageNotificationFromSender: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.messageNotificationFromSender = page.getByTestId("message-notifications-list").getByRole("button", { name: /sender/ });
  }

  async goToChat() {
    await this.page.goto("/channels/@me");
    await this.page
      .getByTestId("message-room-list")
      .getByText(/sender/)
      .click();
  }
}

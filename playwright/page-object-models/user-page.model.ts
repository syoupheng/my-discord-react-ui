import { Locator, Page } from "@playwright/test";

export class UserPage {
  readonly messageItems: Locator;

  readonly chatMessagesList: Locator;

  readonly friendsPageContent: Locator;

  constructor(public readonly page: Page) {
    this.messageItems = page.getByTestId("message-item");
    this.chatMessagesList = page.getByTestId("chat-messages-list");
    this.friendsPageContent = page.getByTestId("friends-page-content");
  }

  getMessageByContent(message: string): Locator {
    return this.messageItems.filter({ hasText: message });
  }

  getDeleteButton(message: string): Locator {
    return this.getMessageByContent(message).getByRole("button", { name: "Supprimer" });
  }

  async deleteMessage(message: string) {
    const messageItem = this.getMessageByContent(message);
    const deleteButton = this.getDeleteButton(message);
    await messageItem.hover();
    await deleteButton.click();
    await this.page.getByRole("dialog", { name: "Supprimer le message" }).getByRole("button", { name: "Supprimer" }).click();
  }
}

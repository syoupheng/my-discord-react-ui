import { expect, test } from "../playwright/fixtures";

test.describe("New message", () => {
  test.beforeEach(async ({ senderPage, receiverPage }) => {
    await senderPage.goToChat();
    await receiverPage.goToChat();
  });

  test("should show the message on both the sender and the receiver's end", async ({ senderPage, receiverPage }) => {
    const newMessage = `New message ${new Date().getTime()}`;
    await senderPage.sendMessage(newMessage);
    await expect(receiverPage.getMessageByContent(newMessage)).toBeVisible();
    await expect(senderPage.getMessageByContent(newMessage)).toBeVisible();
  });

  test("should clear the text box after sending a message", async ({ senderPage }) => {
    await senderPage.sendMessage("Hello world!");
    await expect(senderPage.chatTextbox).not.toHaveText("Hello world!");
  });

  test("should append messages at the bottom of the chat", async ({ senderPage, receiverPage }) => {
    await senderPage.sendMessage("First message");
    await senderPage.sendMessage("Second message");
    await expect(receiverPage.messageItems.last()).toHaveText(/Second message/);
    await expect(senderPage.messageItems.last()).toHaveText(/Second message/);
  });
});

test.describe("Deleting a message", () => {
  let messageToDelete: string;

  test.beforeEach(async ({ senderPage, receiverPage }) => {
    await senderPage.goToChat();
    await receiverPage.goToChat();

    // Send a message to the receiver
    messageToDelete = `Message to delete ${new Date().getTime()}`;
    await senderPage.sendMessage(messageToDelete);
  });

  test("should remove the message on both the sender and the receiver's end", async ({ senderPage, receiverPage }) => {
    await expect(receiverPage.getMessageByContent(messageToDelete)).toBeVisible();
    await expect(senderPage.getMessageByContent(messageToDelete)).toBeVisible();
    await senderPage.deleteMessage(messageToDelete);
    await expect(receiverPage.getMessageByContent(messageToDelete)).not.toBeVisible();
    await expect(senderPage.getMessageByContent(messageToDelete)).not.toBeVisible();
  });

  test("should not be able to delete a message if not author", async ({ receiverPage }) => {
    await expect(receiverPage.getMessageByContent(messageToDelete)).toBeVisible();
    const deleteButton = receiverPage.getDeleteButton(messageToDelete);
    await receiverPage.getMessageByContent(messageToDelete).hover();
    await expect(deleteButton).not.toBeVisible();
  });
});

test.describe("Message notifications", () => {
  let newMessage: string;

  // Make sure that there are no unread messages before each test
  test.beforeEach(async ({ senderPage, receiverPage }) => {
    await senderPage.goToChat();
    await receiverPage.goToChat();
    await receiverPage.page.goto("/channels/@me");
    await expect(receiverPage.page).toHaveURL("/channels/@me");
    await expect(receiverPage.messageNotificationFromSender).not.toBeVisible();

    // Send a message to the receiver
    newMessage = `New message ${new Date().getTime()}`;
    await senderPage.sendMessage(newMessage);
    await expect(senderPage.getMessageByContent(newMessage)).toBeVisible();
  });

  test("should display a notification when a new message is received", async ({ receiverPage }) => {
    await expect(receiverPage.messageNotificationFromSender).toBeVisible();
  });

  test("should display the correct number of unread messages in the notification button", async ({ senderPage, receiverPage }) => {
    await expect(receiverPage.messageNotificationFromSender).toBeVisible();
    await expect(receiverPage.messageNotificationFromSender).toHaveText("1");
    await senderPage.sendMessage(newMessage);
    await expect(receiverPage.messageNotificationFromSender).toHaveText("2");
  });

  test("should remove the notification when the message is read", async ({ receiverPage }) => {
    const notificationButton = receiverPage.messageNotificationFromSender;
    await expect(notificationButton).toBeVisible();
    await notificationButton.click();
    await expect(notificationButton).not.toBeVisible();
  });
});

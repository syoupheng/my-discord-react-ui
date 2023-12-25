import { test as baseTest, expect } from "@playwright/test";
// import fs from "fs";
import path from "path";
import { AuthForm } from "./page-object-models/auth-form.model";
import { SenderPage } from "./page-object-models/sender-page.model";
import { ReceiverPage } from "./page-object-models/receiver-page.model";

// Declare the types of your fixtures.
type MyFixtures = {
  senderPage: SenderPage;
  receiverPage: ReceiverPage;
};

export * from "@playwright/test";
export const test = baseTest.extend<MyFixtures, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const workerId = test.info().parallelIndex;
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${workerId}.json`);

      console.log(`Authenticating worker ${workerId}...`);
      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined });

      const username = `test-${workerId}-${new Date().getTime()}}`;
      const authForm = new AuthForm(page);
      await page.goto(`${process.env.BASE_URL}/register`);
      await authForm.fillEmail(`${username}@gmail.com`);
      await authForm.fillUsername(username);
      await authForm.fillPassword("password");
      await authForm.submit();
      await expect(page).toHaveURL(`${process.env.BASE_URL}/channels/@me`);
      await expect(page.getByText("Bienvenue sur Discord-GPT !")).toBeVisible();
      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],

  senderPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: "playwright/.auth/sender.json" });
    const senderPage = new SenderPage(await context.newPage());
    await use(senderPage);
    await context.close();
  },

  receiverPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: "playwright/.auth/receiver.json" });
    const receiverPage = new ReceiverPage(await context.newPage());
    await use(receiverPage);
    await context.close();
  },
});

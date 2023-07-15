import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { AuthForm } from "./auth-form";

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const workerId = test.info().parallelIndex;
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${workerId}.json`);

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      console.log(`Authenticating worker ${workerId}...`);
      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined });

      const authForm = new AuthForm(page);
      await page.goto(`${process.env.BASE_URL}/register`);
      await authForm.fillEmail(`test-${workerId}@gmail.com`);
      await authForm.fillUsername(`test-${workerId}`);
      await authForm.fillPassword("password");
      await authForm.submit();
      await expect(page).toHaveURL(`${process.env.BASE_URL}/channels/@me`);
      await expect(page.getByText("Bienvenue sur Discord-GPT !")).toBeVisible();

      // const query = /* GraphQL */ `
      //   mutation Register($input: RegisterUserInput!) {
      //     register(registerUserInput: $input) {
      //       username
      //       email
      //     }
      //   }
      // `;

      // // Send authentication request. Replace with your own.
      // const response = await context.post(process.env.VITE_API_URL || "http://localhost:3500/graphql", {
      //   headers: { "Content-Type": "application/json" },
      //   data: JSON.stringify({
      //     query,
      //     variables: {
      //       input: {
      //         username: `test-${workerId}`,
      //         email: `test-${workerId}@gmail.com`,
      //         password: "password",
      //       },
      //     },
      //   }),
      // });

      // expect(response.ok()).toBeTruthy();
      // expect(await response.json()).toEqual({
      //   data: {
      //     register: {
      //       username: `test-${workerId}`,
      //       email: `test-${workerId}@gmail.com`,
      //     },
      //   },
      // });
      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});

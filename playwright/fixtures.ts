import { test as baseTest, expect, request } from "@playwright/test";
import fs from "fs";
import path from "path";

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({}, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const workerId = test.info().parallelIndex;
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${workerId}.json`);

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const context = await request.newContext({ storageState: undefined });

      const query = /* GraphQL */ `
        mutation Register($input: RegisterUserInput!) {
          register(registerUserInput: $input) {
            username
            email
          }
        }
      `;

      // Send authentication request. Replace with your own.
      const response = await context.post(process.env.VITE_API_URL || "http://localhost:3500/graphql", {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          query,
          variables: {
            input: {
              username: `test-${workerId}`,
              email: `test-${workerId}@gmail.com`,
              password: "password",
            },
          },
        }),
      });

      expect(response.ok()).toBeTruthy();
      expect(await response.json()).toEqual({
        data: {
          register: {
            username: `test-${workerId}`,
            email: `test-${workerId}@gmail.com`,
          },
        },
      });

      await context.storageState({ path: fileName });
      await context.dispose();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});

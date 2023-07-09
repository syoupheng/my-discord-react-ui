import { test as setup, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

setup("clear and then seed database", async ({ request }) => {
  const query = /* GraphQL */ `
    mutation {
      seedDatabase
    }
  `;
  const response = await request.post(process.env.VITE_API_URL ?? "http://localhost:3500/graphql", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      query,
    }),
  });

  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual({
    data: {
      seedDatabase: "Database seeded",
    },
  });
});
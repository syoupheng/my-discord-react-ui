import { test as setup } from "@playwright/test";
import dotenv from "dotenv";
import { clearAndSeedDatabase } from "./setup";
dotenv.config();

setup("clear and then seed database", async ({ request }) => {
  await clearAndSeedDatabase(request);
});

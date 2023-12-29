import { APIRequestContext, Page, expect, test as setup } from "@playwright/test";
import dotenv from "dotenv";
import { AuthForm } from "./page-object-models/auth-form.model";

dotenv.config();

setup("clear and then seed database", async ({ request }) => {
  await clearAndSeedDatabase(request);
});

const senderFile = ".auth/sender.json";
const receiverFile = ".auth/receiver.json";

setup("create user accounts to test real-time interaction", async ({ request, page }) => {
  console.log("Creating user accounts...");
  const { email: senderEmail, username: senderUsername } = await createUserAccount({
    request,
    username: `sender-${new Date().getTime()}`,
  });
  const {
    username: receiverUsername,
    discriminator: receiverDiscriminator,
    email: receiverEmail,
  } = await createUserAccount({
    request,
    username: `receiver-${new Date().getTime()}`,
  });
  await logUserIn(page, senderEmail);
  await page.context().storageState({ path: senderFile });

  // Send friend request to receiver user
  await page.getByRole("button", { name: "Ajouter un ami" }).click();
  await page.getByPlaceholder("Entre un nom d'utilisateur#0000").fill(`${receiverUsername}#${receiverDiscriminator}`);
  await page.getByRole("button", { name: "Envoyer une demande" }).click();
  await expect(page.getByText(/Bravo ! Ta demande d'ami a été envoyée/)).toBeVisible();

  // Logout as sender user
  await page.getByRole("button", { name: "Déconnexion" }).click();
  await expect(page).toHaveURL("/login");

  await logUserIn(page, receiverEmail);
  await page.context().storageState({ path: receiverFile });

  // Accept friend request from sender user
  await page.getByRole("button", { name: "En attente" }).click();
  await page.getByTestId("friend-request").filter({ hasText: senderUsername }).getByTestId("accept-friend-request").click();
  await expect(page.getByTestId("message-room-list").getByText(/sender/)).toBeVisible();
});

let authForm: AuthForm;

const TEST_PASSWORD = "password";

type CreateUserAccountOptions = {
  request: APIRequestContext;
  username: string;
};

export async function clearAndSeedDatabase(request: APIRequestContext) {
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
      seedDatabase: "🌱 Database seeded",
    },
  });
}

async function createUserAccount({ request, username }: CreateUserAccountOptions) {
  const query = /* GraphQL */ `
    mutation Register($input: RegisterUserInput!) {
      register(registerUserInput: $input) {
        username
        discriminator
        email
      }
    }
  `;

  const response = await request.post(process.env.VITE_API_URL ?? "http://localhost:3500/graphql", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      query,
      variables: {
        input: {
          username,
          email: `${username}@gmail.com`,
          password: TEST_PASSWORD,
        },
      },
    }),
  });

  expect(response.ok()).toBeTruthy();
  const json = await response.json();
  expect(json).toHaveProperty("data.register");
  return json.data.register;
}

async function logUserIn(page: Page, email: string) {
  authForm = new AuthForm(page);
  await page.goto(`${process.env.BASE_URL}/login`);
  await authForm.fillEmail(email);
  await authForm.fillPassword(TEST_PASSWORD);
  await authForm.submit();
  await expect(page).toHaveURL("/channels/@me");
  const newUserModalButton = page.getByRole("button", { name: /C'est parti/ });
  try {
    await newUserModalButton.click({ timeout: 2000 });
  } catch (error) {
    // Ignore error if the modal is not displayed
    console.log("New user modal is not displayed");
  }
}

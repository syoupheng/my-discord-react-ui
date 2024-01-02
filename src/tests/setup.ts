import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { server } from "@/tests/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  import.meta.env.VITE_API_URL = "http://localhost:3500/graphql";
  import.meta.env.VITE_SUBSCRIPTION_URL = "ws://localhost:3500/graphql";
  import.meta.env.VITE_ENV = "test";
});

afterAll(() => server.close());

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

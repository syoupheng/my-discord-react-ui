import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { server } from "@/tests/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterAll(() => server.close());

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

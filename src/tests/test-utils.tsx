import { render } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import React from "react";
import { client } from "@/apollo.config";
import { BrowserRouter } from "react-router-dom";

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </BrowserRouter>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };

import { render } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";

import { createTestQueryClient } from "./queryClient";

/**
 * Render with a QueryClientProvider.
 *
 * A fresh client per test matters because the app's real client keeps
 * `staleTime: 30_000`; sharing one across tests would let one test's cached
 * books satisfy another test's query and hide missing handlers.
 *
 * The client is returned so tests can assert on cache state (for example that a
 * review submission invalidated `["book-details", id]`).
 */
export function renderWithProviders(ui, { queryClient, ...options } = {}) {
  const client = queryClient ?? createTestQueryClient();

  function Wrapper({ children }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return {
    queryClient: client,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

export * from "@testing-library/react";
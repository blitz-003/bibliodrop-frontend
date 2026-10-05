import { QueryClient } from "@tanstack/react-query";

/**
 * One QueryClient per test.
 *
 * `retry: false` matters most: the app configures `retry: 1`, so a deliberately
 * failed request would otherwise be retried, doubling the wait before the error
 * state appears and making failure-path assertions flaky.
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
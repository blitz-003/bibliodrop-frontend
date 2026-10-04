"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * The five dashboard pages that previously constructed their own
 * `new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false,
 * retry: false } } })` are gone. A nested provider fully shadows the root
 * context, so those pages silently ran a different retry policy than their
 * siblings, split the cache (so navigating away and back dropped it and
 * re-triggered a full fetch), and leaked a module-scope client that was never
 * garbage collected.
 *
 * The options now live here, once.
 */
export default function ReactQueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
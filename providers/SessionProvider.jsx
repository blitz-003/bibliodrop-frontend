"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const session = authClient.useSession();

  return (
    <SessionContext.Provider
      value={{
        session: session?.data || null,
        user: session?.data?.user || null,
        loading: session?.isLoading,
        refetch: session?.refetch,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

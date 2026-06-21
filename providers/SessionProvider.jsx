"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const res = await authClient.getSession();

        if (!mounted) return;

        setUser(res?.data?.user ?? null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading, initialized }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

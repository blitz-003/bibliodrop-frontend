import { useSession } from "@/providers/SessionProvider";

export default function useCurrentUser() {
  const { user, loading } = useSession();
  return { user, loading };
}

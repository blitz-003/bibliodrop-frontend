import { useSession } from "@/providers/SessionProvider";

export default function useRole() {
  const { user } = useSession();
  return user?.role || null;
}

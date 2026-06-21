import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
    cache: "no-store",
  });

  return session;
}

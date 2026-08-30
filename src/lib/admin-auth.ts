import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";

export function isClerkConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

function getAdminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export interface AdminSession {
  userId: string;
  email: string;
}

/**
 * The one place that decides who is an admin. Call this from every admin
 * page/layout AND every admin Server Action — Proxy alone is not enough
 * (see node_modules/next/dist/docs .../file-conventions/proxy.md).
 */
export async function requireAdmin(): Promise<AdminSession | null> {
  if (!isClerkConfigured()) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const allowlist = getAdminAllowlist();
  if (allowlist.length === 0) return null;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email || !allowlist.includes(email)) return null;

  return { userId, email };
}

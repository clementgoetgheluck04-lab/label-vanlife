import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/generated/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super("Insufficient permissions");
    this.name = "AuthorizationError";
  }
}

export async function getAuthenticatedUser(): Promise<User> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new AuthenticationError();
  return data.user;
}

export async function ensureAppUser(user: User): Promise<void> {
  if (!user.email) throw new AuthenticationError();
  await getPrisma().user.upsert({
    where: { id: user.id },
    create: { id: user.id, email: user.email },
    update: { email: user.email },
  });
}

export async function requirePageUser(): Promise<User> {
  try {
    return await getAuthenticatedUser();
  } catch {
    redirect("/member-login");
  }
}

export async function requireActiveMember(): Promise<User | null> {
  const store = await cookies();
  if (isAdminPreviewCookie(store.get(ADMIN_PREVIEW_COOKIE)?.value)) return null;
  const user = await requirePageUser();
  const membership = await getPrisma().membership.findUnique({ where: { userId: user.id } });
  const active = membership?.status === "ACTIVE"
    && (!membership.expiresAt || membership.expiresAt > new Date());
  if (!active) redirect("/devenir-membre");
  return user;
}

export async function requirePageRole(allowed: UserRole[]): Promise<void> {
  const user = await requirePageUser();
  const record = await getPrisma().user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!record || !allowed.includes(record.role)) redirect("/member");
}

export async function requireAdminUser(): Promise<User> {
  const user = await getAuthenticatedUser();
  const record = await getPrisma().user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (record?.role !== "ADMIN" && user.email?.toLowerCase() !== "contact@labelvanlife.com") {
    throw new AuthorizationError();
  }
  return user;
}

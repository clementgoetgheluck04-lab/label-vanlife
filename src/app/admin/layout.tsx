import type { ReactNode } from "react";
import { requireAdminPage } from "@/server/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminPage();
  return children;
}

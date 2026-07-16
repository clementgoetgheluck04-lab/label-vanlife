import type { ReactNode } from "react";
import { requirePageRole } from "@/server/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requirePageRole(["ADMIN"]);
  return children;
}

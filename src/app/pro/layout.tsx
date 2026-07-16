import type { ReactNode } from "react";
import { requirePageRole } from "@/server/auth";

export default async function ProLayout({ children }: { children: ReactNode }) {
  await requirePageRole(["ESTABLISHMENT", "ADMIN"]);
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérifier une carte membre | Label Vanlife",
  description: "Vérification sécurisée d’une carte membre Label Vanlife.",
  robots: { index: false, follow: false },
};

export default function VerifyCardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

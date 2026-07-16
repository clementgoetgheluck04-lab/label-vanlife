import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidature confirmée | Label Vanlife",
  robots: { index: false, follow: false },
};

export default function ConfirmationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

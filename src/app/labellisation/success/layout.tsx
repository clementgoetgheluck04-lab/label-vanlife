import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirmation de paiement",
  alternates: { canonical: "/labellisation/success" },
  robots: { index: false, follow: false },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

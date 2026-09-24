import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement de la labellisation",
  alternates: { canonical: "/labellisation/paiement" },
  robots: { index: false, follow: false },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}

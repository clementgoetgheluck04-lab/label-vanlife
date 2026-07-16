import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace membres — Connexion | Label Vanlife",
  description:
    "Connectez-vous à votre espace membre Label Vanlife avec votre code membre. Accédez à la carte interactive, vos lieux favoris et votre passeport vanlife.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MemberLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
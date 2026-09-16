import { AdminLoginForm } from "./AdminLoginForm";

export const metadata = {
  title: "Connexion administration | Label Vanlife",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <AdminLoginForm unauthorized={params.error === "forbidden"} />;
}

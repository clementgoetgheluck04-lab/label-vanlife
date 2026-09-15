import { redirect } from "next/navigation";

export default async function LegacyPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/lieux/${encodeURIComponent(id)}`);
}

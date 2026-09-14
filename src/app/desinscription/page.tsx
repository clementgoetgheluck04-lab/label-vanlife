import { UnsubscribeForm } from "./UnsubscribeForm";

export const metadata = {
  title: "Préférences de contact | Label Vanlife",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <main className="min-h-screen bg-[#f8f6f1] px-4 pb-20 pt-32">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-stone-200 bg-white px-6 py-14 shadow-sm sm:px-12">
        <UnsubscribeForm token={token} />
      </section>
    </main>
  );
}

import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Mentions Légales</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Éditeur du site</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            <strong>Label Vanlife</strong><br />
            Association Loi 1901<br />
            SIRET : À venir<br />
            Siège social : France<br />
            Email : <Link href="mailto:contact@labelvanlife.com" className="text-emerald-600 hover:underline">contact@labelvanlife.com</Link>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Directeur de la publication</h2>
          <p className="text-sm text-neutral-600">Clément Goetgheluck, Fondateur</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Hébergement</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Site hébergé par Vercel Inc.<br />
            340 Brannan St, Suite 100<br />
            San Francisco, CA 94107<br />
            <Link href="https://vercel.com" className="text-emerald-600 hover:underline">vercel.com</Link>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Propriété intellectuelle</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            L'ensemble des contenus présents sur le site Label Vanlife (textes, images, logos, marques) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Données personnelles</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez-nous à <Link href="mailto:contact@labelvanlife.com" className="text-emerald-600 hover:underline">contact@labelvanlife.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
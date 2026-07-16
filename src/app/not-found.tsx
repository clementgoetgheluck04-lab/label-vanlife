import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-24 px-6">
      <div className="text-center space-y-6 max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/10 text-sage">
          <Compass className="h-10 w-10" />
        </div>
        <h1 className="text-6xl font-bold text-charcoal">404</h1>
        <p className="text-xl text-stone font-medium">Perdu dans la nature ?</p>
        <p className="text-sm text-stone/60">
          Cette page n&apos;existe pas ou n&apos;est plus disponible.
          Pas de panique, on te remet sur la route.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-6 py-3 border border-sage text-sage font-semibold rounded-full hover:bg-sage/10 transition-colors"
          >
            <Compass className="h-4 w-4" />
            Explorer les lieux
          </Link>
        </div>
      </div>
    </div>
  );
}
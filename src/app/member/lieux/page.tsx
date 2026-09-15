import Link from "next/link";
import { ArrowLeft, Compass, Heart, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/member/FavoriteButton";
import { getMemberData } from "@/server/member-data";

export default async function MemberLieuxPage() {
  const member = await getMemberData();
  const favorites = member.preview ? [] : member.favorites;

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex items-center gap-3">
          <Link href="/member" aria-label="Retour à l’espace membre" className="rounded-full p-2 text-stone hover:bg-neutral-100"><ArrowLeft className="h-5 w-5" /></Link>
          <div><h1 className="flex items-center gap-2 text-2xl font-bold text-charcoal"><Heart className="h-6 w-6 text-red-400" />Mes favoris</h1><p className="text-sm text-stone">{favorites.length} lieu{favorites.length > 1 ? "x" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}</p></div>
        </header>
        {favorites.length === 0 ? (
          <Card className="space-y-4 py-12 text-center"><Compass className="mx-auto h-12 w-12 text-stone/30" /><div><p className="font-medium text-stone">Aucun favori pour l’instant</p><p className="mt-1 text-sm text-stone/60">Ajoutez vos lieux depuis la MAP.</p></div><Link href="/member/map"><Button variant="primary" size="sm">Explorer la MAP</Button></Link></Card>
        ) : (
          <div className="space-y-3">
            {favorites.map(({ place }) => (
              <Card key={place.id} variant="interactive" className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link href={`/lieux/${place.slug}`} className="flex min-w-0 flex-1 items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sage/10"><MapPin className="h-6 w-6 text-sage" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-charcoal">{place.name}</span><span className="block truncate text-xs text-stone">{place.city}, {place.region}</span>{place.discountPercent ? <span className="mt-1 block text-xs font-bold text-amber">Avantage membre : −{place.discountPercent}%</span> : <span className="mt-1 block text-xs text-stone">Voir l’avantage sur la fiche</span>}</span></Link>
                <FavoriteButton slug={place.slug} initialFavorite compact />
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

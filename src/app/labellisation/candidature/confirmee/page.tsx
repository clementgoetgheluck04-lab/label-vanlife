"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CreditCard, ExternalLink, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const SHARE_MESSAGE = `🚐🌿 Bonne nouvelle pour les vanlifers !

Nous venons de postuler au Label Vanlife, le 1er réseau de lieux van-friendly labellisé en France.

👉 Un réseau qui met en avant des lieux accueillants pour les voyageurs en van, dans le respect et la simplicité.

🎟️ Les membres Label Vanlife pourront bientôt profiter d'avantages exclusifs et de réductions sur leurs séjours chez nous et dans les lieux labellisés partout en France.

On vous tient au courant très vite 🤙

🔎 À suivre sur : www.labelvanlife.com
👍 Notre page Facebook : www.facebook.com/labelvanlife

#LabelVanlife #Vanlife #VanlifeFrance #RoadtripFrance #VoyageEnVan`;

const encodedMessage = encodeURIComponent(SHARE_MESSAGE);
const shareLinks = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://labelvanlife.com")}&quote=${encodedMessage}`,
  whatsapp: `https://wa.me/?text=${encodedMessage}`,
  twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
};

type Confirmation = { establishmentName: string; email: string; draftId: string };

export default function CandidatureConfirmeePage() {
  const [confirmation, setConfirmation] = useState<Confirmation>({ establishmentName: "votre établissement", email: "votre adresse email", draftId: "" });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const saved = sessionStorage.getItem("labellisation-confirmation");
      if (!saved) return;
      try { setConfirmation(JSON.parse(saved) as Confirmation); } catch { /* conserver le texte générique */ }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f1e8] via-white to-white px-4 pb-20 pt-28">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"><Check className="h-10 w-10 text-emerald-600" /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7445]">Dossier enregistré</p>
          <h1 className="mt-3 text-4xl font-bold text-neutral-900 sm:text-5xl">Candidature confirmée !</h1>
          <p className="mt-5 text-lg text-neutral-600">Félicitations <strong className="text-neutral-900">{confirmation.establishmentName}</strong> !</p>
          <p className="mt-1 text-neutral-500">Votre demande de labellisation au Label Vanlife est bien enregistrée.</p>
        </header>

        <Card className="border-[#c39960]/20 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-neutral-900">Prochaines étapes :</h2>
          <ol className="mt-5 space-y-5">
            {[
              "Finalisez le paiement sécurisé pour lancer l'étude du dossier",
              "Votre fiche est créée à partir des informations fournies",
              "Email sous 72h avec un lien vers votre fiche pour validation",
              "Votre kit Label Vanlife (stickers + plaque) est expédié après validation",
            ].map((item, index) => <li key={item} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c39960] text-sm font-bold text-white">{index + 1}</span><span className="pt-1 text-neutral-700">{item}</span></li>)}
          </ol>
          <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Une confirmation immédiate a été envoyée à <strong>{confirmation.email}</strong>. Pensez à vérifier les courriers indésirables.</p>
          <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="text-xs font-bold uppercase tracking-wider text-[#dfc59f]">Offre jusqu'au 31 décembre 2026</p><p className="mt-2"><span className="mr-2 text-white/35 line-through">220 €</span><strong className="text-2xl">110 €</strong> <span className="text-sm text-white/50">paiement unique</span></p><p className="mt-1 text-xs text-white/55">Remboursé intégralement si le dossier est déclaré non conforme.</p></div><Link href="/labellisation/paiement" className="mt-5 block shrink-0 sm:mt-0"><Button variant="cta"><CreditCard className="h-4 w-4" /> Finaliser et payer</Button></Link></div>
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="flex items-start gap-4"><span className="text-3xl" aria-hidden="true">📘</span><div><h2 className="text-xl font-bold text-neutral-900">Rejoignez-nous sur Facebook</h2><p className="mt-2 text-neutral-500">Suivez Label Vanlife sur Facebook pour ne rien manquer : actualités, conseils et mise en avant des partenaires.</p></div></div>
          <a href="https://www.facebook.com/labelvanlife" target="_blank" rel="noreferrer" className="mt-6 inline-flex"><Button variant="cta"><span className="font-black" aria-hidden="true">f</span> Suivre Label Vanlife <ExternalLink className="h-4 w-4" /></Button></a>
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="flex items-start gap-4"><Share2 className="mt-1 h-6 w-6 text-[#c39960]" /><div><h2 className="text-xl font-bold text-neutral-900">📣 Partagez la nouvelle !</h2><p className="mt-2 text-neutral-500">Faites savoir à vos vanlifers que vous avez candidaté au Label Vanlife.</p></div></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={shareLinks.facebook} target="_blank" rel="noreferrer"><Button variant="secondary"><span className="font-black" aria-hidden="true">f</span> Facebook</Button></a>
            <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer"><Button variant="secondary"><MessageCircle className="h-4 w-4" /> WhatsApp</Button></a>
            <a href={shareLinks.twitter} target="_blank" rel="noreferrer"><Button variant="secondary">𝕏 X / Twitter</Button></a>
          </div>
        </Card>

        <div className="text-center"><Link href="/"><Button variant="ghost">Retour à l'accueil</Button></Link></div>
      </div>
    </main>
  );
}

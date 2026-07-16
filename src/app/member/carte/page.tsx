"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Compass, QrCode, Download, ArrowLeft, Sparkles, Loader2, Mail, Phone, ShieldCheck, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type MemberCardView = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  level: string;
  points: number;
  cardNumber: string;
  offer: string;
  expiresAt?: string;
  people: Array<{
    firstName: string;
    lastName: string;
    age?: number;
    memberNumber: string;
  }>;
};

export default function MemberCardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [member, setMember] = useState<MemberCardView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        const response = await fetch("/api/auth/admin-preview", { cache: "no-store" });
        const preview = response.ok ? await response.json() as { active?: boolean } : {};
        if (preview.active) {
          setMember({
            firstName: "Clément",
            lastName: "Goetgheluck",
            email: "clement.goetgheluck@hotmail.fr",
            phone: "",
            level: "PRÉVISUALISATION",
            points: 0,
            cardNumber: "LV-ADMIN-PREVIEW",
            offer: "Démonstration",
            people: [{ firstName: "Clément", lastName: "Goetgheluck", memberNumber: "LV-ADMIN-01" }],
          });
          setLoading(false);
          return;
        }
        router.replace("/member-login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("firstName, lastName, phone, level, points")
        .eq("userId", user.id)
        .single();
      const { data: card } = await supabase
        .from("member_cards")
        .select("cardNumber")
        .eq("userId", user.id)
        .single();
      const { data: membership } = await supabase
        .from("memberships")
        .select("offer, status, expiresAt")
        .eq("userId", user.id)
        .single();

      if (!card?.cardNumber || membership?.status !== "ACTIVE") {
        setMember(null);
        setLoading(false);
        return;
      }

      setMember({
        firstName: profile?.firstName || user.email?.split("@")[0],
        lastName: profile?.lastName || String(user.user_metadata?.lastName || ""),
        email: user.email || "",
        phone: profile?.phone || String(user.user_metadata?.phone || ""),
        level: profile?.level || "EXPLORATEUR",
        points: profile?.points || 0,
        cardNumber: card.cardNumber,
        offer: membership?.offer === "YEARLY" ? "Annuel" : "Mensuel",
        expiresAt: membership?.expiresAt,
        people: [{
          firstName: profile?.firstName || String(user.user_metadata?.firstName || user.email?.split("@")[0] || "Membre"),
          lastName: profile?.lastName || String(user.user_metadata?.lastName || ""),
          memberNumber: `${card.cardNumber}-01`,
        }],
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Carte indisponible</h1>
          <p className="mt-2 text-sm text-neutral-500">Aucune carte active n’est associée à ce compte.</p>
          <Link href="/devenir-membre"><Button className="mt-4">Découvrir l’offre membre</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white px-4 py-8 pb-24">
      <div className="max-w-md mx-auto space-y-8">
        {/* Back */}
        <Link href="/member" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au dashboard
        </Link>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <Sparkles className="h-7 w-7 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>
            Ma carte membre
          </h1>
          <p className="text-sm text-neutral-500">
            Présente cette carte chez les établissements partenaires pour bénéficier de tes réductions.
          </p>
        </div>

        {/* Digital Card */}
        <div
          className="relative h-[240px] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 p-6 text-white shadow-xl shadow-emerald-500/20 transition-all duration-500 hover:shadow-2xl"
          style={{ transform: "perspective(800px)", transformStyle: "preserve-3d" }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
          }}
        >
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 font-mono tracking-widest">
                  {member.cardNumber}
                </p>
                <p className="text-xs text-white/60 mt-0.5">
                  Abonnement {member.offer}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-white/20 rounded-full text-[10px] uppercase tracking-wider font-medium border border-white/30">
                  {member.level}
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-0.5 text-center">
              <p className="text-3xl font-bold tracking-widest drop-shadow-sm">
                {[member.firstName, member.lastName].filter(Boolean).join(" ").toUpperCase()}
              </p>
              <p className="text-sm text-white/70 font-serif italic">
                Membre Label Vanlife
              </p>
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-white/60" />
                <span className="text-xs text-white/50">
                  {member.level} · {member.points} pts
                </span>
              </div>
              <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="h-10 w-10 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-emerald-100/70 p-0">
          <div className="flex items-center gap-3 border-b border-neutral-100 bg-emerald-50/50 px-5 py-4">
            <Users className="h-5 w-5 text-emerald-700" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Personnes présentes et couvertes</h2>
              <p className="text-xs text-neutral-500">Chaque personne dispose de son propre numéro.</p>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {member.people.map((person, index) => (
              <div key={person.memberNumber} className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <UserRound className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{person.firstName} {person.lastName}</p>
                  <p className="text-xs text-neutral-500">{person.age ? `${person.age} ans` : "Âge à renseigner"} · {index === 0 ? "Titulaire" : "Accompagnant"}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-neutral-100 px-2.5 py-1.5 font-mono text-[10px] font-semibold text-neutral-600">{person.memberNumber}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 border-emerald-100/70 p-5">
          <h2 className="text-sm font-bold text-neutral-900">Coordonnées du titulaire</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">{member.phone || "Téléphone portable à renseigner"}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">Utilisable uniquement par le lieu pour vous prévenir en cas de problème sur place.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3.5">
              <Mail className="h-5 w-5 shrink-0 text-emerald-700" />
              <p className="break-all text-sm font-semibold text-neutral-900">{member.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs leading-relaxed text-emerald-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            Ces informations servent uniquement à vérifier la carte et à assurer votre sécurité pendant le séjour.
          </div>
        </Card>

        {/* Info */}
        <Card className="p-5 space-y-3 border-emerald-100/50">
          <h2 className="text-sm font-semibold text-neutral-900">Comment utiliser ta carte</h2>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Présente ta carte chez un établissement labellisé</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Scanne le QR code ou montre ton numéro de membre</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Profite de tes réductions exclusives jusqu&apos;à -20%</span>
            </li>
          </ul>
        </Card>

        {/* Download */}
        <Button variant="secondary-dark" size="lg" className="w-full gap-2" disabled>
          <Download className="h-5 w-5" />
          Télécharger la carte (bientôt)
        </Button>
      </div>
    </div>
  );
}

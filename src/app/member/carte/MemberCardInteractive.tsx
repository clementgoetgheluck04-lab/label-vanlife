"use client";

import { useState } from "react";
import { ChevronDown, Compass, Download, ShieldCheck, Users } from "lucide-react";

export type MemberCardPerson = { name: string; number: string; role: string };

type MemberCardInteractiveProps = {
  cardNumber: string;
  year: number;
  fullName: string;
  level: string;
  points: number;
  people: MemberCardPerson[];
};

export function MemberCardInteractive(props: MemberCardInteractiveProps) {
  const [expanded, setExpanded] = useState(false);

  const downloadCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 760;
    const context = canvas.getContext("2d");
    if (!context) return;

    const gradient = context.createLinearGradient(0, 0, 1400, 760);
    gradient.addColorStop(0, "#3f7b60");
    gradient.addColorStop(1, "#173e32");
    context.fillStyle = gradient;
    context.roundRect(0, 0, 1400, 760, 56);
    context.fill();
    context.fillStyle = "rgba(255,255,255,0.10)";
    context.beginPath();
    context.arc(1250, 50, 260, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "600 28px Arial, sans-serif";
    context.fillText(`LABEL VANLIFE ${props.year}`, 70, 82);
    context.font = "24px monospace";
    context.fillStyle = "rgba(255,255,255,0.78)";
    context.fillText(props.cardNumber, 70, 122);
    context.fillStyle = "rgba(255,255,255,0.18)";
    context.roundRect(1170, 55, 150, 54, 27);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = "700 22px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("ACTIVE", 1245, 90);
    context.textAlign = "left";

    context.font = "700 48px Arial, sans-serif";
    context.fillText(props.fullName.toLocaleUpperCase("fr"), 70, 205);
    context.font = "24px Arial, sans-serif";
    context.fillStyle = "rgba(255,255,255,0.78)";
    context.fillText("Carte membre personnelle", 70, 244);
    context.strokeStyle = "rgba(255,255,255,0.18)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(70, 285);
    context.lineTo(1330, 285);
    context.stroke();

    context.fillStyle = "#ffffff";
    context.font = "700 25px Arial, sans-serif";
    context.fillText("PERSONNES COUVERTES", 70, 340);
    context.font = "25px Arial, sans-serif";
    props.people.forEach((person, index) => {
      const y = 390 + index * 54;
      context.fillStyle = "#ffffff";
      context.fillText(person.name, 70, y);
      context.fillStyle = "rgba(255,255,255,0.68)";
      context.font = "20px Arial, sans-serif";
      context.fillText(`${person.role} · ${person.number}`, 70, y + 27);
      context.font = "25px Arial, sans-serif";
    });

    context.fillStyle = "rgba(255,255,255,0.10)";
    context.roundRect(760, 340, 570, 220, 28);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = "700 25px Arial, sans-serif";
    context.fillText("CARTE DE PRÉSENTATION", 805, 402);
    context.font = "23px Arial, sans-serif";
    context.fillStyle = "rgba(255,255,255,0.82)";
    context.fillText("Identité, personnes couvertes,", 805, 454);
    context.fillText("numéro, statut et validité uniquement.", 805, 492);
    context.font = "20px Arial, sans-serif";
    context.fillStyle = "rgba(255,255,255,0.62)";
    context.fillText("Aucune coordonnée personnelle exportée.", 805, 535);
    context.fillStyle = "rgba(255,255,255,0.72)";
    context.font = "22px Arial, sans-serif";
    context.fillText(`${props.level} · ${props.points} pts`, 70, 700);
    context.textAlign = "right";
    context.fillText(`Valable jusqu’au 31 décembre ${props.year}`, 1330, 700);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `carte-membre-label-vanlife-${props.cardNumber}.png`;
      link.click();
      URL.revokeObjectURL(href);
    }, "image/png");
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-sage to-forest p-6 text-left text-white shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage/30">
        <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span className="relative block space-y-6">
          <span className="flex justify-between gap-3"><span><span className="block text-xs uppercase tracking-[0.18em] text-white/70">Label Vanlife {props.year}</span><span className="mt-1 block font-mono text-xs">{props.cardNumber}</span></span><span className="h-fit rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Active</span></span>
          <span><span className="block text-2xl font-bold uppercase tracking-wide">{props.fullName}</span><span className="mt-1 block text-sm text-white/75">Membre Label Vanlife</span></span>
          {expanded ? <span className="block space-y-5 border-t border-white/15 pt-5"><span className="block"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/65"><Users className="h-4 w-4" /> Personnes couvertes</span><span className="mt-3 block space-y-2">{props.people.map((person) => <span key={person.number} className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold">{person.name}</span><span className="font-mono text-[10px] text-white/60">{person.number}</span></span>)}</span></span><span className="flex items-start gap-2 rounded-2xl bg-black/10 p-4 text-xs leading-5 text-white/75"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><span>Cette carte de présentation ne montre ni votre email, ni votre téléphone, ni votre adresse postale.</span></span></span> : null}
          <span className="flex items-end justify-between gap-4 text-xs text-white/70"><span className="flex items-center gap-2"><Compass className="h-4 w-4" />{props.level} · {props.points} pts</span><span className="flex items-center gap-1 font-semibold text-white">Voir les informations <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} /></span></span>
        </span>
      </button>
      <button type="button" onClick={downloadCard} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-sage px-5 text-sm font-bold text-sage hover:bg-sage/10"><Download className="h-5 w-5" /> Télécharger ma carte sans coordonnées privées</button>
    </div>
  );
}

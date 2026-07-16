"use client";

import { useState, useCallback } from "react";
import {
  Sparkles,
  Send,
  MapPin,
  Calendar,
  Euro,
  Compass,
  Save,
  Map,
  ArrowRight,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ROADTRIPS } from "@/data/mock-roadtrips";
import type { RoadTrip, RoadTripEtape } from "@/lib/types";

type VoyageStyle = "nature" | "culture" | "farniente" | "aventure";

interface FormState {
  description: string;
  depart: string;
  duree: number;
  budget: number;
  style: VoyageStyle | "";
}

const STYLE_OPTIONS: { value: VoyageStyle; label: string; emoji: string }[] = [
  { value: "nature", label: "Nature", emoji: "🌲" },
  { value: "culture", label: "Culture", emoji: "🏛️" },
  { value: "farniente", label: "Farniente", emoji: "☀️" },
  { value: "aventure", label: "Aventure", emoji: "🏔️" },
];

export default function IaAssistant() {
  const [form, setForm] = useState<FormState>({
    description: "",
    depart: "",
    duree: 7,
    budget: 500,
    style: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadTrip | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setShowResult(false);

    // Simulate IA generation with the Bretagne road trip as template
    setTimeout(() => {
      const template = MOCK_ROADTRIPS[0]; // Bretagne
      const generated: RoadTrip = {
        ...template,
        id: `roadtrip-ia-${Date.now()}`,
        titre: form.description
          ? `Road Trip : ${form.description.slice(0, 50)}${form.description.length > 50 ? "…" : ""}`
          : `Road Trip en ${form.depart || "France"} — ${form.duree} jours d'aventure`,
        description: `Un road trip généré par l'IA selon vos envies : ${form.description || "voyage sur mesure"}. Départ ${form.depart || "à définir"}, pour ${form.duree} jours de découverte.`,
        duree: form.duree,
        budget: form.budget,
        tags: [
          ...(form.style ? [form.style] : []),
          ...(form.depart ? [form.depart.toLowerCase()] : []),
          "ia",
          "sur-mesure",
        ],
        etapes: template.etapes.map((e, i) => ({
          ...e,
          notes: e.notes
            ? `📍 Étape adaptée à votre voyage — ${e.notes}`
            : `📍 Découverte personnalisée — jour ${e.jour}`,
        })),
        created_at: new Date().toISOString().split("T")[0],
      };
      setResult(generated);
      setLoading(false);
      setShowResult(true);
    }, 2000);
  }, [form]);

  const resetForm = useCallback(() => {
    setForm({
      description: "",
      depart: "",
      duree: 7,
      budget: 500,
      style: "",
    });
    setResult(null);
    setShowResult(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Chat-style assistant */}
      <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-sage to-sage-dark p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                Assistant Road Trip IA
              </h3>
              <p className="text-white/70 text-xs">
                Décris ton voyage idéal, je construis l&apos;itinéraire
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Message from assistant */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-sage" />
            </div>
            <div className="bg-cream rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
              <p className="text-sm text-charcoal">
                Bonjour ! Raconte-moi le voyage de tes rêves. Où veux-tu partir ?
                Combien de temps ? Quel budget ? Je construis un road trip sur
                mesure pour toi. 🚐
              </p>
            </div>
          </div>

          {/* User response area */}
          <div className="flex gap-3 justify-end">
            <div className="bg-sage text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] space-y-3">
              {/* Text input */}
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Décris ton voyage idéal…"
                className="w-full bg-transparent text-white placeholder-white/50 text-sm resize-none focus:outline-none min-h-[60px]"
                rows={2}
              />

              {/* Structured fields */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-2">
                  <MapPin className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <input
                    value={form.depart}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, depart: e.target.value }))
                    }
                    placeholder="Départ"
                    className="w-full bg-transparent text-white placeholder-white/40 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-2">
                  <Calendar className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <input
                    type="number"
                    value={form.duree}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        duree: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    placeholder="Durée (jours)"
                    className="w-full bg-transparent text-white placeholder-white/40 text-xs focus:outline-none"
                    min={1}
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-2">
                  <Euro className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        budget: Math.max(50, parseInt(e.target.value) || 50),
                      }))
                    }
                    placeholder="Budget (€)"
                    className="w-full bg-transparent text-white placeholder-white/40 text-xs focus:outline-none"
                    min={50}
                    step={50}
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-2">
                  <Compass className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <select
                    value={form.style}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        style: e.target.value as VoyageStyle,
                      }))
                    }
                    className="w-full bg-transparent text-white text-xs focus:outline-none appearance-none"
                  >
                    <option value="" className="text-charcoal">
                      Style…
                    </option>
                    {STYLE_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value} className="text-charcoal">
                        {s.emoji} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-sage" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
              disabled={loading}
            >
              Réinitialiser
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerate}
              loading={loading}
              disabled={loading || (!form.description && !form.depart)}
            >
              {loading ? (
                "Génération…"
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer mon road trip
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 bg-cream rounded-xl border border-border/30">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-stone">L&apos;IA construit votre road trip idéal…</span>
        </div>
      )}

      {/* Generated result */}
      {showResult && result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
          {/* IA response message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-sage" />
            </div>
            <div className="bg-cream rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
              <p className="text-sm text-charcoal font-medium mb-1">
                ✨ Voici votre road trip personnalisé !
              </p>
              <p className="text-xs text-stone">
                Un itinéraire de <strong>{result.duree} jours</strong> pour{" "}
                <strong>{result.budget}€</strong> —{" "}
                {result.etapes.length} étapes à découvrir.
              </p>
            </div>
          </div>

          {/* Result card with timeline */}
          <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-border/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-charcoal text-base leading-snug">
                    {result.titre}
                  </h4>
                  <p className="text-xs text-stone mt-1 line-clamp-2">
                    {result.description}
                  </p>
                </div>
                <Badge variant="premium" className="shrink-0">
                  <Sparkles className="h-3 w-3" />
                  IA
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 mt-3 text-xs text-stone">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-sage" /> {result.duree} jours
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-sage" /> {result.distance} km
                </span>
                <span className="flex items-center gap-1">
                  <Euro className="h-3.5 w-3.5 text-sage" /> {result.budget}€
                </span>
              </div>
            </div>

            {/* Mini timeline */}
            <div className="p-4 sm:p-5 space-y-3">
              {result.etapes.map((etape, index) => (
                <div key={etape.ordre} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-6 h-6 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-sage">
                        {etape.ordre}
                      </span>
                    </div>
                    {index < result.etapes.length - 1 && (
                      <div className="w-0.5 flex-1 bg-sage/15 min-h-[20px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-sage shrink-0" />
                      <span className="text-xs font-medium text-charcoal truncate">
                        {etape.lieuId}
                      </span>
                      <span className="text-[10px] text-stone shrink-0">
                        (Jour {etape.jour})
                      </span>
                    </div>
                    <p className="text-[11px] text-stone mt-0.5 line-clamp-1">
                      {etape.activites.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="p-4 sm:p-5 pt-0 flex flex-wrap gap-2">
              <Button variant="primary" size="sm">
                <Save className="h-3.5 w-3.5" />
                Sauvegarder
              </Button>
              <Button variant="secondary-dark" size="sm" asChild>
                <a href={`/road-trips/${result.id}`}>
                  <Map className="h-3.5 w-3.5" />
                  Ouvrir dans la carte
                  <ArrowRight className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
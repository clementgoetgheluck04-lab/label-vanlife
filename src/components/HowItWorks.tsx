"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    text: "Label Vanlife a changé notre façon de voyager. On découvre des villages qu'on n'aurait jamais visités et on est accueillis comme à la maison.",
    author: "Hélène, Family Vanlifers",
  },
  {
    text: "Plus de stress, plus de mauvaises surprises. La carte nous ouvre des portes partout en France.",
    author: "Thomas, Vanlifer solo",
  },
];

export default function HowItWorks() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Je prends ma carte",
      description:
        "La carte membre est au tarif unique de 39€, actuellement proposée à 29€ pour cette année. Accès immédiat à tous les avantages.",
    },
    {
      number: "02",
      title: "Je trouve un lieu",
      description:
        "Sur la carte interactive privée, je repère les lieux labellisés avec leurs réductions. Je peux même planifier mon road trip étape par étape.",
    },
    {
      number: "03",
      title: "Je présente ma carte",
      description:
        "Sur place, je montre ma carte membre et j'obtiens 10 à 20% de réduction. La réduction peut aussi s'appliquer via un code fourni par le lieu lors de la réservation en ligne.",
    },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Simple & Authentique
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-charcoal">
            Comment ça marche
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
            >
              <span className="text-6xl font-black text-sage/10 absolute top-4 right-6 select-none">
                {step.number}
              </span>
              <div className="relative">
                <h3 className="text-xl font-bold text-charcoal mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage/80 transition-colors"
          >
            Ils en parlent mieux que nous {testimonialIndex + 1}
          </button>
          <div className="mt-4 max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-border/30">
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              &ldquo;{TESTIMONIALS[testimonialIndex].text}&rdquo;
            </p>
            <p className="text-xs font-semibold text-sage mt-3">
              — {TESTIMONIALS[testimonialIndex].author}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SpiritSection() {
  const values = [
    {
      title: "Liberté vraie",
      description:
        "Pas de réservation obligatoire. Tu arrives, tu montres ta carte, tu es le bienvenu — et tu bénéficies de réductions.",
    },
    {
      title: "Confiance mutuelle",
      description:
        "Les hôtes aiment la vanlife et t'accueillent en conséquence et en connaissance. Tu sais ce qui t'attend. Fini les mauvaises surprises.",
    },
    {
      title: "Authenticité",
      description:
        "Des lieux labellisés Label Vanlife, contrôlés par des vanlifers qui respectent la philosophie vanlife.",
    },
    {
      title: "Nuit tranquille",
      description:
        "Zéro parking sauvage. Zéro voisin mécontent. Juste le silence et les étoiles.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            L&apos;esprit Label Vanlife
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-charcoal leading-tight max-w-3xl mx-auto">
            Partir sans savoir où tu vas.
            <br />
            <span className="text-sage">MAIS</span> Savoir que tu seras bien accueilli.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-cream rounded-2xl p-6 border border-border/30 hover:border-sage/30 transition-colors"
            >
              <h3 className="text-lg font-bold text-charcoal mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 text-muted-foreground">
          <p className="text-sm tracking-wide">
            — Des lieux qui t&apos;attendent · Des prix adaptés à la vanlife · Des hôtes qui comprennent ta façon de voyager
          </p>
          <p className="text-xl font-semibold text-sage">
            👉 Tu arrives. Tu montres ta carte. Tu es chez toi.
          </p>
          <p className="text-lg italic font-serif text-charcoal">La vanlife redevient simple.</p>
          <p className="text-xs tracking-[0.15em] uppercase text-sage font-semibold">Clément, Fondateur</p>
        </div>
      </div>
    </section>
  );
}
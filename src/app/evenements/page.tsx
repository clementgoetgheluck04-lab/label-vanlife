import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { CONTACT_MAILTO } from "@/config/contact";
import { VANLIFE_EVENTS, EVENT_POSTERS, EVENTS_CHECKED_AT, eventStatus, type VanlifeEvent } from "@/data/events";

export const dynamic = "force-dynamic";
const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
const dateLabel = (date: string) => dateFormat.format(new Date(date + "T12:00:00Z"));

function EventCard({ event, today }: { event: VanlifeEvent; today: string }) {
  const status = eventStatus(event, today);
  const poster = EVENT_POSTERS[event.id];
  return (
    <article className="flex h-full flex-col rounded-3xl border border-charcoal/10 bg-white p-6 sm:p-8">
      {poster ? <figure className="mb-6">
        <a href={poster.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage" aria-label={`Agrandir l’affiche officielle : ${event.name} (nouvel onglet)`}>
          <Image src={poster.src} alt={`Affiche officielle ${event.name} — du ${dateLabel(event.start)} au ${dateLabel(event.end)}, ${event.location}`} width={poster.width} height={poster.height} sizes="(max-width: 767px) calc(100vw - 96px), 416px" className="h-auto w-full object-contain" />
        </a>
        <figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-charcoal/75">
          <a href={poster.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Affiche officielle · {poster.credit}</a>
          <span>Cliquez pour agrandir</span>
        </figcaption>
      </figure> : <p className="mb-6 rounded-xl bg-cream p-4 text-sm text-charcoal/75">Consultez les visuels sur le site officiel de l’organisateur.</p>}
      <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-charcoal/75">
        {status === "past" ? "Édition passée" : event.provisional ? "Dates provisoires · à confirmer" : status === "ongoing" ? "En ce moment" : "Dates annoncées"}
      </p>
      <h3 className="text-2xl font-bold">{event.name}</h3>
      <p className="mt-4 flex items-start gap-2 text-sm font-semibold">
        <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Du <time dateTime={event.start}>{dateLabel(event.start)}</time> au <time dateTime={event.end}>{dateLabel(event.end)}</time></span>
      </p>
      <p className="mt-3 flex items-start gap-2 text-sm text-charcoal/80"><MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />{event.location}</p>
      <p className="mt-5 flex-1 text-sm leading-relaxed text-charcoal/80">{event.description}</p>
      {event.provisional ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">À confirmer auprès de l’organisateur avant toute réservation.</p> : null}
      <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-between gap-3 rounded-xl bg-charcoal px-4 py-3 text-sm font-semibold text-white hover:bg-charcoal/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage" aria-label={`Consulter le site officiel : ${event.name} (nouvel onglet)`}>
        Informations officielles <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </a>
    </article>
  );
}

export default function EvenementsPage() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const sorted = [...VANLIFE_EVENTS].sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = sorted.filter(event => eventStatus(event, today) !== "past");
  const past = sorted.filter(event => eventStatus(event, today) === "past");
  return (
    <div className="bg-cream text-charcoal">
      <header className="border-b border-charcoal/10 px-6 pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">L’agenda des voyageurs</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">La vanlife se rencontre aussi hors de la route.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/80">Salons, expositions et rendez-vous autour du voyage itinérant : des occasions de découvrir, d’échanger et de préparer la prochaine aventure. En van, en fourgon, en combi ou en camping-car, la curiosité nous rassemble.</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-charcoal/70">Une sélection indépendante et non exhaustive. Ces évènements ne sont ni organisés ni labellisés par Label Vanlife. L’agenda est accessible sans carte membre.</p>
        </div>
      </header>
      <section aria-labelledby="upcoming-events" className="mx-auto max-w-5xl px-6 py-14">
        <h2 id="upcoming-events" className="text-3xl font-bold">Les prochains rendez-vous</h2>
        <p className="mt-3 text-sm text-charcoal/75">Avant de partir, vérifiez les horaires, billets, conditions d’accès et possibilités de nuitée auprès de l’organisateur.</p>
        <p className="mb-8 mt-2 text-xs text-charcoal/65">Sources officielles consultées le {dateLabel(EVENTS_CHECKED_AT)}.</p>
        {upcoming.length ? <div className="grid gap-6 md:grid-cols-2">{upcoming.map(event => <EventCard key={event.id} event={event} today={today} />)}</div> : <p className="rounded-2xl bg-white p-6">Les prochaines dates restent à vérifier. Vous connaissez un rendez-vous ? Écrivez-nous ci-dessous.</p>}
        {past.length ? <details className="mt-10 rounded-2xl border border-charcoal/15 p-5"><summary className="cursor-pointer font-semibold">Éditions passées ({past.length})</summary><div className="mt-6 grid gap-6 md:grid-cols-2">{past.map(event => <EventCard key={event.id} event={event} today={today} />)}</div></details> : null}
        <aside className="mt-12 rounded-3xl bg-charcoal p-8 text-white sm:p-10">
          <h2 className="text-2xl font-bold">Un rassemblement à nous faire découvrir ?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">Rencontre de combis rétro, salon, exposition ou petit rendez-vous local : envoyez-nous les dates, le lieu et le lien officiel. Nous vérifions les informations avant publication.</p>
          <a href={CONTACT_MAILTO + "?subject=" + encodeURIComponent("Proposer un évènement pour l’agenda Label Vanlife")} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-charcoal hover:bg-white">Proposer un évènement ou une correction</a>
        </aside>
      </section>
    </div>
  );
}

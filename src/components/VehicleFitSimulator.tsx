"use client";

import { useState } from 'react';
import { suggestVehicleFormats, type VehicleNeeds } from '@/lib/vehicle-fit';

const questions: { key: keyof VehicleNeeds; title: string; choices: { value: string; label: string }[] }[] = [
  { key: 'crew', title: 'Qui voyage ?', choices: [{ value: 'solo-couple', label: 'Seul ou à deux' }, { value: 'family', label: 'Trois personnes ou plus' }] },
  { key: 'rhythm', title: 'Votre rythme préféré ?', choices: [{ value: 'moving', label: 'Changer régulièrement d’étape' }, { value: 'base', label: 'Rester plusieurs nuits dans un camping' }] },
  { key: 'comfort', title: 'Quel confort compte le plus ?', choices: [{ value: 'simple', label: 'Simple, vivre surtout dehors' }, { value: 'inside', label: 'Pouvoir vivre confortablement à l’intérieur' }] },
  { key: 'daily', title: 'Le même véhicule doit-il servir au quotidien ?', choices: [{ value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non, il peut être dédié aux voyages' }] },
  { key: 'retro', title: 'Le rétro est-il une vraie envie, avec son entretien ?', choices: [{ value: 'yes', label: 'Oui, je veux étudier un véhicule ancien' }, { value: 'no', label: 'Non, ce n’est pas une priorité' }] },
  { key: 'ladder', title: 'Un couchage accessible par une échelle vous convient-il ?', choices: [{ value: 'yes', label: 'Oui, je souhaite l’envisager' }, { value: 'no', label: 'Non, je préfère éviter' }] },
];

export function VehicleFitSimulator() {
  const [answers, setAnswers] = useState<Partial<VehicleNeeds>>({});
  const [result, setResult] = useState<ReturnType<typeof suggestVehicleFormats> | null>(null);
  const complete = questions.every(question => answers[question.key]);
  return <section id="simulateur" aria-labelledby="vehicle-fit-title" className="scroll-mt-28 rounded-3xl border border-[#294c3b]/30 bg-white p-6 sm:p-8">
    <h2 id="vehicle-fit-title" className="font-serif text-3xl">Quel véhicule pourrait vous correspondre ?</h2>
    <p className="mt-4 max-w-3xl leading-relaxed">Six questions pour faire ressortir deux formats à essayer. Ce simulateur d’orientation compare vos usages, pas des annonces : il ne certifie ni le budget, ni l’accessibilité, ni la capacité d’un véhicule précis.</p>
    <p className="mt-2 text-sm">Sans email. Les réponses restent dans cette page, ne sont ni transmises ni sauvegardées.</p>
    <form className="mt-6" onSubmit={event => { event.preventDefault(); if (complete) setResult(suggestVehicleFormats(answers as VehicleNeeds)); }}>
      <div className="grid gap-6 sm:grid-cols-2">{questions.map(question => <fieldset key={question.key} className="rounded-xl border border-charcoal/15 p-4"><legend className="px-1 font-semibold">{question.title}</legend>{question.choices.map(choice => <label key={choice.value} className="flex min-h-11 cursor-pointer items-start gap-3 py-2"><input required type="radio" name={question.key} value={choice.value} checked={answers[question.key] === choice.value} onChange={() => { setAnswers(previous => ({ ...previous, [question.key]: choice.value })); setResult(null); }} className="mt-1 h-4 w-4 accent-[#294c3b]" /><span>{choice.label}</span></label>)}</fieldset>)}</div>
      <p className="mt-4 text-sm">{Object.keys(answers).length} / 6 réponses</p>
      <div className="mt-4 flex flex-wrap gap-3"><button type="submit" disabled={!complete} className="min-h-11 rounded-full bg-[#294c3b] px-6 py-3 font-semibold text-white disabled:opacity-50">Voir mes deux pistes</button><button type="button" onClick={() => { setAnswers({}); setResult(null); }} className="min-h-11 rounded-full border border-charcoal/30 px-6 py-3">Recommencer</button></div>
    </form>
    <div aria-live="polite" aria-atomic="true">{result && <div className="mt-8 border-t border-charcoal/20 pt-6"><h3 className="font-serif text-2xl">Deux pistes à comparer, pas un verdict</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{result.map((format, index) => <article key={format.id} className="rounded-xl bg-cream p-5"><p className="text-sm">{index === 0 ? 'À explorer en premier' : 'Une alternative à essayer'}</p><h4 className="mt-2 text-xl font-bold">{format.name}</h4><p className="mt-3">{format.why}</p><p className="mt-3"><strong>Le compromis à vérifier :</strong> {format.check}</p></article>)}</div><p className="mt-5 leading-relaxed">Prochaine étape : louer ou essayer ces formats avec tout l’équipage. Fixez ensuite un budget total incluant achat, assurance, entretien et stockage. Pour trois voyageurs ou plus, vérifiez les places route et les couchages sur chaque modèle ; aucun format ne les garantit. Si vous avez des contraintes de mobilité, faites un essai d’accès et de couchage accompagné avant toute décision.</p><a href="#budget" className="mt-4 inline-block font-semibold underline underline-offset-4">Préparer le budget complet ↓</a></div>}</div>
  </section>;
}

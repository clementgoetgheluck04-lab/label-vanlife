export function labelEditionSummary(years: number[]) {
  const confirmed = [...new Set(years)].filter(Number.isInteger).sort((a, b) => a - b);
  const renewalPending = confirmed.includes(2026) && !confirmed.includes(2027);
  return {
    title: confirmed.length ? `Lieu labellisé ${confirmed.join(" et ")}` : "Millésime du label à vérifier",
    renewalPending,
    message: renewalPending
      ? "Ce lieu a été labellisé en 2026. Son renouvellement pour 2027 n’est pas encore confirmé. Aidez-nous à l’encourager à renouveler son label pour l’édition 2027. Les avantages 2027 ne sont pas garantis tant que le renouvellement n’est pas validé."
      : "",
  };
}

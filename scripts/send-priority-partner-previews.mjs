import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL;
const previewEmail = process.argv[2];

if (!apiKey || !from) {
  throw new Error("RESEND_API_KEY et RESEND_FROM_EMAIL sont requis.");
}

if (!previewEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(previewEmail)) {
  throw new Error("Indiquez une adresse de test valide.");
}

const resend = new Resend(apiKey);
const replyTo = "contact@labelvanlife.com";

function emailShell({ eyebrow, title, intro, body, details, ctaLabel, ctaHref, note }) {
  const rows = details.map(({ label, value }) => `
    <tr>
      <td style="padding:10px 0;color:#647067;font-size:13px;vertical-align:top;width:38%;">${label}</td>
      <td style="padding:10px 0;color:#1f2924;font-size:14px;font-weight:700;vertical-align:top;">${value}</td>
    </tr>`).join("");

  return `<!doctype html>
  <html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;background:#f3f0e8;font-family:Arial,Helvetica,sans-serif;color:#1f2924;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${intro}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f0e8;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dfe5df;box-shadow:0 8px 28px rgba(23,62,50,.08);">
          <tr><td style="background:#173e32;padding:28px 34px;">
            <div style="font-size:11px;letter-spacing:2px;font-weight:700;color:#d7c39a;">${eyebrow}</div>
            <h1 style="margin:12px 0 0;color:#ffffff;font-size:30px;line-height:1.15;">${title}</h1>
          </td></tr>
          <tr><td style="padding:32px 34px;">
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">Bonjour [Prénom / équipe],</p>
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">${intro}</p>
            ${body.map((paragraph) => `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;">${paragraph}</p>`).join("")}
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border-top:1px solid #e7ebe7;border-bottom:1px solid #e7ebe7;">${rows}</table>
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0 22px;"><tr><td style="border-radius:999px;background:#173e32;">
              <a href="${ctaHref}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">${ctaLabel}</a>
            </td></tr></table>
            <div style="padding:16px 18px;background:#edf3ef;border-left:4px solid #8fa978;border-radius:8px;color:#405047;font-size:13px;line-height:1.6;">${note}</div>
            <p style="margin:26px 0 0;font-size:15px;line-height:1.7;">Bien cordialement,<br><strong>L’équipe Label Vanlife</strong></p>
          </td></tr>
          <tr><td style="padding:20px 34px;background:#173e32;color:#c9d5cf;text-align:center;font-size:12px;line-height:1.6;">Label Vanlife · Le réseau des lieux qui accueillent les vanlifers responsables<br><a href="https://www.labelvanlife.fr" style="color:#ffffff;">labelvanlife.fr</a> · <a href="mailto:${replyTo}" style="color:#ffffff;">${replyTo}</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

const messages = [
  {
    subject: "[TEST PRIORITÉ 1 — MÉDIA] Et si l’on aidait les vanlifers à choisir des lieux où ils sont vraiment bien accueillis ?",
    text: `Bonjour [Prénom / rédaction],\n\nLabel Vanlife est un jeune label français qui identifie et valorise des établissements souhaitant accueillir les voyageurs en van dans de bonnes conditions.\n\nAprès une année 2026 consacrée au démarrage du réseau, nous préparons 2027 avec une ambition simple : faire grandir une vanlife plus responsable, mieux accueillie et plus utile aux territoires.\n\nNous aimerions vous proposer un échange éditorial sans engagement financier : découverte du projet, accès au parcours membre et aux lieux labellisés, puis possibilité d’un article, d’une interview ou d’un retour d’expérience en toute indépendance.\n\nSeriez-vous disponible pour un échange de 20 minutes ?\n\nL’équipe Label Vanlife`,
    html: emailShell({
      eyebrow: "TEST À VALIDER · MÉDIA VANLIFE",
      title: "Une autre manière d’accueillir les vanlifers",
      intro: "Label Vanlife est un jeune label français qui identifie et valorise des établissements souhaitant accueillir les voyageurs en van dans de bonnes conditions.",
      body: [
        "Après une année 2026 consacrée au démarrage du réseau, nous préparons 2027 avec une ambition simple : faire grandir une vanlife plus responsable, mieux accueillie et plus utile aux territoires.",
        "Nous aimerions vous faire découvrir le projet, vous ouvrir le parcours membre et recueillir votre regard. Selon votre ligne éditoriale, cela pourrait devenir un article, une interview ou un retour d’expérience réalisé en toute indépendance.",
      ],
      details: [
        { label: "Proposition", value: "Découverte éditoriale et test du service" },
        { label: "Format possible", value: "Article, interview ou retour terrain" },
        { label: "Engagement financier", value: "Aucun" },
      ],
      ctaLabel: "Échanger 20 minutes",
      ctaHref: `mailto:${replyTo}?subject=Partenariat%20m%C3%A9dia%20Label%20Vanlife%202027`,
      note: "Il ne s’agit pas d’une demande de publicité payante : nous proposons d’abord une découverte éditoriale libre et transparente.",
    }),
  },
  {
    subject: "[TEST PRIORITÉ 1 — CRÉATEUR] Testez Label Vanlife sur la route en toute indépendance",
    text: `Bonjour [Prénom],\n\nNous suivons votre travail autour de la vanlife pratique, responsable et vécue sur le terrain. Cette approche correspond profondément à la philosophie de Label Vanlife.\n\nNous identifions des lieux où les voyageurs en van peuvent être accueillis avec respect et bénéficier d’avantages clairement annoncés. Après notre démarrage en 2026, nous souhaitons confronter l’expérience 2027 au regard de personnes qui connaissent réellement la vie en van.\n\nNous vous proposons un accès test gratuit, sans obligation de publication. Vous pourrez évaluer la MAP, les fiches, les avantages et l’accueil sur place, puis nous dire franchement ce qui fonctionne ou doit évoluer.\n\nSouhaitez-vous découvrir le projet ?\n\nL’équipe Label Vanlife`,
    html: emailShell({
      eyebrow: "TEST À VALIDER · CRÉATEUR VANLIFE",
      title: "Votre regard de terrain peut faire progresser le Label",
      intro: "Nous suivons votre travail autour de la vanlife pratique, responsable et vécue sur le terrain. Cette approche correspond profondément à la philosophie de Label Vanlife.",
      body: [
        "Nous identifions des lieux où les voyageurs en van peuvent être accueillis avec respect et bénéficier d’avantages clairement annoncés.",
        "Après notre démarrage en 2026, nous souhaitons confronter l’expérience 2027 au regard de personnes qui connaissent réellement la vie en van. Nous vous proposons donc un accès test gratuit, sans obligation de publication.",
      ],
      details: [
        { label: "À tester", value: "MAP, fiches, avantages et accueil" },
        { label: "Ce que nous attendons", value: "Un retour honnête et concret" },
        { label: "Publication", value: "Aucune obligation" },
      ],
      ctaLabel: "Découvrir le projet",
      ctaHref: `mailto:${replyTo}?subject=Test%20cr%C3%A9ateur%20Label%20Vanlife%202027`,
      note: "Aucune contrepartie financière, aucun texte imposé et aucune obligation de parler du Label.",
    }),
  },
  {
    subject: "[TEST PRIORITÉ 1 — LOUEUR] Un pilote local pour mieux orienter vos voyageurs en van",
    text: `Bonjour [Prénom / agence],\n\nVos clients savent où louer leur van. Leur première inquiétude reste souvent de savoir où passer la nuit en étant réellement bien accueillis.\n\nLabel Vanlife développe un réseau de lieux identifiés, avec des informations pratiques, des engagements d’accueil et des avantages destinés aux membres. Nous souhaitons tester ce service avec deux ou trois agences de location volontaires.\n\nLe principe : un pilote local de 90 jours, un lien et un QR code dédiés remis aux voyageurs, aucun engagement financier et un bilan chiffré partagé à la fin du test.\n\nSeriez-vous disponible pour étudier ce pilote ?\n\nL’équipe Label Vanlife`,
    html: emailShell({
      eyebrow: "TEST À VALIDER · LOUEUR DE VANS",
      title: "Aidez vos voyageurs à trouver des lieux où ils sont les bienvenus",
      intro: "Vos clients savent où louer leur van. Leur première inquiétude reste souvent de savoir où passer la nuit en étant réellement bien accueillis.",
      body: [
        "Label Vanlife développe un réseau de lieux identifiés, avec des informations pratiques, des engagements d’accueil et des avantages destinés aux membres.",
        "Nous recherchons deux ou trois agences volontaires pour expérimenter un dispositif très simple : un lien et un QR code dédiés transmis avant le départ, puis un bilan commun après 90 jours.",
      ],
      details: [
        { label: "Durée du pilote", value: "90 jours" },
        { label: "Mise en place", value: "Lien ou QR code dédié" },
        { label: "Coût et exclusivité", value: "Aucun" },
      ],
      ctaLabel: "Étudier le pilote",
      ctaHref: `mailto:${replyTo}?subject=Pilote%20loueur%20Label%20Vanlife%202027`,
      note: "Nous commençons volontairement à petite échelle afin de mesurer l’utilité réelle pour les voyageurs et pour l’agence.",
    }),
  },
  {
    subject: "[TEST PRIORITÉ 1 — PLATEFORME] Compléter la location entre particuliers par un accueil vérifié",
    text: `Bonjour [Prénom / équipe partenariats],\n\nUne location réussie ne s’arrête pas à la remise des clés : les voyageurs doivent aussi trouver des étapes où leur présence est comprise et bien accueillie.\n\nLabel Vanlife identifie des établissements engagés dans cet accueil et propose aux membres une MAP, des fiches pratiques et des avantages annoncés. Nous souhaiterions imaginer avec vous un test complémentaire au parcours de location entre particuliers.\n\nNous proposons un pilote de 90 jours : contenu pratique ou lien dédié dans le parcours voyageur, mesure des consultations et retours d’usage, sans frais ni transmission de données personnelles.\n\nPouvons-nous vous présenter le dispositif ?\n\nL’équipe Label Vanlife`,
    html: emailShell({
      eyebrow: "TEST À VALIDER · PLATEFORME DE LOCATION",
      title: "Après les clés, aider le voyageur à choisir ses étapes",
      intro: "Une location réussie ne s’arrête pas à la remise des clés : les voyageurs doivent aussi trouver des étapes où leur présence est comprise et bien accueillie.",
      body: [
        "Label Vanlife identifie des établissements engagés dans cet accueil et propose aux membres une MAP, des fiches pratiques et des avantages annoncés.",
        "Nous souhaiterions imaginer avec vous un test complémentaire au parcours de location entre particuliers : un contenu pratique ou un lien dédié, puis une mesure transparente de son utilisation.",
      ],
      details: [
        { label: "Expérimentation", value: "90 jours" },
        { label: "Mesure", value: "Consultations et retours d’usage" },
        { label: "Données personnelles", value: "Aucun partage" },
      ],
      ctaLabel: "Voir le dispositif",
      ctaHref: `mailto:${replyTo}?subject=Pilote%20plateforme%20Label%20Vanlife%202027`,
      note: "Le test est sans frais, sans exclusivité et conçu pour compléter votre service, sans interférer avec la relation entre propriétaires et locataires.",
    }),
  },
];

const results = await Promise.all(messages.map((message) => resend.emails.send({
  from,
  to: previewEmail,
  replyTo,
  ...message,
})));

const failures = results.filter((result) => result.error);
for (const [index, result] of results.entries()) {
  if (result.error) console.log(`Email ${index + 1}: échec (${result.error.message})`);
  else console.log(`Email ${index + 1}: envoyé (${result.data?.id || "id indisponible"})`);
}

if (failures.length) process.exitCode = 1;

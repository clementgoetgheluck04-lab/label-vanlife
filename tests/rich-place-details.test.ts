import assert from "node:assert/strict";
import test from "node:test";
import { getRichPlaceDetails } from "../src/data/rich-place-details.ts";

test("la fiche enrichie du Camping de Pont Augan contient les informations actualisées", () => {
  const details = getRichPlaceDetails("camping-de-pont-augan");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.contactName, "Cathy Léon — propriétaire");
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("32 emplacements"));
  assert.ok(details.vanSpecifics?.includes("électricité 10A"));
  assert.ok(details.venueQuote?.includes("Irlande"));
  assert.ok(details.opening?.includes("1er avril au 11 octobre"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.equal(details.reservationUrl, "https://online.resa-booking.com/front/list.php?id_est=1617&lang=fr");
  assert.equal(details.tourismUrl, "https://camping-pontaugan.fr/tourisme/");
});

test("la fiche enrichie du Camping Le Verger contient toutes les informations validées", () => {
  const details = getRichPlaceDetails("camping-le-verger");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.match(details.displayAddress ?? "", /17139 Dompierre-sur-Mer/);
  assert.equal(details.discountInstructions?.length, 2);
  assert.equal(details.vanliferExperience?.length, 4);
  assert.ok(details.venueQuote);
  assert.ok(details.vanSpecifics);
  assert.ok(details.opening);
  assert.ok(details.dining);
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.match(details.reservationUrl ?? "", /^https:\/\//);
  assert.match(details.tourismUrl ?? "", /^https:\/\//);
});

test("la fiche enrichie de La Porte d'Autan contient l'offre et les informations de séjour", () => {
  const details = getRichPlaceDetails("eco-camping-la-porte-dautan");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.promoCode, "labelvanlife");
  assert.equal(details.discountInstructions?.length, 3);
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 8);
  assert.deepEqual(details.bookingMethods, ["En ligne", "Par email", "Par téléphone"]);
  assert.ok(details.venueQuote);
  assert.ok(details.otherInfo?.[0].includes("Éco-camping engagé"));
});

test("la fiche enrichie du Clos de la Lère contient la réduction et les services saisonniers", () => {
  const details = getRichPlaceDetails("camping-le-clos-de-la-lere");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.discountInstructions?.length, 2);
  assert.equal(details.openingMonths?.length, 9);
  assert.equal(details.activities?.length, 9);
  assert.equal(details.bookingMethods?.length, 4);
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.ok(details.swimming?.includes("juin à septembre"));
  assert.ok(details.dining?.includes("Snack"));
});

test("la fiche enrichie du Camping de l'Aix contient le gérant et les informations van", () => {
  const details = getRichPlaceDetails("camping-de-laix");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.match(details.contactName ?? "", /Olivier Bakanyi/);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 5);
  assert.deepEqual(details.bookingMethods, ["Par email", "Par téléphone", "Sur place"]);
  assert.ok(details.vanSpecifics?.includes("120 m²"));
  assert.ok(details.swimming?.includes("240 m²"));
  assert.ok(details.otherInfo?.[0].includes("animaux non acceptés"));
});

test("la fiche enrichie des Drouilhèdes contient la rivière et les labels environnementaux", () => {
  const details = getRichPlaceDetails("camping-les-drouihedes");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 7);
  assert.deepEqual(details.bookingMethods, ["En ligne", "Par email", "Par téléphone"]);
  assert.ok(details.vanSpecifics?.includes("plage privée"));
  assert.ok(details.swimming?.includes("La Cèze"));
  assert.ok(details.otherInfo?.[0].includes("Refuge LPO"));
});

test("la fiche enrichie de la Ferme Solidor précise qu'il s'agit d'un site de visite", () => {
  const details = getRichPlaceDetails("ferme-pedagogique-solidor");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.displayType, "Site de visite");
  assert.equal(details.openingMonths?.length, 12);
  assert.equal(details.activities?.length, 6);
  assert.ok(details.vanSpecifics?.includes("aucun hébergement van"));
  assert.equal(details.reservationLabel, "Réserver une visite");
  assert.match(details.reservationUrl ?? "", /^mailto:contact@fermedesolidor\.fr/);
});

test("la fiche enrichie du Flower Camping des Lacs contient les équipements du lac", () => {
  const details = getRichPlaceDetails("camping-des-lacs");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.displayType, "Camping 4 étoiles");
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 9);
  assert.deepEqual(details.bookingMethods, ["En ligne sur campingdeslacs.fr"]);
  assert.ok(details.vanSpecifics?.includes("56 emplacements"));
  assert.ok(details.swimming?.includes("28 °C"));
  assert.ok(details.otherInfo?.[0].includes("Qualidog"));
});

test("la fiche enrichie du Moulin du Bel-Air contient l'accueil van et VANLOT", () => {
  const details = getRichPlaceDetails("camping-le-moulin-du-bel-air");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.displayType, "Camping 3 étoiles");
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("120 m²"));
  assert.ok(details.swimming?.includes("15 mai au 15 septembre"));
  assert.ok(details.activities?.[0].includes("VANLOT"));
  assert.ok(details.otherInfo?.[0].includes("Tourisme Zéro Déchet"));
});

test("la fiche enrichie du Camping des Bains contient les services thermaux", () => {
  const details = getRichPlaceDetails("camping-des-bains");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.match(details.contactName ?? "", /Stéphane/);
  assert.equal(details.activities?.length, 7);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("250 mètres"));
  assert.ok(details.swimming?.includes("toboggans"));
  assert.ok(details.dining?.includes("massage"));
  assert.ok(details.otherInfo?.[0].includes("sous conditions"));
});

test("la fiche enrichie d'Au Tylo Soleil contient le code et les périodes promotionnelles", () => {
  const details = getRichPlaceDetails("camping-au-tylo-soleil");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.promoCode, "LABELVANLIFE2026");
  assert.equal(details.discountInstructions?.length, 4);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 9);
  assert.deepEqual(details.bookingMethods, ["En ligne sur autylosoleil.fr"]);
  assert.ok(details.swimming?.includes("AquaZen"));
  assert.ok(details.swimming?.includes("AquaFun"));
  assert.ok(details.opening?.includes("10 avril au 30 septembre 2026"));
});

test("la fiche enrichie de Lann Hoëdic contient les labels et services de la presqu'île", () => {
  const details = getRichPlaceDetails("camping-de-lann-hoedic");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 9);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("119 emplacements"));
  assert.ok(details.dining?.includes("Ty Break"));
  assert.ok(details.otherInfo?.[0].includes("Green Key"));
  assert.ok(details.otherInfo?.[0].includes("Refuge LPO"));
  assert.ok(details.otherInfo?.[0].includes("Accueil Vélo"));
});

test("la fiche enrichie du Domaine de Mépillat contient le slow tourisme et le Refuge LPO", () => {
  const details = getRichPlaceDetails("domaine-de-mepillat");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 10);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("bornes de recharge"));
  assert.ok(details.opening?.includes("25 avril au 14 septembre 2026"));
  assert.ok(details.swimming?.includes("rénovée en 2024"));
  assert.ok(details.otherInfo?.[0].includes("Refuge LPO"));
  assert.ok(details.otherInfo?.[0].includes("slow tourisme"));
});

test("la fiche enrichie du Camping de Fontenoy contient la Voie Bleue et l'accueil multilingue", () => {
  const details = getRichPlaceDetails("camping-de-fontenoy");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("53 emplacements"));
  assert.ok(details.vanSpecifics?.includes("Voie Bleue"));
  assert.ok(details.dining?.includes("plusieurs langues"));
  assert.ok(details.otherInfo?.[0].includes("Personnel multilingue"));
});

test("la fiche enrichie du Camping de la Torche conserve tous les engagements détaillés", () => {
  const details = getRichPlaceDetails("camping-de-la-torche");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.match(details.contactName ?? "", /Mathilde Thouzeau/);
  assert.equal(details.promoCode, "VANLIFE2026");
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 10);
  assert.equal(details.detailSections?.length, 5);
  assert.equal(details.detailSections?.[0].items.length, 8);
  assert.equal(details.detailSections?.[1].items.length, 12);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.vanSpecifics?.includes("80 à 100 m²"));
  assert.ok(details.swimming?.includes("couverte et chauffée"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.match(details.reservationUrl ?? "", /^https:\/\/reservation\.secureholiday\.net\//);
});

test("la fiche enrichie du Coin Charmant contient les périodes membres et le lien validé", () => {
  const details = getRichPlaceDetails("camping-le-coin-charmant");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.discountInstructions?.length, 2);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 7);
  assert.equal(details.bookingMethods?.length, 4);
  assert.ok(details.discountInstructions?.[1].includes("10 avril au 4 juillet"));
  assert.ok(details.discountInstructions?.[1].includes("30 août au 20 septembre"));
  assert.ok(details.vanSpecifics?.includes("80 à 250 m²"));
  assert.ok(details.swimming?.includes("10 avril au 20 septembre"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.equal(details.reservationUrl, "https://reservation.secureholiday.net/fr/5193/");
});

test("la fiche enrichie du Camping Bon Séjour contient l’accueil Camargue et la réservation membre", () => {
  const details = getRichPlaceDetails("camping-bon-sejour");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.bookingMethods?.length, 4);
  assert.ok(details.vanSpecifics?.includes("365 emplacements"));
  assert.ok(details.opening?.includes("1er avril au 30 septembre"));
  assert.ok(details.discountInstructions?.[0].includes("MEMBRE LABEL VANLIFE"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.equal(details.reservationUrl, "https://reservation.secureholiday.net/fr/17464/search/product-list?filterStatus=showPeriod");
  assert.equal(details.tourismUrl, "https://camping-bonsejour.fr/activite-visite-tourisme/");
});

test("la fiche enrichie du Camping Les Terrasses conserve la certification 20 sur 22", () => {
  const details = getRichPlaceDetails("camping-les-terrasses");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.contactName, "Mylène & Stéphane — gérants");
  assert.equal(details.openingMonths?.length, 9);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.detailSections?.length, 5);
  assert.equal(details.detailSections?.reduce((count, section) => count + section.items.length, 0), 22);
  assert.ok(details.otherInfo?.[0].includes("20 critères remplis sur 22"));
  assert.ok(details.swimming?.includes("11 × 5 mètres"));
  assert.ok(details.opening?.includes("28 mars au 11 novembre 2026"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.equal(details.tourismUrl, "https://www.camping-les-terrasses.com/tourisme-herault/");
});

test("la fiche enrichie du Mas de Bouzou précise les contraintes de l’accueil paysan", () => {
  const details = getRichPlaceDetails("mas-de-bouzou");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.displayType, "Accueil paysan");
  assert.equal(details.contactName, "Thierry Hoareau — propriétaire");
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.bookingMethods?.length, 2);
  assert.ok(details.vanSpecifics?.includes("aucune alimentation électrique"));
  assert.ok(details.vanSpecifics?.includes("animaux non acceptés"));
  assert.ok(details.swimming?.includes("Piscine privée"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
});

test("la fiche enrichie des Amarines contient le code et les services van", () => {
  const details = getRichPlaceDetails("camping-les-amarines");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.promoCode, "AMAVANLIFE10");
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 8);
  assert.equal(details.bookingMethods?.length, 4);
  assert.ok(details.vanSpecifics?.includes("15 emplacements"));
  assert.ok(details.vanSpecifics?.includes("90 à 180 m²"));
  assert.ok(details.swimming?.includes("mi-avril à mi-septembre"));
  assert.equal(details.reservationUrl, "https://reservation.secureholiday.net/fr/10063/");
});

test("la fiche enrichie du Camping La Plage contient le code et les services au bord de la Cèze", () => {
  const details = getRichPlaceDetails("camping-la-plage");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.contactName, "Fabien Dugué — gérant");
  assert.equal(details.promoCode, "LABELVANLIFE10");
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 9);
  assert.equal(details.bookingMethods?.length, 4);
  assert.ok(details.vanSpecifics?.includes("150 à 450 m²"));
  assert.ok(details.vanSpecifics?.includes("électricité 10A"));
  assert.ok(details.swimming?.includes("plus de 50 cm"));
  assert.ok(details.swimming?.includes("moins de 50 cm"));
  assert.ok(details.opening?.includes("30 avril au 12 septembre 2026"));
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.equal(details.reservationUrl, "https://online.resa-booking.com/front/list.php?id_est=1574");
});

test("la fiche enrichie du Camping Saint Lambert contient les informations officielles 2026", () => {
  const details = getRichPlaceDetails("camping-saint-lambert");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 9);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.displayAddress?.includes("2050 avenue de l’Aigoual"));
  assert.ok(details.opening?.includes("25 avril au 19 octobre 2026"));
  assert.ok(details.vanSpecifics?.includes("133 emplacements"));
  assert.ok(details.vanSpecifics?.includes("155 à 200 m²"));
  assert.ok(details.vanSpecifics?.includes("électrique 10A"));
  assert.ok(details.swimming?.includes("plage privée de la Dourbie"));
  assert.match(details.planUrl ?? "", /^https:\/\//);
  assert.equal(details.reservationUrl, "https://bookingpremium.secureholiday.net/fr/674/");
});

test("la fiche enrichie du Pâtis affiche les mini-tarifs sans fausse réduction", () => {
  const details = getRichPlaceDetails("camping-le-patis");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.displayType, "Camping associatif");
  assert.equal(details.discountInstructions?.length, 4);
  assert.equal(details.bookingMethods?.length, 3);
  assert.ok(details.discountInstructions?.[0].includes("mini-tarifs publics"));
  assert.ok(details.discountInstructions?.[1].includes("13 €"));
  assert.ok(details.vanSpecifics?.includes("six personnes maximum"));
  assert.ok(details.opening?.includes("13 mars 2026"));
});

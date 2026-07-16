const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

export function parseText(
  value: unknown,
  options: { min?: number; max: number; required?: boolean },
): string | null {
  if (typeof value !== "string") return options.required ? null : "";
  const text = value.trim();
  const min = options.min ?? 0;
  if ((options.required && !text) || text.length < min || text.length > options.max) {
    return null;
  }
  return text;
}

export type LabellisationPayload = {
  establishmentName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  placeType: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  capacity: number;
  services: string[];
  discountPercent: number;
  description: string;
  motivation: string;
  acceptCharter: true;
  facebook?: string;
  jobTitle?: string;
  siret?: string;
  operatingAuthorization?: boolean;
  followFacebook?: boolean;
  comments?: string;
  criteria?: Record<string, { status: "yes" | "no"; examples: string[]; detail: string }>;
  planFileName?: string;
  welcomeMessage?: string;
  reservationModes?: string[];
  hasParityClause?: boolean;
  publicPrice?: number;
  minimumAllowedPrice?: number;
  promoCode?: string;
  discountConditions?: string;
  surfaceEmplacement?: string;
  totalPitches?: number;
  couplePitchNumbers?: string;
  familyPitchNumbers?: string;
  capacityCouples?: number;
  capacityFamilies?: number;
  bookingUrl?: string;
  bookingSoftware?: string;
  bookingChannelManager?: string;
  activities?: string;
  discoveryUrl?: string;
  foodOptions?: string;
  practicalInfo?: string;
  photoFileNames?: string[];
  draftId?: string;
  attachmentPaths?: string[];
};

const PLACE_TYPES = new Set([
  "CAMPING",
  "CAMPING_FERME",
  "CAMPING_MUNICIPAL",
  "PARKING",
  "ETAPE_NATURE",
  "HEBERGEMENT_INSOLITE",
  "RESTAURANT",
  "ACTIVITE",
  "VILLAGE",
]);

export function parseLabellisationPayload(value: unknown): LabellisationPayload | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const establishmentName = parseText(input.establishmentName, { min: 2, max: 120, required: true });
  const contactName = parseText(input.contactName, { min: 2, max: 120, required: true });
  const email = parseEmail(input.email);
  const phone = parseText(input.phone, { max: 30 });
  const website = parseText(input.website, { max: 300 });
  const city = parseText(input.city, { min: 2, max: 120, required: true });
  const address = parseText(input.address, { max: 200 });
  const postalCode = parseText(input.postalCode, { min: 2, max: 20, required: true });
  const region = parseText(input.region, { max: 120 });
  const description = parseText(input.description, { min: 20, max: 2_000, required: true });
  const motivation = parseText(input.motivation, { min: 20, max: 2_000, required: true });
  const placeType = typeof input.placeType === "string" ? input.placeType : "";
  const capacity = Number(input.capacity);
  const discountPercent = Number(input.discountPercent);
  const services = Array.isArray(input.services)
    ? input.services.filter((service): service is string => typeof service === "string").slice(0, 30)
    : [];
  const acceptCharter = input.acceptCharter === true;

  if (
    !establishmentName || !contactName || !email || phone === null || website === null ||
    address === null || !postalCode || !city || region === null ||
    !Number.isInteger(capacity) || capacity < 1 || capacity > 10_000 ||
    (!Number.isInteger(discountPercent) || discountPercent < 10 || discountPercent > 20) || !acceptCharter ||
    !description || !motivation || !PLACE_TYPES.has(placeType)
  ) return null;

  const parseOptionalUrl = (candidate: unknown): string | null => {
    const text = parseText(candidate, { max: 300 });
    if (text === null) return null;
    if (!text) return "";
    try {
      const url = new URL(text);
      return ['http:', 'https:'].includes(url.protocol) ? text : null;
    } catch {
      return null;
    }
  };

  const safeWebsite = parseOptionalUrl(website);
  const facebook = parseOptionalUrl(input.facebook);
  const bookingUrl = parseOptionalUrl(input.bookingUrl);
  const discoveryUrl = parseOptionalUrl(input.discoveryUrl);
  if (safeWebsite === null || facebook === null || bookingUrl === null || discoveryUrl === null) return null;

  const optionalText = (key: string, max = 2_000) => parseText(input[key], { max });
  const jobTitle = optionalText("jobTitle", 120);
  const comments = optionalText("comments");
  const welcomeMessage = parseText(input.welcomeMessage, { min: 20, max: 1_000, required: true });
  const promoCode = optionalText("promoCode", 100);
  const discountConditions = optionalText("discountConditions");
  const surfaceEmplacement = optionalText("surfaceEmplacement", 100);
  const bookingSoftware = optionalText("bookingSoftware", 120);
  const bookingChannelManager = optionalText("bookingChannelManager", 120);
  const couplePitchNumbers = optionalText("couplePitchNumbers", 300);
  const familyPitchNumbers = optionalText("familyPitchNumbers", 300);
  const activities = optionalText("activities");
  const foodOptions = optionalText("foodOptions", 1_000);
  const practicalInfo = optionalText("practicalInfo");
  const planFileName = parseText(input.planFileName, { min: 1, max: 255, required: true });
  if ([jobTitle, comments, welcomeMessage, promoCode, discountConditions, surfaceEmplacement, bookingSoftware, bookingChannelManager, couplePitchNumbers, familyPitchNumbers, activities, foodOptions, practicalInfo, planFileName].some((item) => item === null)) return null;

  const siretRaw = optionalText("siret", 20);
  if (siretRaw === null) return null;
  const siret = siretRaw?.replace(/\s/g, "") || "";
  if (!/^\d{14}$/.test(siret)) return null;

  const allowedReservationModes = new Set(["online", "email", "phone", "onsite"]);
  const reservationModes = Array.isArray(input.reservationModes)
    ? input.reservationModes.filter((item): item is string => typeof item === "string" && allowedReservationModes.has(item)).slice(0, 4)
    : [];
  const hasParityClause = input.hasParityClause === true;
  const publicPrice = Number(input.publicPrice) || 0;
  const minimumAllowedPrice = Number(input.minimumAllowedPrice) || 0;
  if (hasParityClause) {
    if (publicPrice <= 0 || minimumAllowedPrice < 0 || minimumAllowedPrice > publicPrice) return null;
    const parityMaximum = Math.floor(((publicPrice - minimumAllowedPrice) / publicPrice) * 100);
    if (discountPercent > parityMaximum) return null;
  }
  const photoFileNames = Array.isArray(input.photoFileNames)
    ? input.photoFileNames.filter((item): item is string => typeof item === "string" && item.length <= 255).slice(0, 3)
    : [];
  const draftId = typeof input.draftId === "string" && /^[0-9a-f-]{36}$/i.test(input.draftId) ? input.draftId : "";
  const attachmentPaths = Array.isArray(input.attachmentPaths)
    ? input.attachmentPaths.filter((item): item is string => typeof item === "string" && /^pending\/[0-9a-f-]{36}\/[a-z0-9.-]+$/i.test(item)).slice(0, 5)
    : [];
  const criteria: NonNullable<LabellisationPayload["criteria"]> = {};
  if (input.criteria && typeof input.criteria === "object" && !Array.isArray(input.criteria)) {
    for (const [id, raw] of Object.entries(input.criteria as Record<string, unknown>).slice(0, 22)) {
      if (!/^[a-zA-Z][a-zA-Z0-9]{1,40}$/.test(id) || !raw || typeof raw !== "object") continue;
      const answer = raw as Record<string, unknown>;
      if (answer.status !== "yes" && answer.status !== "no") continue;
      const detail = parseText(answer.detail, { max: 500 });
      if (detail === null) continue;
      criteria[id] = {
        status: answer.status,
        examples: Array.isArray(answer.examples) ? answer.examples.filter((item): item is string => typeof item === "string" && item.length <= 100).slice(0, 12) : [],
        detail,
      };
    }
  }
  if (Object.keys(criteria).length !== 22 || reservationModes.length === 0) return null;
  const capacityCouples = Math.max(0, Math.min(10_000, Number(input.capacityCouples) || 0));
  const capacityFamilies = Math.max(0, Math.min(10_000, Number(input.capacityFamilies) || 0));
  const totalPitches = Math.max(0, Math.min(10_000, Number(input.totalPitches) || capacity));

  return {
    establishmentName, contactName, email, phone, website: safeWebsite, placeType, address,
    postalCode, city, region, capacity, services, discountPercent, description,
    motivation, acceptCharter: true, facebook, jobTitle: jobTitle || "", siret,
    operatingAuthorization: input.operatingAuthorization === true,
    followFacebook: input.followFacebook === true, comments: comments || "", criteria,
    planFileName: planFileName || "", welcomeMessage: welcomeMessage || "", reservationModes,
    hasParityClause, publicPrice, minimumAllowedPrice,
    promoCode: promoCode || "", discountConditions: discountConditions || "",
    surfaceEmplacement: surfaceEmplacement || "", totalPitches, couplePitchNumbers: couplePitchNumbers || "",
    familyPitchNumbers: familyPitchNumbers || "", capacityCouples, capacityFamilies,
    bookingUrl, bookingSoftware: bookingSoftware || "", bookingChannelManager: bookingChannelManager || "", activities: activities || "",
    discoveryUrl, foodOptions: foodOptions || "", practicalInfo: practicalInfo || "", photoFileNames,
    draftId, attachmentPaths,
  };
}

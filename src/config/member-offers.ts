// Future presentation and policy only. Existing purchases are not migrated.
export const MEMBER_OFFERS_START = "02/02/2027";
export const MEMBER_OFFERS_START_ISO = "2027-02-02T00:00:00+01:00";
export const MEMBER_PAYMENT_GRACE_DAYS = 30;
export const MEMBER_REJOIN_RESETS_LOYALTY = true;
export const MEMBER_BILLING_INTERVALS = ["annual"] as const;
export const MEMBER_FOUNDER_ANNUAL_CENTS = 1900;
export const MEMBER_FOUNDER_REQUIRES_CONTINUITY = false;
export const MEMBER_LOYALTY_TIERS = [
  { label: "1re année", annual: 3900 },
  { label: "2e année", annual: 2900 },
  { label: "3e année et suivantes", annual: 1900 },
] as const;

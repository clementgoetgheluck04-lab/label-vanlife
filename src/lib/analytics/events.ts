export const ANALYTICS_EVENTS = [
  "page_view",
  "landing_view",
  "map_open",
  "place_view",
  "place_share",
  "place_search",
  "filter_use",
  "membership_checkout_start",
  "membership_purchase",
  "place_application_start",
  "place_application_submit",
  "label_purchase",
  "place_recommend",
  "place_claim",
  "favorite_add",
  "route_start",
  "qr_scan",
  "benefit_view",
  "review_submit",
  "referral_share",
  "referral_conversion",
  "activity_created",
  "recap_generated",
  "recap_shared",
  "public_trip_view",
  "public_trip_place_click",
  "public_trip_signup",
  "public_trip_membership_conversion",
  "visit_confirmed",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && (ANALYTICS_EVENTS as readonly string[]).includes(value);
}

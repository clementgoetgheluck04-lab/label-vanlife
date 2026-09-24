/** A new address must never erase an establishment's opposition. */
export function canReplaceProspectAddress(status: string, oldSuppressionReason?: string): boolean {
  if (["NOT_INTERESTED", "UNSUBSCRIBED", "CONVERTED", "QUALIFIED", "SENDING", "NEEDS_HUMAN"].includes(status)) return false;
  return !oldSuppressionReason || (oldSuppressionReason === "bounce" && status === "INVALID");
}

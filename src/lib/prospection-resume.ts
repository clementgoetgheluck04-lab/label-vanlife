/** Only operationally paused/failed prospects can be restarted, never exclusions. */
export function canResumeProspect(status: string, suppressed: boolean): boolean {
  return !suppressed && (status === "PAUSED" || status === "ERROR");
}

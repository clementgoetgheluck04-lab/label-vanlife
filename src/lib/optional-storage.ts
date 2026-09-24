/** Browser persistence is an optimisation, never a prerequisite for submitting a form. */
export function optionalStorage<T>(operation: () => T): T | undefined {
  try {
    return operation();
  } catch {
    // Includes SecurityError on accessing storage and quota exhaustion on writes.
    return undefined;
  }
}

/** Only a missing legacy test session may be replaced after moving to live mode. */
export async function retrievePreviousCheckout<T>(
  sessionId: string,
  secretKey: string,
  retrieve: (id: string) => Promise<T>,
): Promise<T | null> {
  try {
    return await retrieve(sessionId);
  } catch (error) {
    const stripeError = error as { type?: string; code?: string; statusCode?: number } | null;
    if (
      /^(sk|rk)_live_/.test(secretKey)
      && sessionId.startsWith("cs_test_")
      && stripeError?.type === "StripeInvalidRequestError"
      && stripeError.code === "resource_missing"
      && stripeError.statusCode === 404
    ) return null;
    throw error;
  }
}

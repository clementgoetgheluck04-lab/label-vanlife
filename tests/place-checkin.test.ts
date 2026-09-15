import assert from "node:assert/strict";
import test from "node:test";

import { createPlaceCheckInToken, verifyPlaceCheckInToken } from "../src/server/place-checkin-token.ts";

const SECRET = "test-place-checkin-secret-with-32-characters";

test("place check-in tokens are signed, scoped and expiring", () => {
  const token = createPlaceCheckInToken("camping-le-verger", 2_000, SECRET);
  assert.deepEqual(verifyPlaceCheckInToken(token, SECRET, 1_000), {
    version: 1,
    placeSlug: "camping-le-verger",
    expiresAt: 2_000,
  });
  assert.equal(verifyPlaceCheckInToken(`${token}x`, SECRET, 1_000), null);
  assert.equal(verifyPlaceCheckInToken(token, SECRET, 2_001), null);
  assert.equal(verifyPlaceCheckInToken(token, `${SECRET}x`, 1_000), null);
});

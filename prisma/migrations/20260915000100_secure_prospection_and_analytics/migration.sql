-- CRM data is server-only. No browser role receives a policy.
ALTER TABLE "prospects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prospect_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prospect_suppressions" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "prospects" FROM anon, authenticated;
REVOKE ALL ON TABLE "prospect_messages" FROM anon, authenticated;
REVOKE ALL ON TABLE "prospect_suppressions" FROM anon, authenticated;

CREATE TABLE "analytics_events" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "userId" TEXT,
  "anonymousId" TEXT,
  "sessionId" TEXT,
  "path" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "source" TEXT,
  "medium" TEXT,
  "campaign" TEXT,
  "properties" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "analytics_events_name_createdAt_idx" ON "analytics_events"("name", "createdAt");
CREATE INDEX "analytics_events_userId_createdAt_idx" ON "analytics_events"("userId", "createdAt");
CREATE INDEX "analytics_events_entityType_entityId_createdAt_idx" ON "analytics_events"("entityType", "entityId", "createdAt");

ALTER TABLE "analytics_events"
  ADD CONSTRAINT "analytics_events_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "analytics_events" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "analytics_events" FROM anon, authenticated;

CREATE TYPE "PlaceRecommendationStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED', 'CONVERTED');

CREATE TABLE "place_recommendations" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "placeName" TEXT NOT NULL,
  "placeType" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "region" TEXT,
  "country" TEXT NOT NULL DEFAULT 'France',
  "website" TEXT,
  "placeContactEmail" TEXT,
  "recommenderEmail" TEXT,
  "reason" TEXT NOT NULL,
  "matchedSourceId" TEXT,
  "status" "PlaceRecommendationStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedAt" TIMESTAMP(3),
  "reviewedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "place_recommendations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "place_recommendations_status_createdAt_idx" ON "place_recommendations"("status", "createdAt");
CREATE INDEX "place_recommendations_city_placeName_idx" ON "place_recommendations"("city", "placeName");
CREATE INDEX "place_recommendations_userId_createdAt_idx" ON "place_recommendations"("userId", "createdAt");

ALTER TABLE "place_recommendations"
  ADD CONSTRAINT "place_recommendations_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "place_recommendations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "place_recommendations" FROM anon, authenticated;

CREATE TYPE "ProspectStatus" AS ENUM ('NEW', 'SENDING', 'CONTACTED', 'FOLLOW_UP_1', 'FOLLOW_UP_2', 'INTERESTED', 'QUALIFIED', 'CONVERTED', 'NOT_INTERESTED', 'UNSUBSCRIBED', 'INVALID', 'NEEDS_HUMAN', 'PAUSED', 'ERROR');
CREATE TYPE "ProspectMessageDirection" AS ENUM ('OUTBOUND', 'INBOUND', 'INTERNAL');
CREATE TYPE "ProspectMessageStatus" AS ENUM ('QUEUED', 'SENT', 'RECEIVED', 'FAILED');

CREATE TABLE "prospects" (
  "id" TEXT NOT NULL,
  "sourceId" TEXT,
  "name" TEXT NOT NULL,
  "contactName" TEXT,
  "email" TEXT NOT NULL,
  "website" TEXT,
  "city" TEXT,
  "region" TEXT,
  "segment" TEXT NOT NULL DEFAULT 'PLACE',
  "sourceLabel" TEXT,
  "sourceUrl" TEXT,
  "status" "ProspectStatus" NOT NULL DEFAULT 'NEW',
  "followUpCount" INTEGER NOT NULL DEFAULT 0,
  "firstContactedAt" TIMESTAMP(3),
  "lastContactedAt" TIMESTAMP(3),
  "lastInboundAt" TIMESTAMP(3),
  "nextActionAt" TIMESTAMP(3),
  "convertedAt" TIMESTAMP(3),
  "unsubscribeToken" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "prospects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prospect_messages" (
  "id" TEXT NOT NULL,
  "prospectId" TEXT NOT NULL,
  "direction" "ProspectMessageDirection" NOT NULL,
  "kind" TEXT NOT NULL,
  "status" "ProspectMessageStatus" NOT NULL DEFAULT 'QUEUED',
  "campaignKey" TEXT,
  "providerMessageId" TEXT,
  "subject" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "error" TEXT,
  "sentAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "prospect_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prospect_suppressions" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prospect_suppressions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "prospects_sourceId_key" ON "prospects"("sourceId");
CREATE UNIQUE INDEX "prospects_email_key" ON "prospects"("email");
CREATE UNIQUE INDEX "prospects_unsubscribeToken_key" ON "prospects"("unsubscribeToken");
CREATE INDEX "prospects_status_nextActionAt_idx" ON "prospects"("status", "nextActionAt");
CREATE INDEX "prospects_createdAt_idx" ON "prospects"("createdAt");
CREATE UNIQUE INDEX "prospect_messages_campaignKey_key" ON "prospect_messages"("campaignKey");
CREATE UNIQUE INDEX "prospect_messages_providerMessageId_key" ON "prospect_messages"("providerMessageId");
CREATE INDEX "prospect_messages_prospectId_createdAt_idx" ON "prospect_messages"("prospectId", "createdAt");
CREATE INDEX "prospect_messages_status_createdAt_idx" ON "prospect_messages"("status", "createdAt");
CREATE UNIQUE INDEX "prospect_suppressions_email_key" ON "prospect_suppressions"("email");
CREATE INDEX "prospect_suppressions_createdAt_idx" ON "prospect_suppressions"("createdAt");

ALTER TABLE "prospect_messages" ADD CONSTRAINT "prospect_messages_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

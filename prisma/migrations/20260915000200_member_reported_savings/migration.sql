ALTER TABLE "passport_stamps"
ADD COLUMN "amountSavedCents" INTEGER;

ALTER TABLE "passport_stamps"
ADD CONSTRAINT "passport_stamps_amount_saved_cents_check"
CHECK ("amountSavedCents" IS NULL OR ("amountSavedCents" >= 0 AND "amountSavedCents" <= 100000));

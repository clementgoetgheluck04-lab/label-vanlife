ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";
ALTER TABLE "checkout_orders" DROP CONSTRAINT "checkout_orders_userId_fkey";

ALTER TABLE "payments" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "checkout_orders" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "payments"
  ADD CONSTRAINT "payments_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "checkout_orders"
  ADD CONSTRAINT "checkout_orders_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "checkout_orders"
  ADD COLUMN "labellisationDraftId" TEXT;

CREATE UNIQUE INDEX "checkout_orders_labellisationDraftId_key"
  ON "checkout_orders"("labellisationDraftId");

-- L'authentification est gérée exclusivement par Supabase Auth. Cette ancienne
-- colonne applicative n'est jamais lue et ne doit pas pouvoir conserver de mot
-- de passe en clair ou doublonné.
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

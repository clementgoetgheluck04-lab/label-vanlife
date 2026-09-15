-- Grant the founder dashboard role to the single, explicitly authorized account.
-- Fail closed if the account is missing or if the database contains an unexpected duplicate.
DO $$
DECLARE
  matched_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO matched_count
  FROM "users"
  WHERE lower("email") = lower('clement.goetgheluck@hotmail.fr');

  IF matched_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one founder account, found %', matched_count;
  END IF;

  UPDATE "users"
  SET "role" = 'ADMIN'
  WHERE lower("email") = lower('clement.goetgheluck@hotmail.fr');
END $$;

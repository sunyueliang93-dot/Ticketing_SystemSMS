/*
# Create tickets table (single-tenant, no auth)

This migration creates the `tickets` table for the internal ticketing system.
The app has no sign-in screen, so all team members share the same data and
access it through the anon key. Row Level Security is enabled with public
CRUD policies scoped to `anon` + `authenticated`.

1. New Tables
- `tickets`
  - `id` (uuid, primary key, auto-generated)
  - `customer` (text, not null) — Customer / Client name
  - `trunk` (text, not null) — Trunk identifier
  - `destination` (text, not null) — Destination / Country
  - `content` (text, not null, default '') — Content description
  - `issue` (text, not null) — Issue details
  - `vendor` (text, not null) — Vendor name
  - `status` (text, not null, default 'Open') — One of: Open, Close, Down Vendor
  - `created_at` (timestamptz, default now()) — Creation timestamp
  - `updated_at` (timestamptz, default now()) — Last update timestamp

2. Constraints
- CHECK on `status` limiting values to 'Open', 'Close', 'Down Vendor'.

3. Security
- Enable RLS on `tickets`.
- Grant SELECT, INSERT, UPDATE, DELETE to `anon` + `authenticated` (no-auth app).
- Four separate CRUD policies, all `USING (true)` / `WITH CHECK (true)` because
  the data is intentionally shared across the whole team.
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer text NOT NULL,
  trunk text NOT NULL,
  destination text NOT NULL,
  content text NOT NULL DEFAULT '',
  issue text NOT NULL,
  vendor text NOT NULL,
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Close', 'Down Vendor')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON tickets TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_tickets" ON tickets;
CREATE POLICY "anon_select_tickets" ON tickets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tickets" ON tickets;
CREATE POLICY "anon_insert_tickets" ON tickets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tickets" ON tickets;
CREATE POLICY "anon_update_tickets" ON tickets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tickets" ON tickets;
CREATE POLICY "anon_delete_tickets" ON tickets FOR DELETE
  TO anon, authenticated USING (true);

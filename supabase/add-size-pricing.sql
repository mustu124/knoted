alter table if exists public.products
  add column if not exists size_pricing jsonb not null default '[]'::jsonb;

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  subcategory text default '',
  description text default '',
  price numeric not null default 0,
  original_price numeric,
  images jsonb not null default '[]'::jsonb,
  video_url text,
  dimensions text default '',
  care_instructions text default '',
  shipping_info text default '',
  is_featured boolean default false,
  featured boolean default false,
  in_stock boolean default true,
  stock_count integer default 0,
  inventory integer default 0,
  active boolean default true,
  tags text[] default '{}',
  rating jsonb default '{"average":0,"count":0}'::jsonb,
  variants text[] default '{}',
  size_pricing jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  type text not null default 'image' check (type in ('image', 'video')),
  thumbnail_url text,
  caption text not null default '',
  category text not null default 'Lifestyle',
  order_index integer default 0,
  public_id text unique,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  items jsonb not null default '[]'::jsonb,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text not null,
  pincode text not null,
  total_amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  whatsapp_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  hero_slides jsonb not null default '[]'::jsonb,
  mobile_hero_slides jsonb not null default '[]'::jsonb,
  video_url text default '',
  announcement_text text default '',
  whatsapp_number text default '',
  social_links jsonb default '{}'::jsonb,
  about_text text default '',
  meta_title text default '',
  meta_description text default '',
  store_email text default '',
  store_address text default '',
  footer_copyright text default '',
  categories jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_active_created_idx on public.products(active, created_at desc);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(is_featured, featured);
create index if not exists gallery_order_idx on public.gallery(order_index, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);

alter table public.products enable row level security;
alter table public.gallery enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select using (active = true);

drop policy if exists "Public read gallery" on public.gallery;
create policy "Public read gallery" on public.gallery for select using (true);

drop policy if exists "Public read settings" on public.settings;
create policy "Public read settings" on public.settings for select using (true);

-- Server routes use SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS for admin writes and orders.

insert into public.settings (
  id,
  hero_slides,
  mobile_hero_slides,
  announcement_text,
  whatsapp_number,
  social_links,
  about_text,
  meta_title,
  meta_description,
  footer_copyright,
  categories
)
select
  '00000000-0000-0000-0000-000000000001'::uuid,
  '[]'::jsonb,
  '[]'::jsonb,
  'Handmade with love · Small batches · New drops every week',
  '',
  '{"instagram":"https://www.instagram.com/knotedco._/","facebook":""}'::jsonb,
  'Knoted Co. is a small handmade hair accessories brand started by Anshika — scrunchies and bows made with lots of love, one small batch at a time.',
  'Knoted Co. | Handmade Hair Accessories',
  'Shop handmade scrunchies, bows, and hair accessories from Knoted Co. — made with lots of love.',
  '© 2026 Knoted Co.',
  '[
    {"name":"Embroidered Hair Clip","icon":"Clip","description":"Hand-embroidered floral hair clips.","subcategories":[],"visible":true},
    {"name":"Embroidered Head Band","icon":"Band","description":"Hand-embroidered fabric headbands.","subcategories":[],"visible":true},
    {"name":"Plain Georgette Scrunchy","icon":"Scrunchy","description":"Solid-colour georgette scrunchies in Small, Medium, and Large.","subcategories":[],"visible":true},
    {"name":"Cotton Scrunchy","icon":"Scrunchy","description":"Everyday cotton scrunchies, checks, duals, and combo sets.","subcategories":[],"visible":true},
    {"name":"Pigtail Bow","icon":"Bow","description":"Cotton pigtail bows in plain and gingham prints.","subcategories":[],"visible":true},
    {"name":"Net Bow","icon":"Bow","description":"Soft tulle net hair bows.","subcategories":[],"visible":true},
    {"name":"Mini Bow","icon":"Bow","description":"Petite cotton bows for everyday wear.","subcategories":[],"visible":true},
    {"name":"Embroidered Bow","icon":"Bow","description":"Hand-embroidered floral hair bows.","subcategories":[],"visible":true},
    {"name":"Embroidered Scrunchy","icon":"Scrunchy","description":"Hand-embroidered detail scrunchies.","subcategories":[],"visible":true},
    {"name":"Satin Scrunchy","icon":"Scrunchy","description":"Multi-colour satin scrunchies in two sizes.","subcategories":[],"visible":true}
  ]'::jsonb
where not exists (select 1 from public.settings);

-- Run this in Supabase SQL Editor

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  emoji text default '🧶',
  description text default '',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Categories are publicly readable"
  on categories for select using (true);

-- Seed with existing categories
insert into categories (name, slug, emoji, description, is_active, sort_order) values
  ('Woolen Jewellery', 'woolen-jewellery', '💛', 'Earrings, necklaces & brooches', true, 1),
  ('Hair Accessories', 'hair-accessories', '🎀', 'Scrunchies, clips & headbands', true, 2),
  ('Home Decor', 'home-decor', '🏡', 'Wall hangings, coasters & more', true, 3),
  ('Keychains & Charms', 'keychains', '🗝️', 'Cute woolen bag charms & keychains', true, 4);

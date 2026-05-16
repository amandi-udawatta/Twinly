-- Twinly initial schema (remote Supabase)
-- Apply via Supabase MCP: apply_migration or Dashboard SQL editor

-- ---------------------------------------------------------------------------
-- Users profile (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  location_city text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Plants
-- ---------------------------------------------------------------------------
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  nickname text,
  species text,
  growth_stage text,
  approximate_age text,
  history_note text,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists plants_user_id_idx on public.plants (user_id);

-- ---------------------------------------------------------------------------
-- Check-ins
-- ---------------------------------------------------------------------------
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  photo_urls text[] not null default '{}',
  user_note text,
  weather_snapshot jsonb,
  created_at timestamptz not null default now()
);

create index if not exists checkins_plant_id_idx on public.checkins (plant_id);
create index if not exists checkins_user_id_idx on public.checkins (user_id);

-- ---------------------------------------------------------------------------
-- Analysis results
-- ---------------------------------------------------------------------------
create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  plant_id uuid not null references public.plants (id) on delete cascade,
  health_score integer not null check (health_score >= 0 and health_score <= 100),
  health_trend text not null,
  insights jsonb not null default '[]',
  recommendations jsonb not null default '[]',
  prediction jsonb,
  urgency_score integer not null check (urgency_score >= 0 and urgency_score <= 10),
  changes_summary text,
  weather_impact text,
  created_at timestamptz not null default now()
);

create index if not exists analysis_results_plant_id_idx on public.analysis_results (plant_id);
create index if not exists analysis_results_checkin_id_idx on public.analysis_results (checkin_id);

-- ---------------------------------------------------------------------------
-- Interventions
-- ---------------------------------------------------------------------------
create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants (id) on delete cascade,
  type text not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists interventions_plant_id_idx on public.interventions (plant_id);

-- ---------------------------------------------------------------------------
-- Auto-create user profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.plants enable row level security;
alter table public.checkins enable row level security;
alter table public.analysis_results enable row level security;
alter table public.interventions enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users manage own plants"
  on public.plants for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own checkins"
  on public.checkins for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own analysis via plant ownership"
  on public.analysis_results for select
  using (
    exists (
      select 1 from public.plants p
      where p.id = analysis_results.plant_id and p.user_id = auth.uid()
    )
  );

create policy "Users insert analysis for own plants"
  on public.analysis_results for insert
  with check (
    exists (
      select 1 from public.plants p
      where p.id = plant_id and p.user_id = auth.uid()
    )
  );

create policy "Users manage interventions on own plants"
  on public.interventions for all
  using (
    exists (
      select 1 from public.plants p
      where p.id = interventions.plant_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.plants p
      where p.id = plant_id and p.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: plant-photos (public bucket)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

create policy "Authenticated users upload plant photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can view plant photos"
  on storage.objects for select
  using (bucket_id = 'plant-photos');

create policy "Users delete own plant photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

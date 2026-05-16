-- Remove growth stage; store plant age as whole days for consistent comparisons.

alter table public.plants drop column if exists growth_stage;

alter table public.plants
  alter column approximate_age type integer
  using (
    case
      when approximate_age is null or trim(approximate_age) = '' then null
      when approximate_age ~ '^\d+$' then approximate_age::integer
      else null
    end
  );

comment on column public.plants.approximate_age is 'Plant age stored as total days';

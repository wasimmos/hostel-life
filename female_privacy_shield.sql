-- ============================================================================
-- HOSTELHIRE: FEMALE HOSTEL PRIVACY SHIELD & CAMPUS RLS EXTENSION
-- Optional: Execute in Supabase SQL Editor to enforce privacy at the DB level
-- ============================================================================

-- 1. Helper function to check if a user resides in a Girls Hostel
create or replace function public.is_female_hostel_resident(target_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = target_id
      and (hostel_block like 'Girls Hostel%' or hostel_block like 'GH%')
  );
$$ language sql stable security definer;

-- 2. Add 'girls_hostel_only' flag to listings and requests if not existing
alter table public.service_listings 
  add column if not exists girls_hostel_only boolean default false;

alter table public.service_requests 
  add column if not exists girls_hostel_only boolean default false;

-- 3. Secure View: safe_profiles
-- If viewer is male and profile is female:
--   - Room Number is masked to 'Campus Common Hub (Central Library / GH Gate)'
--   - Phone Number is masked to NULL unless explicit mutual consent was logged
create or replace view public.safe_profiles as
select
  id,
  full_name,
  department,
  semester,
  hostel_block,
  case
    -- If viewer is the user themselves, or viewer is female, or target is male -> real room
    when auth.uid() = id
      or not is_female_hostel_resident(id)
      or is_female_hostel_resident(auth.uid())
      or exists (
        select 1 from public.contact_consents 
        where from_user_id = id and to_user_id = auth.uid()
      )
    then room_number
    else 'Campus Common Hub (Central Library / Admin Canteen / GH Gate)'
  end as room_number,
  case
    -- If viewer is the user themselves, or viewer is female, or target is male -> real phone
    when auth.uid() = id
      or not is_female_hostel_resident(id)
      or is_female_hostel_resident(auth.uid())
      or exists (
        select 1 from public.contact_consents 
        where from_user_id = id and to_user_id = auth.uid()
      )
    then phone_number
    else null
  end as phone_number,
  bio,
  avatar_url,
  is_admin,
  created_at
from public.profiles;

-- 4. RLS for Girls Hostel Only Listings:
-- Only female students can view gigs explicitly marked as 'girls_hostel_only'
drop policy if exists "GH only listings restricted to female peers" on public.service_listings;
create policy "GH only listings restricted to female peers"
  on public.service_listings for select
  using (
    girls_hostel_only = false
    or is_female_hostel_resident(auth.uid())
    or auth.uid() = provider_id
  );

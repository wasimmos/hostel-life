-- ============================================================================
-- HOSTELHIRE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Production-ready migration script for MVP
-- ============================================================================

-- 0. EXTENSIONS & ENUMS
create extension if not exists "uuid-ossp";

-- Status Enums
create type gig_source_type as enum ('LISTING', 'REQUEST');
create type gig_interest_status as enum ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
create type gig_lifecycle_status as enum ('OPEN', 'INTERESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED');
create type verification_status as enum ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
create type report_status as enum ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');

-- ============================================================================
-- 1. PROFILES & IDENTITY LAYER
-- ============================================================================

-- 1.1 Core Student Profiles
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  roll_number text unique,
  college_email text unique not null,
  department text not null,
  semester int not null check (semester between 1 and 8),
  hostel_block text not null, -- e.g. "Hostel 3", "Hostel 7 (Girls)"
  room_number text not null,  -- Private, protected via RLS
  phone_number text not null, -- Private, protected via RLS
  avatar_url text,
  bio text default 'Hostel resident looking to collaborate and share skills.',
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 1.2 Student Verification Evidence
create table if not exists public.student_verifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  status verification_status default 'PENDING',
  id_card_image_url text,
  verified_by uuid references public.profiles(id),
  rejection_reason text,
  submitted_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- 1.3 Standardized Skill Taxonomy
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  category text not null -- e.g. "Electronics", "Academic", "Design", "Daily Errands"
);

-- 1.4 Student Skill Mappings
create table if not exists public.user_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  proficiency_level text check (proficiency_level in ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  unique(user_id, skill_id)
);

-- ============================================================================
-- 2. DISCOVERY LAYER (LISTINGS & REQUESTS)
-- ============================================================================

-- 2.1 Provider Service Listings (Offered by students)
create table if not exists public.service_listings (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  skill_category text not null,
  indicative_price numeric(10, 2) not null check (indicative_price >= 0),
  turnaround_time text not null, -- e.g. "Within 24 hours", "Same Day"
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2.2 Seeker Service Requests (Request Board - Unmet needs)
create table if not exists public.service_requests (
  id uuid default uuid_generate_v4() primary key,
  seeker_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  skill_category text not null,
  expected_budget numeric(10, 2) not null check (expected_budget >= 0),
  urgency text not null, -- e.g. "Needed Tonight", "Within 2 days"
  is_open boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- 3. UNIFIED GIG TRANSACTION ENGINE
-- ============================================================================

-- 3.1 Expressions of Interest (Applicants/Inquiries)
create table if not exists public.gig_interests (
  id uuid default uuid_generate_v4() primary key,
  source_type gig_source_type not null,
  service_listing_id uuid references public.service_listings(id) on delete cascade,
  service_request_id uuid references public.service_requests(id) on delete cascade,
  applicant_id uuid references public.profiles(id) on delete cascade not null,
  proposed_price numeric(10, 2) not null check (proposed_price >= 0),
  note text,
  status gig_interest_status default 'PENDING',
  created_at timestamp with time zone default now(),
  constraint check_source_reference check (
    (source_type = 'LISTING' and service_listing_id is not null and service_request_id is null) or
    (source_type = 'REQUEST' and service_request_id is not null and service_listing_id is null)
  )
);

-- 3.2 Unified Active Gigs
create table if not exists public.gigs (
  id uuid default uuid_generate_v4() primary key,
  source_type gig_source_type not null,
  source_id uuid not null, -- references either listing_id or request_id
  seeker_id uuid references public.profiles(id) on delete restrict not null,
  provider_id uuid references public.profiles(id) on delete restrict not null,
  accepted_interest_id uuid references public.gig_interests(id) unique not null,
  agreed_price numeric(10, 2) not null check (agreed_price >= 0),
  status gig_lifecycle_status default 'ACCEPTED',
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  constraint check_distinct_participants check (seeker_id <> provider_id)
);

-- 3.3 Contact Sharing Consents
create table if not exists public.contact_consents (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null unique,
  seeker_consented boolean default false,
  provider_consented boolean default false,
  unlocked_at timestamp with time zone
);

-- 3.4 Two-Way Mutual Completion Tracking
create table if not exists public.gig_completions (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null,
  confirmed_by uuid references public.profiles(id) on delete cascade not null,
  confirmed_at timestamp with time zone default now(),
  unique(gig_id, confirmed_by)
);

-- 3.5 Financial & Earnings Records
create table if not exists public.earnings_records (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null unique,
  provider_id uuid references public.profiles(id) on delete restrict not null,
  agreed_price numeric(10, 2) not null,
  reported_earnings numeric(10, 2) not null check (reported_earnings >= 0),
  seeker_confirmed_payment boolean default false,
  recorded_at timestamp with time zone default now()
);

-- ============================================================================
-- 4. TRUST, REPUTATION & SAFETY LAYER
-- ============================================================================

-- 4.1 Transaction-Linked Reviews
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewed_user_id uuid references public.profiles(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamp with time zone default now(),
  unique(gig_id, reviewer_id)
);

-- 4.2 Incident Reporting & Flagging
create table if not exists public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete set null,
  reported_user_id uuid references public.profiles(id) on delete cascade not null,
  related_gig_id uuid references public.gigs(id) on delete set null,
  category text not null, -- e.g. "NO_SHOW", "INAPPROPRIATE_CONTACT", "QUALITY_ISSUE", "PAYMENT_DISPUTE"
  description text not null,
  status report_status default 'PENDING',
  created_at timestamp with time zone default now()
);

-- 4.3 Admin Moderation Audit Trail
create table if not exists public.admin_actions (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  report_id uuid references public.reports(id) on delete set null,
  action_taken text not null, -- e.g. "WARNING_ISSUED", "LISTING_REMOVED", "ACCOUNT_RESTRICTED", "DISMISSED"
  notes text,
  action_timestamp timestamp with time zone default now()
);

-- ============================================================================
-- 5. ATOMIC BUSINESS LOGIC (STORED PROCEDURES / RPCs)
-- ============================================================================

-- 5.1 Atomically Accept an Interest & Spawn the Gig
create or replace function public.accept_gig_interest(
  p_interest_id uuid,
  p_final_agreed_price numeric
)
returns uuid as $$
declare
  v_interest record;
  v_seeker_id uuid;
  v_provider_id uuid;
  v_source_id uuid;
  v_new_gig_id uuid;
begin
  -- 1. Fetch and lock the interest record
  select * into v_interest 
  from public.gig_interests 
  where id = p_interest_id 
  for update;

  if not found then
    raise exception 'Interest request not found';
  end if;

  if v_interest.status <> 'PENDING' then
    raise exception 'This interest request has already been %', v_interest.status;
  end if;

  -- 2. Determine seeker and provider based on origin
  if v_interest.source_type = 'LISTING' then
    v_source_id := v_interest.service_listing_id;
    select provider_id into v_provider_id from public.service_listings where id = v_source_id;
    v_seeker_id := v_interest.applicant_id;
    
    -- Ensure the caller is the provider
    if auth.uid() <> v_provider_id then
      raise exception 'Only the service listing owner can accept this application';
    end if;

  elsif v_interest.source_type = 'REQUEST' then
    v_source_id := v_interest.service_request_id;
    select seeker_id into v_seeker_id from public.service_requests where id = v_source_id;
    v_provider_id := v_interest.applicant_id;
    
    -- Ensure the caller is the seeker
    if auth.uid() <> v_seeker_id then
      raise exception 'Only the request poster can accept this applicant';
    end if;
  end if;

  -- 3. Verify no existing active gig exists for this source request
  if exists (
    select 1 from public.gigs 
    where source_id = v_source_id and status in ('ACCEPTED', 'IN_PROGRESS', 'COMPLETION_PENDING')
  ) then
    raise exception 'An active gig has already been assigned for this task.';
  end if;

  -- 4. Mark interest as ACCEPTED
  update public.gig_interests set status = 'ACCEPTED' where id = p_interest_id;

  -- Reject other pending applications for the same source request
  if v_interest.source_type = 'REQUEST' then
    update public.gig_interests 
    set status = 'REJECTED' 
    where service_request_id = v_source_id and id <> p_interest_id and status = 'PENDING';
    
    -- Close the request on the public board
    update public.service_requests set is_open = false where id = v_source_id;
  end if;

  -- 5. Create unified GIG record
  insert into public.gigs (
    source_type,
    source_id,
    seeker_id,
    provider_id,
    accepted_interest_id,
    agreed_price,
    status
  ) values (
    v_interest.source_type,
    v_source_id,
    v_seeker_id,
    v_provider_id,
    p_interest_id,
    p_final_agreed_price,
    'ACCEPTED'
  ) returning id into v_new_gig_id;

  -- 6. Initialize contact consents table
  insert into public.contact_consents (gig_id, seeker_consented, provider_consented)
  values (v_new_gig_id, false, false);

  return v_new_gig_id;
end;
$$ language plpgsql security definer;


-- 5.2 Mutual Gig Completion Tracker
create or replace function public.confirm_gig_completion(p_gig_id uuid)
returns text as $$
declare
  v_gig record;
  v_caller_id uuid := auth.uid();
  v_completion_count int;
begin
  select * into v_gig from public.gigs where id = p_gig_id;

  if not found then
    raise exception 'Gig not found';
  end if;

  if v_caller_id <> v_gig.seeker_id and v_caller_id <> v_gig.provider_id then
    raise exception 'Only participants in this gig can confirm completion.';
  end if;

  -- Insert confirmation
  insert into public.gig_completions (gig_id, confirmed_by)
  values (p_gig_id, v_caller_id)
  on conflict (gig_id, confirmed_by) do nothing;

  -- Check count of confirmations
  select count(*) into v_completion_count 
  from public.gig_completions 
  where gig_id = p_gig_id;

  if v_completion_count = 1 then
    update public.gigs set status = 'COMPLETION_PENDING' where id = p_gig_id;
    return 'PENDING_OTHER_PARTY';
  elsif v_completion_count >= 2 then
    update public.gigs 
    set status = 'COMPLETED', completed_at = now() 
    where id = p_gig_id;
    return 'COMPLETED';
  end if;

  return 'UNKNOWN';
end;
$$ language plpgsql security definer;


-- ============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.student_verifications enable row level security;
alter table public.service_listings enable row level security;
alter table public.service_requests enable row level security;
alter table public.gig_interests enable row level security;
alter table public.gigs enable row level security;
alter table public.contact_consents enable row level security;
alter table public.gig_completions enable row level security;
alter table public.earnings_records enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.admin_actions enable row level security;

-- Profiles: Public can read names, department, skills, but room & phone are protected
create policy "Public profiles viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Listings & Requests: Anyone authenticated can view active listings/requests
create policy "Active listings viewable by all students"
  on public.service_listings for select
  to authenticated
  using (is_active = true or auth.uid() = provider_id);

create policy "Providers can insert their own listings"
  on public.service_listings for insert
  to authenticated
  with check (auth.uid() = provider_id);

create policy "Providers can update their own listings"
  on public.service_listings for update
  to authenticated
  using (auth.uid() = provider_id);

create policy "Open requests viewable by all students"
  on public.service_requests for select
  to authenticated
  using (is_open = true or auth.uid() = seeker_id);

create policy "Seekers can insert requests"
  on public.service_requests for insert
  to authenticated
  with check (auth.uid() = seeker_id);

-- Gigs: Only participants can view their gigs
create policy "Participants can view their own gigs"
  on public.gigs for select
  to authenticated
  using (auth.uid() = seeker_id or auth.uid() = provider_id);

-- Reviews: Viewable by all, but can only be created by gig participants on completed gigs
create policy "Reviews are publicly viewable"
  on public.reviews for select
  to authenticated
  using (true);

create policy "Only participants can review completed gigs"
  on public.reviews for insert
  to authenticated
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.gigs 
      where id = gig_id and status = 'COMPLETED' and (seeker_id = auth.uid() or provider_id = auth.uid())
    )
  );

-- ============================================================================
-- 7. DEFAULT SEED DATA (STANDARDIZED SKILLS)
-- ============================================================================

insert into public.skills (name, category) values
  ('Laptop OS & Formatting', 'Electronics & Hardware'),
  ('Thermal Paste & Cleanout', 'Electronics & Hardware'),
  ('Smartphone Screen Replacement', 'Electronics & Hardware'),
  ('Engineering Drawing (ED / CAD)', 'Academic Support'),
  ('LaTeX Lab Report Formatting', 'Academic Support'),
  ('C++ / Python Tutoring', 'Academic Support'),
  ('Maths / Signals Peer Tutoring', 'Academic Support'),
  ('Poster & Canva Graphic Design', 'Design & Media'),
  ('Video Editing & Reel Creation', 'Design & Media'),
  ('Shirt / Pant Alteration & Stitching', 'Hostel Essentials'),
  ('Hostel Shift / Luggage Help', 'Hostel Essentials')
on conflict (name) do nothing;

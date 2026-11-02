-- ============================================================================
-- HOSTELHIRE FIX RLS & RE-APPLY COMPLETE SEED DATA
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Drop the restrictive foreign key from profiles so demo students and registered students can coexist
alter table public.profiles drop constraint if exists profiles_id_fkey;

-- 3. Public Read RLS Policies (Allows marketplace browsing on web)
drop policy if exists "Public profiles viewable by authenticated users" on public.profiles;
drop policy if exists "Public profiles viewable by all" on public.profiles;
create policy "Public profiles viewable by all"
  on public.profiles for select
  using (true);

drop policy if exists "Enable insert for registration" on public.profiles;
create policy "Enable insert for registration"
  on public.profiles for insert
  with check (true);

drop policy if exists "Active listings viewable by all students" on public.service_listings;
drop policy if exists "Active listings viewable by all" on public.service_listings;
create policy "Active listings viewable by all"
  on public.service_listings for select
  using (is_active = true or auth.uid() = provider_id);

drop policy if exists "Open requests viewable by all students" on public.service_requests;
drop policy if exists "Open requests viewable by all" on public.service_requests;
create policy "Open requests viewable by all"
  on public.service_requests for select
  using (is_open = true or auth.uid() = seeker_id);

drop policy if exists "Reviews are publicly viewable" on public.reviews;
drop policy if exists "Reviews viewable by all" on public.reviews;
create policy "Reviews viewable by all"
  on public.reviews for select
  using (true);

drop policy if exists "Skills viewable by all" on public.skills;
create policy "Skills viewable by all"
  on public.skills for select
  using (true);

-- Allow authenticated and demo insert on listings/requests
drop policy if exists "Allow insert listings" on public.service_listings;
create policy "Allow insert listings"
  on public.service_listings for insert
  with check (true);

drop policy if exists "Allow insert requests" on public.service_requests;
create policy "Allow insert requests"
  on public.service_requests for insert
  with check (true);

-- 4. Insert Skills
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

-- 5. Insert Student Profiles
insert into public.profiles (id, full_name, roll_number, college_email, department, semester, hostel_block, room_number, phone_number, bio, is_admin)
values
  ('11111111-1111-1111-1111-111111111111', 'Wasim Ahmed', '2481102401', 'wasim.ee@jecassam.ac.in', 'Electrical Engineering', 5, 'Hostel 4', 'Room 214', '+91 9876543210', 'Electronics enthusiast. Can fix laptops, format OS, and repair small electricals.', true),
  ('22222222-2222-2222-2222-222222222222', 'Rhea Goswami', '2481102502', 'rhea.cse@jecassam.ac.in', 'Computer Science & Engg', 5, 'Girls Hostel 2', 'Room 108', '+91 9876543211', 'Graphic designer & LaTeX wizard. Club designer for Phoenix fest.', false),
  ('33333333-3333-3333-3333-333333333333', 'Anupam Saikia', '2481102468', 'anupam.ee@jecassam.ac.in', 'Electrical Engineering', 5, 'Hostel 3', 'Room 302', '+91 9876543212', 'Drafting and CAD pro. Scored 94 in Engineering Graphics.', false),
  ('44444444-4444-4444-4444-444444444444', 'Bikash Kalita', '2481102604', 'bikash.me@jecassam.ac.in', 'Mechanical Engineering', 7, 'Hostel 1', 'Room 112', '+91 9876543213', 'Need emergency stitching, iron, or cycle repair? Reach out.', false),
  ('55555555-5555-5555-5555-555555555555', 'Debojit Sharma', '2481102715', 'debojit.ce@jecassam.ac.in', 'Civil Engineering', 3, 'Hostel 4', 'Room 205', '+91 9876543214', 'Junior resident, passionate about Python tutoring and lab assignments.', false)
on conflict (id) do update set
  full_name = excluded.full_name,
  department = excluded.department,
  hostel_block = excluded.hostel_block,
  room_number = excluded.room_number,
  phone_number = excluded.phone_number;

-- 6. Insert Service Listings
insert into public.service_listings (id, provider_id, title, description, skill_category, indicative_price, turnaround_time, is_active)
values
  ('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Laptop Thermal Paste & Deep Dust Cleanout', 'Will open your laptop safely, clean heatsink fans, and apply Arctic MX-4 thermal paste. Brings down gaming and CAD temps by 15-20°C.', 'Electronics & Hardware', 180.00, 'Same Day (2 hrs)', true),
  ('a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Windows 10/11 Dual Boot or Clean Reinstallation', 'Complete clean OS install with driver setup, MS Office activation, and MATLAB/AutoCAD installation help.', 'Electronics & Hardware', 120.00, 'Within 24 Hours', true),
  ('a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'LaTeX Typesetting & Lab Record Margin Formatting', 'Send your raw Word/text files or handwritten notes. I format them into clean IEEE/college-compliant LaTeX PDFs ready for printing.', 'Academic Support', 80.00, 'Overnight (12 hrs)', true),
  ('a4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Event / Club Poster & Social Media Reel Design', 'Professional posters designed on Canva Pro and Figma for departmental seminars, sports events, or college fests.', 'Design & Media', 150.00, '24 Hours', true),
  ('a5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Engineering Graphics (ED) Sheet Assistance & AutoCAD 2D', 'Struggling with isometric projections or sectional views? 1-on-1 sheet drawing assistance in my room.', 'Academic Support', 140.00, 'Flexible', true),
  ('a6666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Shirt / Trouser Quick Stitching & Button Replacement', 'Torn shirt pocket, loose hem, or missing button before formal placement drive? Quick manual stitching fix.', 'Hostel Essentials', 40.00, '30 Minutes', true)
on conflict (id) do update set
  title = excluded.title,
  indicative_price = excluded.indicative_price,
  is_active = true;

-- 7. Insert Service Requests
insert into public.service_requests (id, seeker_id, title, description, skill_category, expected_budget, urgency, is_open)
values
  ('b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Need urgent help fixing margins in LaTeX S5 Lab Manual', 'Due tomorrow 9 AM. I have tables overflowing the page border and figures refusing to align in center.', 'Academic Support', 100.00, 'Urgent (Tonight)', true),
  ('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Bicycle tire puncture repair near Hostel 1', 'Cycle flat tire, need someone with puncture kit and patch. Will pay ₹60 cash or UPI immediately.', 'Hostel Essentials', 60.00, 'Within 3 hours', true),
  ('b3333333-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Need clean presentation slides for Power Systems seminar', '12 slides PPT with clean diagrams and modern theme. Content already prepared in notepad.', 'Design & Media', 120.00, 'By Wednesday', true)
on conflict (id) do update set
  title = excluded.title,
  expected_budget = excluded.expected_budget,
  is_open = true;

-- 8. Insert Completed Gigs and Reviews
insert into public.gig_interests (id, source_type, service_listing_id, applicant_id, proposed_price, note, status)
values ('c1111111-cccc-cccc-cccc-cccccccccccc', 'LISTING', 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 80.00, 'Need my EE seminar report formatted.', 'ACCEPTED')
on conflict (id) do nothing;

insert into public.gigs (id, source_type, source_id, seeker_id, provider_id, accepted_interest_id, agreed_price, status, completed_at)
values ('d1111111-dddd-dddd-dddd-dddddddddddd', 'LISTING', 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'c1111111-cccc-cccc-cccc-cccccccccccc', 80.00, 'COMPLETED', now() - interval '2 days')
on conflict (id) do nothing;

insert into public.gig_completions (gig_id, confirmed_by)
values
  ('d1111111-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111'),
  ('d1111111-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222')
on conflict (gig_id, confirmed_by) do nothing;

insert into public.reviews (gig_id, reviewer_id, reviewed_user_id, rating, comment)
values ('d1111111-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 5, 'Super fast turnaround! The LaTeX report compiled with zero errors and professors praised the formatting.')
on conflict (gig_id, reviewer_id) do nothing;

-- ============================================================================
-- HOSTELHIRE MOCK SEED DATA FOR DEMO & TESTING
-- Run this in Supabase SQL Editor AFTER running supabase_schema.sql
-- ============================================================================

-- Mock Auth Users & Profiles (Simulating real students)
-- Note: We insert into public.profiles with deterministic UUIDs for test consistency

insert into public.profiles (id, full_name, roll_number, college_email, department, semester, hostel_block, room_number, phone_number, bio, is_admin)
values
  ('11111111-1111-1111-1111-111111111111', 'Wasim Ahmed', '2481102401', 'wasim.ee@jecassam.ac.in', 'Electrical Engineering', 5, 'Hostel 4', 'Room 214', '+91 9876543210', 'Electronics enthusiast. Can fix laptops, format OS, and repair small electricals.', true),
  ('22222222-2222-2222-2222-222222222222', 'Rhea Goswami', '2481102502', 'rhea.cse@jecassam.ac.in', 'Computer Science & Engg', 5, 'Girls Hostel 2', 'Room 108', '+91 9876543211', 'Graphic designer & LaTeX wizard. Club designer for Phoenix fest.', false),
  ('33333333-3333-3333-3333-333333333333', 'Anupam Saikia', '2481102468', 'anupam.ee@jecassam.ac.in', 'Electrical Engineering', 5, 'Hostel 3', 'Room 302', '+91 9876543212', 'Drafting and CAD pro. Scored 94 in Engineering Graphics.', false),
  ('44444444-4444-4444-4444-444444444444', 'Bikash Kalita', '2481102604', 'bikash.me@jecassam.ac.in', 'Mechanical Engineering', 7, 'Hostel 1', 'Room 112', '+91 9876543213', 'Need emergency stitching, iron, or cycle repair? Reach out.', false),
  ('55555555-5555-5555-5555-555555555555', 'Debojit Sharma', '2481102715', 'debojit.ce@jecassam.ac.in', 'Civil Engineering', 3, 'Hostel 4', 'Room 205', '+91 9876543214', 'Junior resident, passionate about Python tutoring and lab assignments.', false)
on conflict (id) do nothing;

-- 2. Mock Verifications
insert into public.student_verifications (user_id, status, id_card_image_url)
values
  ('11111111-1111-1111-1111-111111111111', 'VERIFIED', 'https://images.unsplash.com/photo-1544717305-2782549b5136'),
  ('22222222-2222-2222-2222-222222222222', 'VERIFIED', 'https://images.unsplash.com/photo-1544717305-2782549b5136'),
  ('33333333-3333-3333-3333-333333333333', 'VERIFIED', 'https://images.unsplash.com/photo-1544717305-2782549b5136'),
  ('44444444-4444-4444-4444-444444444444', 'VERIFIED', 'https://images.unsplash.com/photo-1544717305-2782549b5136')
on conflict (user_id) do nothing;

-- 3. Realistic Service Listings (What students offer)
insert into public.service_listings (id, provider_id, title, description, skill_category, indicative_price, turnaround_time, is_active)
values
  ('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Laptop Thermal Paste & Deep Dust Cleanout', 'Will open your laptop safely, clean heatsink fans, and apply Arctic MX-4 thermal paste. Brings down gaming and CAD temps by 15-20°C.', 'Electronics & Hardware', 180.00, 'Same Day (2 hrs)', true),
  ('a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Windows 10/11 Dual Boot or Clean Reinstallation', 'Complete clean OS install with driver setup, MS Office activation, and MATLAB/AutoCAD installation help.', 'Electronics & Hardware', 120.00, 'Within 24 Hours', true),
  ('a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'LaTeX Typesetting & Lab Record Margin Formatting', 'Send your raw Word/text files or handwritten notes. I format them into clean IEEE/college-compliant LaTeX PDFs ready for printing.', 'Academic Support', 80.00, 'Overnight (12 hrs)', true),
  ('a4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Event / Club Poster & Social Media Reel Design', 'Professional posters designed on Canva Pro and Figma for departmental seminars, sports events, or college fests.', 'Design & Media', 150.00, '24 Hours', true),
  ('a5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Engineering Graphics (ED) Sheet Assistance & AutoCAD 2D', 'Struggling with isometric projections or sectional views? 1-on-1 sheet drawing assistance in my room.', 'Academic Support', 140.00, 'Flexible', true),
  ('a6666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Shirt / Trouser Quick Stitching & Button Replacement', 'Torn shirt pocket, loose hem, or missing button before formal placement drive? Quick manual stitching fix.', 'Hostel Essentials', 40.00, '30 Minutes', true)
on conflict (id) do nothing;

-- 4. Active Requests on the Request Board (Unmet needs)
insert into public.service_requests (id, seeker_id, title, description, skill_category, expected_budget, urgency, is_open)
values
  ('b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Need urgent help fixing margins in LaTeX S5 Lab Manual', 'Due tomorrow 9 AM. I have tables overflowing the page border and figures refusing to align in center.', 'Academic Support', 100.00, 'Urgent (Tonight)', true),
  ('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Bicycle tire puncture repair near Hostel 1', 'Cycle flat tire, need someone with puncture kit and patch. Will pay ₹60 cash or UPI immediately.', 'Hostel Essentials', 60.00, 'Within 3 hours', true),
  ('b3333333-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Need clean presentation slides for Power Systems seminar', '12 slides PPT with clean diagrams and modern theme. Content already prepared in notepad.', 'Design & Media', 120.00, 'By Wednesday', true)
on conflict (id) do nothing;

-- 5. Completed Gigs & Real Peer Reviews (For Instant Trust Demonstration)
-- Gig 1: Rhea formatted Wasim's lab report -> Completed -> Reviewed
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

insert into public.earnings_records (gig_id, provider_id, agreed_price, reported_earnings, seeker_confirmed_payment)
values ('d1111111-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 80.00, 80.00, true)
on conflict (gig_id) do nothing;

insert into public.reviews (gig_id, reviewer_id, reviewed_user_id, rating, comment)
values ('d1111111-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 5, 'Super fast turnaround! The LaTeX report compiled with zero errors and professors praised the formatting.')
on conflict (gig_id, reviewer_id) do nothing;

-- Gig 2: Wasim cleaned Bikash's laptop -> Completed -> Reviewed
insert into public.gig_interests (id, source_type, service_listing_id, applicant_id, proposed_price, note, status)
values ('c2222222-cccc-cccc-cccc-cccccccccccc', 'LISTING', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 180.00, 'My Legion laptop is overheating on Valorant.', 'ACCEPTED')
on conflict (id) do nothing;

insert into public.gigs (id, source_type, source_id, seeker_id, provider_id, accepted_interest_id, agreed_price, status, completed_at)
values ('d2222222-dddd-dddd-dddd-dddddddddddd', 'LISTING', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c2222222-cccc-cccc-cccc-cccccccccccc', 180.00, 'COMPLETED', now() - interval '1 day')
on conflict (id) do nothing;

insert into public.gig_completions (gig_id, confirmed_by)
values
  ('d2222222-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444'),
  ('d2222222-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111')
on conflict (gig_id, confirmed_by) do nothing;

insert into public.earnings_records (gig_id, provider_id, agreed_price, reported_earnings, seeker_confirmed_payment)
values ('d2222222-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 180.00, 180.00, true)
on conflict (gig_id) do nothing;

insert into public.reviews (gig_id, reviewer_id, reviewed_user_id, rating, comment)
values ('d2222222-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 5, 'Cleaned my laptop fan completely and replaced thermal paste right in his room. Temps dropped by 18°C. Highly recommend!')
on conflict (gig_id, reviewer_id) do nothing;

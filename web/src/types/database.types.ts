export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GigSourceType = 'LISTING' | 'REQUEST';
export type GigInterestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type GigLifecycleStatus =
  | 'OPEN'
  | 'INTERESTED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export interface Profile {
  id: string;
  full_name: string;
  roll_number?: string | null;
  college_email: string;
  department: string;
  semester: number;
  hostel_block: string;
  room_number: string;
  phone_number: string;
  avatar_url?: string | null;
  bio?: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentVerification {
  id: string;
  user_id: string;
  status: VerificationStatus;
  id_card_image_url?: string | null;
  verified_by?: string | null;
  rejection_reason?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ServiceListing {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  skill_category: string;
  indicative_price: number;
  turnaround_time: string;
  is_active: boolean;
  girls_hostel_only?: boolean;
  created_at: string;
  updated_at: string;
  // Joined relation:
  provider?: Partial<Profile>;
}

export interface ServiceRequest {
  id: string;
  seeker_id: string;
  title: string;
  description: string;
  skill_category: string;
  expected_budget: number;
  urgency: string;
  is_open: boolean;
  girls_hostel_only?: boolean;
  created_at: string;
  updated_at: string;
  // Joined relation:
  seeker?: Partial<Profile>;
}

export interface GigInterest {
  id: string;
  source_type: GigSourceType;
  service_listing_id?: string | null;
  service_request_id?: string | null;
  applicant_id: string;
  proposed_price: number;
  note?: string | null;
  status: GigInterestStatus;
  created_at: string;
  applicant?: Partial<Profile>;
}

export interface Gig {
  id: string;
  source_type: GigSourceType;
  source_id: string;
  seeker_id: string;
  provider_id: string;
  accepted_interest_id: string;
  agreed_price: number;
  status: GigLifecycleStatus;
  created_at: string;
  completed_at?: string | null;
  seeker?: Partial<Profile>;
  provider?: Partial<Profile>;
}

export interface ContactConsent {
  id: string;
  gig_id: string;
  seeker_consented: boolean;
  provider_consented: boolean;
  unlocked_at?: string | null;
}

export interface GigCompletion {
  id: string;
  gig_id: string;
  confirmed_by: string;
  confirmed_at: string;
}

export interface EarningsRecord {
  id: string;
  gig_id: string;
  provider_id: string;
  agreed_price: number;
  reported_earnings: number;
  seeker_confirmed_payment: boolean;
  recorded_at: string;
}

export interface Review {
  id: string;
  gig_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: Partial<Profile>;
}

import { createClient } from "./supabase/client";
import { ServiceListing, ServiceRequest, Gig, Profile, Review } from "@/types/database.types";

const supabase = createClient();

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true;
};

// ==========================================
// 1. DISCOVERY DATA
// ==========================================

export async function fetchListings(): Promise<(ServiceListing & { provider: Partial<Profile> })[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("service_listings")
    .select(`
      *,
      provider:profiles (
        id,
        full_name,
        department,
        semester,
        hostel_block,
        room_number,
        phone_number,
        college_email
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
  return data as any;
}

export async function fetchRequests(): Promise<(ServiceRequest & { seeker: Partial<Profile> })[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      seeker:profiles (
        id,
        full_name,
        department,
        semester,
        hostel_block,
        room_number,
        phone_number,
        college_email
      )
    `)
    .eq("is_open", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
  return data as any;
}

// ==========================================
// 2. GIG ENGAGEMENT DATA
// ==========================================

export async function fetchUserGigs(userId: string): Promise<(Gig & { seeker: any; provider: any })[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("gigs")
    .select(`
      *,
      seeker:profiles!gigs_seeker_id_fkey(id, full_name, hostel_block, room_number, phone_number),
      provider:profiles!gigs_provider_id_fkey(id, full_name, hostel_block, room_number, phone_number)
    `)
    .or(`seeker_id.eq.${userId},provider_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user gigs:", error);
    return [];
  }
  return data as any;
}

// ==========================================
// 3. MUTATIONS & TRANSACTIONS
// ==========================================

export async function createServiceListing(listing: Partial<ServiceListing>) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("service_listings")
    .insert(listing)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createServiceRequest(request: Partial<ServiceRequest>) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("service_requests")
    .insert(request)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptGigInterestRPC(interestId: string, finalAgreedPrice: number) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.rpc("accept_gig_interest", {
    p_interest_id: interestId,
    p_final_agreed_price: finalAgreedPrice,
  });

  if (error) throw error;
  return data; // returns newly spawned gig_id
}

export async function confirmGigCompletionRPC(gigId: string) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.rpc("confirm_gig_completion", {
    p_gig_id: gigId,
  });

  if (error) throw error;
  return data; // returns 'PENDING_OTHER_PARTY' or 'COMPLETED'
}

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
  return (data || []).map((item: any) => {
    const isGhOnly = Boolean(
      item.girls_hostel_only === true ||
      item.description?.startsWith("[Girls Hostel Only]")
    );
    return {
      ...item,
      girls_hostel_only: isGhOnly,
      description: item.description?.replace(/^\[Girls Hostel Only\]\s*/, "") || item.description,
    };
  }) as any;
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
  return (data || []).map((item: any) => {
    const isGhOnly = Boolean(
      item.girls_hostel_only === true ||
      item.description?.startsWith("[Girls Hostel Only]")
    );
    return {
      ...item,
      girls_hostel_only: isGhOnly,
      description: item.description?.replace(/^\[Girls Hostel Only\]\s*/, "") || item.description,
    };
  }) as any;
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

export async function createServiceListing(listing: any, providerProfile?: Partial<Profile>) {
  if (!isSupabaseConfigured()) return null;

  // 1. Ensure provider profile exists in profiles table
  if (providerProfile && providerProfile.id) {
    try {
      await supabase.from("profiles").upsert({
        id: providerProfile.id,
        full_name: providerProfile.full_name || "Hostel Resident",
        roll_number: providerProfile.roll_number || "",
        college_email: providerProfile.college_email || `${providerProfile.id}@jecassam.ac.in`,
        department: providerProfile.department || "Engineering",
        semester: providerProfile.semester || 1,
        hostel_block: providerProfile.hostel_block || "Hostel 1",
        room_number: providerProfile.room_number || "Room 101",
        phone_number: providerProfile.phone_number || "+91 9876543210",
        bio: providerProfile.bio || "Hostel resident and skill contributor.",
        is_admin: false,
      }, { onConflict: "id" });
    } catch (e) {
      console.warn("Profile sync notice before listing:", e);
    }
  }

  // 2. Pass ONLY exact schema columns so PostgREST never errors on extra properties
  const cleanPayload = {
    provider_id: listing.provider_id,
    title: listing.title,
    description: listing.girls_hostel_only
      ? `[Girls Hostel Only] ${listing.description}`
      : listing.description,
    skill_category: listing.skill_category,
    indicative_price: listing.indicative_price,
    turnaround_time: listing.turnaround_time,
    is_active: true,
  };

  const { data, error } = await supabase
    .from("service_listings")
    .insert(cleanPayload)
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
    .single();

  if (error) {
    console.error("Error creating service listing:", error);
    throw error;
  }
  return {
    ...data,
    girls_hostel_only: Boolean(listing.girls_hostel_only),
    description: listing.description,
  };
}

export async function createServiceRequest(request: any, seekerProfile?: Partial<Profile>) {
  if (!isSupabaseConfigured()) return null;

  // 1. Ensure seeker profile exists in profiles table
  if (seekerProfile && seekerProfile.id) {
    try {
      await supabase.from("profiles").upsert({
        id: seekerProfile.id,
        full_name: seekerProfile.full_name || "Hostel Resident",
        roll_number: seekerProfile.roll_number || "",
        college_email: seekerProfile.college_email || `${seekerProfile.id}@jecassam.ac.in`,
        department: seekerProfile.department || "Engineering",
        semester: seekerProfile.semester || 1,
        hostel_block: seekerProfile.hostel_block || "Hostel 1",
        room_number: seekerProfile.room_number || "Room 101",
        phone_number: seekerProfile.phone_number || "+91 9876543210",
        bio: seekerProfile.bio || "Hostel resident.",
        is_admin: false,
      }, { onConflict: "id" });
    } catch (e) {
      console.warn("Profile sync notice before request:", e);
    }
  }

  // 2. Pass ONLY exact schema columns
  const cleanPayload = {
    seeker_id: request.seeker_id,
    title: request.title,
    description: request.girls_hostel_only
      ? `[Girls Hostel Only] ${request.description}`
      : request.description,
    skill_category: request.skill_category,
    expected_budget: request.expected_budget,
    urgency: request.urgency,
    is_open: true,
  };

  const { data, error } = await supabase
    .from("service_requests")
    .insert(cleanPayload)
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
    .single();

  if (error) {
    console.error("Error creating service request:", error);
    throw error;
  }
  return {
    ...data,
    girls_hostel_only: Boolean(request.girls_hostel_only),
    description: request.description,
  };
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

export async function deactivateServiceSource(sourceType: "LISTING" | "REQUEST", sourceId: string) {
  if (!isSupabaseConfigured() || !sourceId) return;

  try {
    if (sourceType === "LISTING") {
      await supabase
        .from("service_listings")
        .update({ is_active: false })
        .eq("id", sourceId);
    } else if (sourceType === "REQUEST") {
      await supabase
        .from("service_requests")
        .update({ is_open: false })
        .eq("id", sourceId);
    }
  } catch (err) {
    console.warn("deactivateServiceSource notice:", err);
  }
}

// ==========================================
// 4. CROSS-DEVICE SERVICE MODERATION & APPROVAL SYNC
// ==========================================

export async function recordServiceRequest(req: {
  gigId: string;
  listingId?: string;
  seekerId: string;
  seekerName: string;
  seekerHostel: string;
  seekerDepartment?: string;
  seekerPhone?: string;
  providerId: string;
  providerName: string;
  providerHostel: string;
  providerPhone?: string;
  note?: string;
  agreedPrice: number;
  listingTitle?: string;
}) {
  if (!isSupabaseConfigured()) return null;

  const payload = {
    seeker_id: req.seekerId,
    title: `[SERVICE_REQUEST:${req.gigId}]`,
    description: JSON.stringify({
      gigId: req.gigId,
      listingId: req.listingId,
      seekerId: req.seekerId,
      seekerName: req.seekerName,
      seekerHostel: req.seekerHostel,
      seekerDepartment: req.seekerDepartment,
      seekerPhone: req.seekerPhone,
      providerId: req.providerId,
      providerName: req.providerName,
      providerHostel: req.providerHostel,
      providerPhone: req.providerPhone,
      note: req.note,
      agreedPrice: req.agreedPrice,
      listingTitle: req.listingTitle,
      status: "INTERESTED",
      timestamp: new Date().toISOString(),
    }),
    skill_category: "Academic Support",
    expected_budget: req.agreedPrice || 80,
    urgency: "Approval Required",
    is_open: true,
  };

  const { data, error } = await supabase
    .from("service_requests")
    .insert(payload)
    .select()
    .single();

  if (error) console.error("Error recording service request:", error);
  return data;
}

export async function recordServiceDecision(
  gigId: string,
  decision: "ACCEPTED" | "CANCELLED" | "COMPLETED" | "CONFIRM_COMPLETION",
  providerId: string,
  seekerId: string,
  unlockedPhone?: string,
  sourceId?: string,
  sourceType?: string,
  confirmedBy?: string
) {
  if (!isSupabaseConfigured()) return null;

  // Ensure caller/provider profile row exists in profiles table
  try {
    await supabase.from("profiles").upsert(
      {
        id: providerId,
        full_name: "Hostel Resident",
        roll_number: "",
        college_email: `${providerId}@jecassam.ac.in`,
        department: "Engineering",
        semester: 1,
        hostel_block: "Hostel 1",
        room_number: "Room 101",
        phone_number: unlockedPhone || "+91 9876543210",
        bio: "Hostel resident.",
        is_admin: false,
      },
      { onConflict: "id" }
    );
  } catch {}

  const payload = {
    seeker_id: providerId,
    title: `[SERVICE_DECISION:${gigId}]`,
    description: JSON.stringify({
      gigId,
      decision,
      providerId,
      seekerId,
      unlockedPhone,
      sourceId,
      sourceType,
      confirmedBy: confirmedBy || providerId,
      timestamp: new Date().toISOString(),
    }),
    skill_category: "Academic Support",
    expected_budget: 80,
    urgency:
      decision === "ACCEPTED"
        ? "Approved"
        : decision === "COMPLETED"
        ? "Completed"
        : decision === "CONFIRM_COMPLETION"
        ? "Confirmed"
        : "Declined",
    is_open: true, // MUST ALWAYS BE TRUE so Supabase RLS select/insert policies allow access to anon clients
  };

  const { data, error } = await supabase
    .from("service_requests")
    .insert(payload)
    .select()
    .single();

  if (error) console.error("Error recording service decision:", error);
  return data;
}

export async function fetchServiceModerations(): Promise<{
  requests: any[];
  decisions: any[];
}> {
  if (!isSupabaseConfigured()) return { requests: [], decisions: [] };

  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .or("title.ilike.%[SERVICE_REQUEST:%,title.ilike.%[SERVICE_DECISION:%")
    .order("created_at", { ascending: false });

  if (error || !data) return { requests: [], decisions: [] };

  const requests: any[] = [];
  const decisions: any[] = [];

  for (const item of data) {
    try {
      const parsed = JSON.parse(item.description);
      if (item.title.startsWith("[SERVICE_REQUEST:")) {
        requests.push(parsed);
      } else if (item.title.startsWith("[SERVICE_DECISION:")) {
        decisions.push(parsed);
      }
    } catch {}
  }

  return { requests, decisions };
}

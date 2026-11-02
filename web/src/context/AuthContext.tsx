"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/api";

export const DEMO_PROFILES: Profile[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    full_name: "Wasim Ahmed",
    roll_number: "2481102401",
    college_email: "wasim.ee@jecassam.ac.in",
    department: "Electrical Engineering",
    semester: 5,
    hostel_block: "Hostel 4",
    room_number: "Room 214",
    phone_number: "+91 9876543210",
    bio: "Electronics enthusiast. Can fix laptops, format OS, and repair small electricals.",
    is_admin: true,
    created_at: "2026-10-30T10:00:00.000Z",
    updated_at: "2026-10-30T10:00:00.000Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    full_name: "Rhea Goswami",
    roll_number: "2481102502",
    college_email: "rhea.cse@jecassam.ac.in",
    department: "Computer Science",
    semester: 5,
    hostel_block: "Girls Hostel 2",
    room_number: "Room 108",
    phone_number: "+91 9876543211",
    bio: "Graphic designer & LaTeX wizard. Club designer for Phoenix fest.",
    is_admin: false,
    created_at: "2026-10-30T10:00:00.000Z",
    updated_at: "2026-10-30T10:00:00.000Z",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    full_name: "Debojit Sharma",
    roll_number: "2481102715",
    college_email: "debojit.ce@jecassam.ac.in",
    department: "Civil Engineering",
    semester: 3,
    hostel_block: "Hostel 4",
    room_number: "Room 205",
    phone_number: "+91 9876543214",
    bio: "Junior resident, active peer seeker.",
    is_admin: false,
    created_at: "2026-10-30T10:00:00.000Z",
    updated_at: "2026-10-30T10:00:00.000Z",
  },
];

export interface SignUpPayload {
  email: string;
  password: string;
  full_name: string;
  roll_number: string;
  department: string;
  semester: number;
  hostel_block: string;
  room_number: string;
  phone_number: string;
  bio?: string;
}

interface AuthContextType {
  user: Profile;
  switchUser: (userId: string) => void;
  availableUsers: Profile[];
  isAuthenticated: boolean;
  isRealAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (payload: SignUpPayload) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PROFILES[0],
  switchUser: () => {},
  availableUsers: DEMO_PROFILES,
  isAuthenticated: true,
  isRealAuth: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(DEMO_PROFILES[0]);
  const [isRealAuth, setIsRealAuth] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setCurrentUser(profile);
            setIsRealAuth(true);
          }
        }
      } catch (e) {
        console.error("Auth session check error:", e);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (profile) {
            setCurrentUser(profile);
            setIsRealAuth(true);
          }
        } else if (event === "SIGNED_OUT") {
          setIsRealAuth(false);
          setCurrentUser(DEMO_PROFILES[0]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const switchUser = (userId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsRealAuth(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Mock login check
      const match = DEMO_PROFILES.find((p) => p.college_email.toLowerCase() === email.toLowerCase());
      if (match) {
        setCurrentUser(match);
        return {};
      }
      return { error: "Demo user not found. Try wasim.ee@jecassam.ac.in or switch persona." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) setCurrentUser(profile);
        setIsRealAuth(true);
      }
      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign in" };
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    if (!isSupabaseConfigured()) {
      // Mock registration
      const newMockUser: Profile = {
        id: `mock-${Date.now()}`,
        full_name: payload.full_name,
        roll_number: payload.roll_number,
        college_email: payload.email,
        department: payload.department,
        semester: payload.semester,
        hostel_block: payload.hostel_block,
        room_number: payload.room_number,
        phone_number: payload.phone_number,
        bio: payload.bio || "Hostel resident and skill contributor.",
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCurrentUser(newMockUser);
      return {};
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (error) return { error: error.message };
      if (!data.user) return { error: "User creation failed" };

      // Insert matching profiles entry
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: payload.full_name,
        roll_number: payload.roll_number,
        college_email: payload.email,
        department: payload.department,
        semester: payload.semester,
        hostel_block: payload.hostel_block,
        room_number: payload.room_number,
        phone_number: payload.phone_number,
        bio: payload.bio || "Hostel resident.",
        is_admin: false,
      });

      if (profileError) return { error: profileError.message };

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to complete student registration" };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setIsRealAuth(false);
    setCurrentUser(DEMO_PROFILES[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        switchUser,
        availableUsers: DEMO_PROFILES,
        isAuthenticated: true,
        isRealAuth,
        signIn,
        signUp,
        signOut,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

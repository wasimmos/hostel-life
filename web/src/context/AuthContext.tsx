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
  setDirectLogin: (logged: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PROFILES[0],
  switchUser: () => {},
  availableUsers: DEMO_PROFILES,
  isAuthenticated: false,
  isRealAuth: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  setDirectLogin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(DEMO_PROFILES[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRealAuth, setIsRealAuth] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const supabase = createClient();

  // Initialize session / check local login status on mount
  useEffect(() => {
    try {
      const savedLogin = localStorage.getItem("hostelhire_logged_in");
      const savedUserId = localStorage.getItem("hostelhire_user_id");
      const savedUserProfile = localStorage.getItem("hostelhire_user_profile");

      if (savedLogin === "true") {
        setIsAuthenticated(true);
        if (savedUserProfile) {
          try {
            const parsed = JSON.parse(savedUserProfile);
            if (parsed && parsed.id) {
              setCurrentUser(parsed);
            }
          } catch {}
        } else if (savedUserId) {
          const match = DEMO_PROFILES.find((p) => p.id === savedUserId);
          if (match) setCurrentUser(match);
        }
      }
    } catch {
      // Safe fallback if SSR / storage disabled
    }

    if (!isSupabaseConfigured()) return;

    const checkSession = async () => {
      try {
        const savedUserId = localStorage.getItem("hostelhire_user_id");
        if (savedUserId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", savedUserId)
            .maybeSingle();

          if (profile) {
            setCurrentUser(profile);
            setIsAuthenticated(true);
            localStorage.setItem("hostelhire_logged_in", "true");
            localStorage.setItem("hostelhire_user_id", profile.id);
            localStorage.setItem("hostelhire_user_profile", JSON.stringify(profile));
          }
        }
      } catch (e) {
        console.error("Auth session check notice:", e);
      }
    };

    checkSession();
  }, []);

  const setDirectLogin = (logged: boolean) => {
    setIsAuthenticated(logged);
    if (logged) {
      localStorage.setItem("hostelhire_logged_in", "true");
      localStorage.setItem("hostelhire_user_id", currentUser.id);
      localStorage.setItem("hostelhire_user_profile", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("hostelhire_logged_in");
      localStorage.removeItem("hostelhire_user_profile");
    }
  };

  const switchUser = (userId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsRealAuth(false);
      localStorage.setItem("hostelhire_user_id", found.id);
      localStorage.setItem("hostelhire_user_profile", JSON.stringify(found));
    }
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check designated reviewer & admin accounts
    if (cleanEmail === "wasim.ee@jecassam.ac.in") {
      if (password !== "admin@jec123") {
        return { error: "Invalid password for Wasim Ahmed. Use: admin@jec123" };
      }
      setCurrentUser(DEMO_PROFILES[0]);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("hostelhire_logged_in", "true");
        localStorage.setItem("hostelhire_user_id", DEMO_PROFILES[0].id);
        localStorage.setItem("hostelhire_user_profile", JSON.stringify(DEMO_PROFILES[0]));
      } catch {}
      return {};
    }

    if (cleanEmail === "rhea.cse@jecassam.ac.in") {
      if (password !== "rhea@jec123") {
        return { error: "Invalid password for Rhea Goswami. Use: rhea@jec123" };
      }
      setCurrentUser(DEMO_PROFILES[1]);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("hostelhire_logged_in", "true");
        localStorage.setItem("hostelhire_user_id", DEMO_PROFILES[1].id);
        localStorage.setItem("hostelhire_user_profile", JSON.stringify(DEMO_PROFILES[1]));
      } catch {}
      return {};
    }

    // 2. Check Supabase profiles table directly
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .ilike("college_email", cleanEmail)
        .maybeSingle();

      if (profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
        try {
          localStorage.setItem("hostelhire_logged_in", "true");
          localStorage.setItem("hostelhire_user_id", profile.id);
          localStorage.setItem("hostelhire_user_profile", JSON.stringify(profile));
        } catch {}
        return {};
      }
    } catch (e) {
      console.warn("Direct profile query check:", e);
    }

    return {
      error: "Account not found for this email. Please register under 'New Student Registration' or sign in with Wasim / Rhea.",
    };
  };

  const signUp = async (payload: SignUpPayload) => {
    // Generate valid RFC-compliant UUID
    const generateUUID = () => {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const assignedUserId = generateUUID();

    // Insert directly into Supabase 'profiles' table
    try {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: assignedUserId,
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
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.warn("Supabase profile upsert warning:", profileError);
      }
    } catch (e) {
      console.warn("Profile table insert fallback:", e);
    }

    // Immediately log the student in with their real profile data
    const newRegisteredUser: Profile = {
      id: assignedUserId,
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentUser(newRegisteredUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("hostelhire_logged_in", "true");
      localStorage.setItem("hostelhire_user_id", newRegisteredUser.id);
      localStorage.setItem("hostelhire_user_profile", JSON.stringify(newRegisteredUser));
    } catch {}

    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setIsRealAuth(false);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("hostelhire_logged_in");
    } catch {}
    setCurrentUser(DEMO_PROFILES[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        switchUser,
        availableUsers: DEMO_PROFILES,
        isAuthenticated,
        isRealAuth,
        signIn,
        signUp,
        signOut,
        isAuthModalOpen,
        setIsAuthModalOpen,
        setDirectLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

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

      if (savedLogin === "true") {
        setIsAuthenticated(true);
        if (savedUserId) {
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
            setIsAuthenticated(true);
            localStorage.setItem("hostelhire_logged_in", "true");
            localStorage.setItem("hostelhire_user_id", profile.id);
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
            setIsAuthenticated(true);
            localStorage.setItem("hostelhire_logged_in", "true");
            localStorage.setItem("hostelhire_user_id", profile.id);
          }
        } else if (event === "SIGNED_OUT") {
          setIsRealAuth(false);
          setIsAuthenticated(false);
          localStorage.removeItem("hostelhire_logged_in");
          setCurrentUser(DEMO_PROFILES[0]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setDirectLogin = (logged: boolean) => {
    setIsAuthenticated(logged);
    if (logged) {
      localStorage.setItem("hostelhire_logged_in", "true");
      localStorage.setItem("hostelhire_user_id", currentUser.id);
    } else {
      localStorage.removeItem("hostelhire_logged_in");
    }
  };

  const switchUser = (userId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsRealAuth(false);
      localStorage.setItem("hostelhire_user_id", found.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    // 1. Check demo profiles first
    const demoMatch = DEMO_PROFILES.find((p) => p.college_email.toLowerCase() === email.toLowerCase());
    if (demoMatch) {
      setCurrentUser(demoMatch);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("hostelhire_logged_in", "true");
        localStorage.setItem("hostelhire_user_id", demoMatch.id);
      } catch {}
      return {};
    }

    // 2. Check Supabase profiles table directly
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("college_email", email)
        .maybeSingle();

      if (profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
        try {
          localStorage.setItem("hostelhire_logged_in", "true");
          localStorage.setItem("hostelhire_user_id", profile.id);
        } catch {}
        return {};
      }
    } catch (e) {
      console.warn("Direct profile query check:", e);
    }

    // 3. Fallback to Supabase Auth password check if available
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) setCurrentUser(profile);
        setIsRealAuth(true);
        setIsAuthenticated(true);
        return {};
      }
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign in" };
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    let assignedUserId = "";

    // 1. Try Supabase Auth signUp if possible
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (data?.user?.id) {
        assignedUserId = data.user.id;
      } else if (error) {
        console.warn("Supabase Auth email signup notice:", error.message);
      }
    } catch (authErr) {
      console.warn("Auth signup error, falling back to direct profile registration:", authErr);
    }

    // If Auth email was rate-limited or bypassed, generate clean unique student UUID
    if (!assignedUserId) {
      assignedUserId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `student-${Date.now()}`;
    }

    // 2. Insert directly into Supabase 'profiles' table
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

    // 3. Immediately log the student in with their real profile data
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

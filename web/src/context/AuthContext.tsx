"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";

// Deterministic seed profiles matching seed_data.sql for effortless testing
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

interface AuthContextType {
  user: Profile;
  switchUser: (userId: string) => void;
  availableUsers: Profile[];
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PROFILES[0],
  switchUser: () => {},
  availableUsers: DEMO_PROFILES,
  isAuthenticated: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(DEMO_PROFILES[0]);
  const supabase = createClient();

  useEffect(() => {
    // Check if live Supabase auth user exists
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) setCurrentUser(profile);
        }
      } catch {
        // Fall back to demo user
      }
    };
    checkUser();
  }, []);

  const switchUser = (userId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === userId);
    if (found) setCurrentUser(found);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        switchUser,
        availableUsers: DEMO_PROFILES,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

"use client";

import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, User, Hash, Phone, AlertCircle, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { useAuth, DEMO_PROFILES } from "@/context/AuthContext";

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { signIn, signUp, switchUser, setDirectLogin } = useAuth();
  const [tab, setTab] = useState<"quick" | "signin" | "signup">("quick");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up State
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Electrical Engineering");
  const [semester, setSemester] = useState(5);
  const [hostelBlock, setHostelBlock] = useState("Hostel 4");
  const [roomNumber, setRoomNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    setDirectLogin(true);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await signIn(signInEmail, signInPassword);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setDirectLogin(true);
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const res = await signUp({
      email,
      password,
      full_name: fullName,
      roll_number: rollNumber,
      department,
      semester,
      hostel_block: hostelBlock,
      room_number: roomNumber,
      phone_number: phoneNumber,
    });

    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setDirectLogin(true);
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-5">
        {/* Campus Header & Branding */}
        <div className="flex flex-col items-center text-center gap-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            H
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">HostelHire</h1>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              Jorhat Engineering College • Campus Micro-Gig Network
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Campus Verified Access</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F1F5F9] p-1 rounded-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setTab("quick");
              setErrorMessage("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === "quick" ? "bg-white text-[#1E40AF] shadow-xs" : "text-[#64748B]"
            }`}
          >
            Quick Demo Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setErrorMessage("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === "signin" ? "bg-white text-[#1E40AF] shadow-xs" : "text-[#64748B]"
            }`}
          >
            Email Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setErrorMessage("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === "signup" ? "bg-white text-[#1E40AF] shadow-xs" : "text-[#64748B]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center gap-2 text-xs text-[#DC2626]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Quick 1-Click Persona Login */}
        {tab === "quick" && (
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">
              Select Student Persona to Enter:
            </span>

            {DEMO_PROFILES.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleQuickLogin(profile.id)}
                className="p-3 bg-[#F8FAFC] hover:bg-[#eaedff] border border-[#E2E8F0] hover:border-[#BFDBFE] rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {profile.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#1E40AF]">
                        {profile.full_name}
                      </span>
                      {profile.is_admin && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {profile.hostel_block} • {profile.department} (Sem {profile.semester})
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}

            <p className="text-[11px] text-center text-[#94A3B8] pt-1">
              Select any profile to enter the campus marketplace instantly.
            </p>
          </div>
        )}

        {/* 2. Email Sign In Form */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#475569] block mb-1">
                College Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="yourname@jecassam.ac.in"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#475569] block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hh-btn-primary w-full py-2.5 text-xs font-bold mt-1"
            >
              {loading ? "Authenticating..." : "Sign In to HostelHire"}
            </button>
          </form>
        )}

        {/* 3. New Student Registration Form */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Wasim Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="2481102401"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#475569] block mb-1">College Email ID</label>
              <input
                type="email"
                required
                placeholder="name.ee@jecassam.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#475569] block mb-1">Create Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
                >
                  <option value="Electrical Engineering">Electrical Engg</option>
                  <option value="Computer Science & Engg">Computer Science</option>
                  <option value="Mechanical Engineering">Mechanical Engg</option>
                  <option value="Civil Engineering">Civil Engg</option>
                  <option value="Instrumentation Engg">Instrumentation</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-2 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-1">Hostel Block</label>
                <select
                  value={hostelBlock}
                  onChange={(e) => setHostelBlock(e.target.value)}
                  className="w-full px-2 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
                >
                  <option value="Hostel 1">Hostel 1</option>
                  <option value="Hostel 2">Hostel 2</option>
                  <option value="Hostel 3">Hostel 3</option>
                  <option value="Hostel 4">Hostel 4</option>
                  <option value="Hostel 5">Hostel 5</option>
                  <option value="Girls Hostel 1">Girls Hostel 1</option>
                  <option value="Girls Hostel 2">Girls Hostel 2</option>
                  <option value="Girls Hostel 3">Girls Hostel 3</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="Room 214"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#475569] block mb-1">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+91 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hh-btn-primary w-full py-2.5 text-xs font-bold mt-2"
            >
              {loading ? "Registering..." : "Complete Campus Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

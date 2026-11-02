"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Mail, Lock, User, Hash, Home, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, signUp, availableUsers, switchUser } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
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

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await signIn(signInEmail, signInPassword);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setIsAuthModalOpen(false);
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
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-[480px] bg-white rounded-t-2xl sm:rounded-2xl p-5 border border-[#E2E8F0] flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Student Authentication</h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#eaedff] p-1 rounded-xl flex items-center">
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "signin" ? "bg-[#1E40AF] text-white" : "text-[#444653]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === "signup" ? "bg-[#1E40AF] text-white" : "text-[#444653]"
            }`}
          >
            New Student Registration
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg flex items-center gap-2 text-xs text-[#DC2626]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === "signin" ? (
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
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
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
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
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

            {/* Quick-fill Demo Profiles */}
            <div className="pt-3 border-t border-[#F1F5F9] flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider text-center block">
                Or Instant-Login with Test Persona:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      setIsAuthModalOpen(false);
                    }}
                    className="py-1.5 px-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[10px] font-bold text-[#0F172A] hover:bg-[#eaedff] hover:text-[#1E40AF] truncate transition-colors"
                  >
                    {u.full_name.split(" ")[0]} ({u.hostel_block.replace("Hostel ", "H")})
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* Sign Up / Registration Form */
          <form onSubmit={handleSignUp} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Das"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                  Roll Number
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="2481102..."
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                College / Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="rahul.ee@jecassam.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                >
                  <option value="Electrical Engineering">Electrical Engg</option>
                  <option value="Mechanical Engineering">Mechanical Engg</option>
                  <option value="Civil Engineering">Civil Engg</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Instrumentation Engg">Instrumentation Engg</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
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
                <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                  Hostel Block
                </label>
                <select
                  value={hostelBlock}
                  onChange={(e) => setHostelBlock(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                >
                  <option value="Hostel 1">Hostel 1</option>
                  <option value="Hostel 2">Hostel 2</option>
                  <option value="Hostel 3">Hostel 3</option>
                  <option value="Hostel 4">Hostel 4</option>
                  <option value="Hostel 5">Hostel 5</option>
                  <option value="Hostel 6">Hostel 6</option>
                  <option value="Hostel 7">Hostel 7</option>
                  <option value="Girls Hostel 1">Girls Hostel 1</option>
                  <option value="Girls Hostel 2">Girls Hostel 2</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                  Room Number
                </label>
                <div className="relative">
                  <Home className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 218"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#475569] block mb-0.5">
                WhatsApp / Phone (Protected by Consent)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hh-btn-primary w-full py-2.5 text-xs font-bold mt-1"
            >
              {loading ? "Registering Student..." : "Create Verified Student Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

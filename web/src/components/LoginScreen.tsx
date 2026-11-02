"use client";

import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, User, Hash, Phone, AlertCircle, ArrowRight, Sparkles, Building2, Check } from "lucide-react";
import { useAuth, DEMO_PROFILES } from "@/context/AuthContext";

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { signIn, signUp, setDirectLogin } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAutofill, setSelectedAutofill] = useState<"wasim" | "rhea" | null>(null);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleAutofill = (emailVal: string, passwordVal: string, persona: "wasim" | "rhea") => {
    setSignInEmail(emailVal);
    setSignInPassword(passwordVal);
    setSelectedAutofill(persona);
    setErrorMessage("");
  };

  const handleQuickLogin = async (e: React.MouseEvent, emailVal: string, passwordVal: string) => {
    e.stopPropagation();
    setSignInEmail(emailVal);
    setSignInPassword(passwordVal);
    setErrorMessage("");
    setLoading(true);

    const res = await signIn(emailVal, passwordVal);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setDirectLogin(true);
      if (onLoginSuccess) onLoginSuccess();
    }
  };

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
            New Student Registration
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center gap-2 text-xs text-[#DC2626]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Sign In Form */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            {/* Login Credentials Box */}
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Campus Login Credentials
                </span>
                <span className="text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]">
                  Tap to Autofill
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleAutofill("wasim.ee@jecassam.ac.in", "admin@jec123", "wasim")}
                  className={`p-2.5 rounded-lg border text-left transition-all active:scale-[0.98] ${
                    selectedAutofill === "wasim"
                      ? "bg-[#DCFCE7] border-[#16A34A] ring-2 ring-[#86EFAC] shadow-xs"
                      : "bg-white border-[#86EFAC] hover:bg-[#F0FDF4]"
                  }`}
                >
                  <div className="font-bold text-[#15803D] flex items-center justify-between">
                    <span>Wasim (Admin)</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                        selectedAutofill === "wasim"
                          ? "bg-[#16A34A] text-white"
                          : "bg-[#FEF3C7] text-[#92400E]"
                      }`}
                    >
                      {selectedAutofill === "wasim" ? "✓ Filled" : "Admin"}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#475569] mt-0.5 truncate">wasim.ee@jecassam.ac.in</div>
                  <div className="text-[10px] font-mono text-[#166534] mt-0.5 font-bold">admin@jec123</div>
                  <div className="mt-1.5 pt-1.5 border-t border-[#BBF7D0] flex items-center justify-between">
                    <span className="text-[9px] text-[#15803D] font-bold">Tap to fill</span>
                    <span
                      onClick={(e) => handleQuickLogin(e, "wasim.ee@jecassam.ac.in", "admin@jec123")}
                      className="text-[9px] bg-[#16A34A] text-white px-2 py-0.5 rounded font-bold hover:bg-[#15803D] shadow-xs transition-colors"
                      title="1-Tap Instant Sign In as Wasim"
                    >
                      Login →
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutofill("rhea.cse@jecassam.ac.in", "rhea@jec123", "rhea")}
                  className={`p-2.5 rounded-lg border text-left transition-all active:scale-[0.98] ${
                    selectedAutofill === "rhea"
                      ? "bg-[#DCFCE7] border-[#16A34A] ring-2 ring-[#86EFAC] shadow-xs"
                      : "bg-white border-[#86EFAC] hover:bg-[#F0FDF4]"
                  }`}
                >
                  <div className="font-bold text-[#15803D] flex items-center justify-between">
                    <span>Rhea (GH 2)</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                        selectedAutofill === "rhea"
                          ? "bg-[#16A34A] text-white"
                          : "bg-[#F3E8FF] text-[#7E22CE]"
                      }`}
                    >
                      {selectedAutofill === "rhea" ? "✓ Filled" : "Female"}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#475569] mt-0.5 truncate">rhea.cse@jecassam.ac.in</div>
                  <div className="text-[10px] font-mono text-[#166534] mt-0.5 font-bold">rhea@jec123</div>
                  <div className="mt-1.5 pt-1.5 border-t border-[#BBF7D0] flex items-center justify-between">
                    <span className="text-[9px] text-[#15803D] font-bold">Tap to fill</span>
                    <span
                      onClick={(e) => handleQuickLogin(e, "rhea.cse@jecassam.ac.in", "rhea@jec123")}
                      className="text-[9px] bg-[#16A34A] text-white px-2 py-0.5 rounded font-bold hover:bg-[#15803D] shadow-xs transition-colors"
                      title="1-Tap Instant Sign In as Rhea"
                    >
                      Login →
                    </span>
                  </div>
                </button>
              </div>
            </div>

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

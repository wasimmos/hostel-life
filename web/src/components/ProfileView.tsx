"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Award, CheckCircle, Wallet, ArrowLeft, Plus, X, Briefcase, PlusCircle } from "lucide-react";
import { Profile, Gig, ServiceListing } from "@/types/database.types";
import { getProviderDefaultSkills } from "@/lib/contact";

interface ProfileViewProps {
  profile: Profile;
  gigs?: (Gig & { seeker?: any; provider?: any })[];
  listings?: (ServiceListing & { provider?: any })[];
  onBack?: () => void;
  onPostServiceClick?: () => void;
}

export function ProfileView({
  profile,
  gigs = [],
  listings = [],
  onBack,
  onPostServiceClick,
}: ProfileViewProps) {
  // 1. Dynamic Experience Metrics
  const currentUserId = profile.id;
  const isWasim = currentUserId.startsWith("11111111");
  const isRhea = currentUserId.startsWith("22222222");

  const completedAsProvider = gigs.filter(
    (g) => g.provider_id === currentUserId && g.status === "COMPLETED"
  );
  const completedAsSeeker = gigs.filter(
    (g) => g.seeker_id === currentUserId && g.status === "COMPLETED"
  );

  const baselineEarnings = isWasim ? 180 + 120 : isRhea ? 80 + 150 : 0;
  const dynamicEarnings = completedAsProvider.reduce(
    (sum, g) => sum + (g.agreed_price || 0),
    0
  );

  // New students strictly start with 0 completed gigs and ₹0
  const reportedEarnings = (isWasim || isRhea)
    ? baselineEarnings + dynamicEarnings
    : dynamicEarnings;

  const completedGigsCount =
    (isWasim ? 14 : isRhea ? 12 : 0) +
    completedAsProvider.length +
    completedAsSeeker.length;

  const totalGigs = gigs.filter(
    (g) => g.provider_id === currentUserId || g.seeker_id === currentUserId
  ).length;

  const completionRate = totalGigs > 0 ? "100%" : completedGigsCount > 0 ? "100%" : "—";

  // 2. Custom Typing & Management for Verified Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hostelhire_skills_${profile.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSkills(parsed);
          return;
        }
      }
    } catch {}

    // Default skills for demo accounts or empty for new users
    setSkills(getProviderDefaultSkills(profile.id));
  }, [profile.id]);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    if (!skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      try {
        localStorage.setItem(`hostelhire_skills_${profile.id}`, JSON.stringify(updated));
      } catch {}
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    try {
      localStorage.setItem(`hostelhire_skills_${profile.id}`, JSON.stringify(updated));
    } catch {}
  };

  // 3. User's active listings
  const myListings = listings.filter((l) => l.provider_id === profile.id);

  return (
    <div className="flex flex-col gap-4 p-4 pb-12">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] hover:underline w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>
      )}

      {/* Profile Card Header */}
      <div className="hh-card p-5 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#eaedff] text-[#1E40AF] font-bold text-xl flex items-center justify-center border-2 border-[#dae2fd] mb-2.5">
          {profile.full_name?.charAt(0) || "U"}
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-base font-bold text-[#0F172A]">{profile.full_name}</h2>
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
        </div>

        <p className="text-xs text-[#64748B] mb-2">
          {profile.department} • Semester {profile.semester || 1}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="hh-badge-hostel text-[11px] font-semibold">
            {profile.hostel_block} • {profile.room_number || "Room 101"}
          </span>
          <span className="hh-badge-verified text-[10px]">Campus Verified Student</span>
        </div>

        <p className="text-xs text-[#475569] mt-3 max-w-sm leading-relaxed">
          {profile.bio || "Hostel resident and skill contributor at Jorhat Engineering College."}
        </p>
      </div>

      {/* 3 Experience Metrics Bar (Dynamic for all users) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="hh-card p-3 text-center">
          <div className="flex items-center justify-center text-[#1E40AF] mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#0F172A] block leading-none">
            {completedGigsCount}
          </span>
          <span className="text-[10px] text-[#64748B] mt-1 block">Completed Gigs</span>
        </div>

        <div className="hh-card p-3 text-center">
          <div className="flex items-center justify-center text-[#059669] mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#0F172A] block leading-none">
            {completionRate}
          </span>
          <span className="text-[10px] text-[#64748B] mt-1 block">Completion Rate</span>
        </div>

        <div className="hh-card p-3 text-center">
          <div className="flex items-center justify-center text-[#D97706] mb-1">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#0F172A] block leading-none">
            ₹{reportedEarnings}
          </span>
          <span className="text-[10px] text-[#64748B] mt-1 block">Reported Earnings</span>
        </div>
      </div>

      {/* Dynamic Typing & Management for Verified Skills */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            My Verified Skills ({skills.length})
          </h3>
          <span className="text-[10px] text-[#64748B]">Type & press Enter</span>
        </div>

        {/* Input to type skills */}
        <form onSubmit={handleAddSkill} className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Type your skill (e.g. AutoCAD, Python, Soldering, PCB)..."
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
          />
          <button
            type="submit"
            disabled={!newSkillInput.trim()}
            className="hh-btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Skill chips with remove (x) */}
        {skills.length === 0 ? (
          <p className="text-xs text-[#64748B] italic py-1">
            No skills added yet. Type your skills above so hostel peers know what you can help with.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] text-xs pl-2.5 pr-1.5 py-1 rounded-md font-medium flex items-center gap-1.5 group hover:border-[#CBD5E1]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEE2E2]"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* My Active Campus Listings (Replaced peer reviews per requirement) */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#1E40AF]" />
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              My Active Services ({myListings.length})
            </h3>
          </div>
          {onPostServiceClick && (
            <button
              type="button"
              onClick={onPostServiceClick}
              className="text-[11px] font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Offer Service</span>
            </button>
          )}
        </div>

        {myListings.length === 0 ? (
          <div className="py-6 px-4 text-center flex flex-col items-center gap-2 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">
              You have not posted any micro-gig services yet.
            </p>
            {onPostServiceClick && (
              <button
                type="button"
                onClick={onPostServiceClick}
                className="hh-btn-primary py-1.5 px-3 text-xs font-bold"
              >
                Post Your First Campus Service
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#F1F5F9]">
            {myListings.map((listing) => (
              <div key={listing.id} className="py-2.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">{listing.title}</span>
                  <span className="text-[11px] text-[#64748B]">
                    {listing.skill_category} • {listing.turnaround_time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1E40AF]">
                    ₹{listing.indicative_price}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#ECFDF5] text-[#059669] rounded font-semibold border border-[#A7F3D0]">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

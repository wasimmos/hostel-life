"use client";

import React from "react";
import { ShieldCheck, Star, Award, CheckCircle, Wallet, ArrowLeft } from "lucide-react";
import { Profile, Review } from "@/types/database.types";

interface ProfileViewProps {
  profile: Profile;
  reviews: (Review & { reviewer?: Profile })[];
  onBack?: () => void;
}

export function ProfileView({ profile, reviews, onBack }: ProfileViewProps) {
  const completedGigsCount = 14;
  const reportedEarnings = 2450;
  const completionRate = "100%";

  return (
    <div className="flex flex-col gap-4 p-4 pb-12">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] hover:underline w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      {/* Profile Card Header */}
      <div className="hh-card p-5 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#eaedff] text-[#1E40AF] font-bold text-xl flex items-center justify-center border-2 border-[#dae2fd] mb-2.5">
          {profile.full_name.charAt(0)}
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-base font-bold text-[#0F172A]">{profile.full_name}</h2>
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
        </div>

        <p className="text-xs text-[#64748B] mb-2">
          {profile.department} • Semester {profile.semester}
        </p>

        <div className="flex items-center gap-1.5">
          <span className="hh-badge-hostel text-[11px] font-semibold">
            {profile.hostel_block} • {profile.room_number || "Room 214"}
          </span>
          <span className="hh-badge-verified text-[10px]">
            Verified Campus Student
          </span>
        </div>

        <p className="text-xs text-[#475569] mt-3 max-w-sm leading-relaxed">
          {profile.bio || "Electronics and tech enthusiast. Helping peers with laptop setups and hardware repairs."}
        </p>
      </div>

      {/* 3 Experience Metrics Bar */}
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

      {/* Active Skills */}
      <div className="hh-card p-4">
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
          Verified Skills
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {["Thermal Paste & Cleaning", "Windows 11 Dual Boot", "C++ Tutoring", "Circuit Soldering"].map(
            (skill) => (
              <span
                key={skill}
                className="bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] text-xs px-2.5 py-1 rounded-md font-medium"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      {/* Transaction-Linked Peer Reviews */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Peer Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-[#D97706]">
            <Star className="w-3.5 h-3.5 fill-[#D97706]" />
            <span>5.0</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#1E40AF] font-bold text-[10px] flex items-center justify-center">
                    {rev.reviewer?.full_name?.charAt(0) || "S"}
                  </div>
                  <span className="text-xs font-bold text-[#0F172A]">
                    {rev.reviewer?.full_name || "Hostel Peer"}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[#D97706]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#D97706]" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                "{rev.comment}"
              </p>
              <span className="text-[10px] text-[#94A3B8]">
                Verified Gig Transaction • Oct 2026
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

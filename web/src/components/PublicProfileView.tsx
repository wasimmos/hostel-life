"use client";

import React from "react";
import { ShieldCheck, Star, Award, CheckCircle, ArrowLeft, ArrowRight, Clock, MessageSquare, Briefcase } from "lucide-react";
import { Profile, ServiceListing } from "@/types/database.types";
import { getProviderRating, getProviderReviews, getProviderDefaultSkills, isFemaleHostel } from "@/lib/contact";

interface PublicProfileViewProps {
  provider: Profile;
  currentUser: Profile;
  listings: (ServiceListing & { provider?: any })[];
  onBack: () => void;
  onSelectListing: (listing: ServiceListing) => void;
}

export function PublicProfileView({
  provider,
  currentUser,
  listings,
  onBack,
  onSelectListing,
}: PublicProfileViewProps) {
  const ratingInfo = getProviderRating(provider.id);
  const reviews = getProviderReviews(provider.id);
  const skills = getProviderDefaultSkills(provider.id);

  // Dynamic completed gigs count based on profile
  const completedGigsCount = provider.id.startsWith("11111111")
    ? 14
    : provider.id.startsWith("22222222")
    ? 12
    : provider.id.startsWith("33333333")
    ? 8
    : reviews.length;

  const isCrossGenderGH =
    isFemaleHostel(provider.hostel_block) && !isFemaleHostel(currentUser.hostel_block);

  const isUserBoy = !isFemaleHostel(currentUser.hostel_block);

  // Active micro-gigs offered by this provider (exclude GH-only protected services from boys)
  const providerServices = listings.filter(
    (l) => l.provider_id === provider.id && l.is_active !== false && (!isUserBoy || !l.girls_hostel_only)
  );

  return (
    <div className="flex flex-col gap-4 p-4 pb-12">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore Feed</span>
      </button>

      {/* Provider Header Card */}
      <div className="hh-card p-5 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#eaedff] text-[#1E40AF] font-bold text-xl flex items-center justify-center border-2 border-[#dae2fd] mb-2.5">
          {provider.full_name?.charAt(0) || "P"}
        </div>

        <div className="flex items-center gap-1.5 mb-1 flex-wrap justify-center">
          <h2 className="text-base font-bold text-[#0F172A]">{provider.full_name}</h2>
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <div className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] rounded text-[11px] font-bold">
            <span>★</span>
            <span>{ratingInfo.rating.toFixed(1)}</span>
            <span className="text-[#92400E]/70 font-normal">({ratingInfo.reviewCount})</span>
          </div>
        </div>

        <p className="text-xs text-[#64748B] mb-2">
          {provider.department} • Semester {provider.semester || 5}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="hh-badge-hostel text-[11px] font-semibold">
            {isCrossGenderGH
              ? "Girls Hostel (Campus Common Hub Coordination)"
              : `${provider.hostel_block} • ${provider.room_number || "Room 214"}`}
          </span>
          <span className="hh-badge-verified text-[10px]">Campus Verified Student</span>
        </div>

        <p className="text-xs text-[#475569] mt-3 max-w-sm leading-relaxed">
          {provider.bio ||
            "Hostel resident and skill contributor at Jorhat Engineering College. Open for campus micro-gigs."}
        </p>
      </div>

      {/* Public Experience Metrics Bar (Explicitly WITHOUT reported earnings) */}
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
          <span className="text-base font-bold text-[#0F172A] block leading-none">100%</span>
          <span className="text-[10px] text-[#64748B] mt-1 block">Completion Rate</span>
        </div>

        <div className="hh-card p-3 text-center">
          <div className="flex items-center justify-center text-[#D97706] mb-1">
            <Star className="w-4 h-4 fill-[#D97706]" />
          </div>
          <span className="text-base font-bold text-[#0F172A] block leading-none">
            {ratingInfo.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#64748B] mt-1 block">Peer Rating</span>
        </div>
      </div>

      {/* Verified Skills */}
      {skills.length > 0 && (
        <div className="hh-card p-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
            Verified Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] text-xs px-2.5 py-1 rounded-md font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active Campus Services Offered by this Student */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-[#1E40AF]" />
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Services Offered ({providerServices.length})
          </h3>
        </div>

        {providerServices.length === 0 ? (
          <p className="text-xs text-[#64748B] py-2">
            No active service listings posted by {provider.full_name} right now.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[#F1F5F9]">
            {providerServices.map((listing) => (
              <div
                key={listing.id}
                onClick={() => onSelectListing(listing)}
                className="py-3 flex flex-col gap-1.5 cursor-pointer hover:bg-[#F8FAFC] -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0F172A] hover:text-[#1E40AF]">
                    {listing.title}
                  </h4>
                  <span className="text-xs font-bold text-[#1E40AF]">₹{listing.indicative_price}</span>
                </div>
                <p className="text-[11px] text-[#64748B] line-clamp-2">{listing.description}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    {listing.turnaround_time}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectListing(listing);
                    }}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      isCrossGenderGH
                        ? "bg-[#9333EA] text-white hover:bg-[#7E22CE]"
                        : "bg-[#1E40AF] text-white hover:bg-[#1D4ED8]"
                    } flex items-center gap-1`}
                  >
                    <span>{isCrossGenderGH ? "Request Service" : "Express Interest"}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Peer Reviews Section (Moved here from own profile per requirement) */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#D97706]" />
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Peer Reviews ({reviews.length})
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#D97706]">
            <Star className="w-3.5 h-3.5 fill-[#D97706]" />
            <span>{ratingInfo.rating.toFixed(1)}</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
            No peer reviews yet. First reviews will appear once gigs are completed with peer mutual sign-off.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#F1F5F9]">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F172A]">{rev.reviewerName}</span>
                    <span className="text-[10px] text-[#64748B]">({rev.reviewerHostel})</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#D97706] text-xs">
                    {Array.from({ length: Math.round(rev.rating) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#D97706]" />
                    ))}
                    <span className="text-[11px] text-[#64748B] ml-1">{rev.date}</span>
                  </div>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

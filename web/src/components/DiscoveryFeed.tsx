"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, Clock, Zap, ArrowRight, MessageSquarePlus, MessageCircle, Lock, RotateCw, Star } from "lucide-react";
import { ServiceListing, ServiceRequest, Profile } from "@/types/database.types";
import { getWhatsAppUrl, isFemaleHostel, canAccessDirectContact, maskPhoneNumber, getProviderRating } from "@/lib/contact";

interface DiscoveryFeedProps {
  listings: (ServiceListing & { provider: any })[];
  requests: (ServiceRequest & { seeker: any })[];
  completedSourceIds?: Set<string>;
  onSelectListing: (listing: ServiceListing) => void;
  onSelectRequest: (request: ServiceRequest) => void;
  onSelectProvider?: (provider: Profile) => void;
  currentUser?: Profile;
  onRefresh?: () => void;
}

export function DiscoveryFeed({
  listings,
  requests,
  completedSourceIds,
  onSelectListing,
  onSelectRequest,
  onSelectProvider,
  currentUser,
  onRefresh,
}: DiscoveryFeedProps) {
  const [mode, setMode] = useState<"services" | "requests">("services");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Electronics & Hardware",
    "Academic Support",
    "Design & Media",
    "Hostel Essentials",
  ];

  // Active listings (exclude inactive or completed ones)
  const activeListings = listings.filter((item) => {
    if (item.is_active === false) return false;
    if (completedSourceIds && completedSourceIds.has(item.id)) return false;
    return true;
  });

  // Active requests (exclude closed or completed ones)
  const activeRequests = requests.filter((item) => {
    if (item.is_open === false) return false;
    if (completedSourceIds && completedSourceIds.has(item.id)) return false;
    return true;
  });

  // Filter listings by category and search query
  const filteredListings = activeListings.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.skill_category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter requests by category and search query
  const filteredRequests = activeRequests.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.skill_category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 1. Dual-Mode Segmented Switcher & Real-time Refresh */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-[#eaedff] p-1 rounded-xl flex items-center border border-[#dae2fd]">
          <button
            onClick={() => setMode("services")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "services"
                ? "bg-[#1E40AF] text-white"
                : "text-[#444653] hover:text-[#0F172A]"
            }`}
          >
            Services Offered ({activeListings.length})
          </button>
          <button
            onClick={() => setMode("requests")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "requests"
                ? "bg-[#1E40AF] text-white"
                : "text-[#444653] hover:text-[#0F172A]"
            }`}
          >
            Requests Needed ({activeRequests.length})
          </button>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E40AF] flex items-center justify-center shrink-0 transition-colors shadow-xs"
            title="Refresh Live Campus Listings"
            aria-label="Refresh Feed"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Search & Category Chips */}
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={
              mode === "services"
                ? "Search services (e.g. thermal paste, drafting)..."
                : "Search urgent hostel requests..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E40AF]"
          />
        </div>

        {/* Horizontal scrollable category chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#1E40AF] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Feed Cards */}
      <div className="flex flex-col gap-3">
        {mode === "services" ? (
          filteredListings.length === 0 ? (
            <div className="hh-card p-8 text-center text-[#64748B] text-xs">
              No services found matching your search.
            </div>
          ) : (
            filteredListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => onSelectListing(listing)}
                className="hh-card-interactive p-3.5 cursor-pointer flex flex-col gap-2.5"
              >
                {/* Header: Provider Info & Verification */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={(e) => {
                      if (onSelectProvider && listing.provider) {
                        e.stopPropagation();
                        onSelectProvider(listing.provider as Profile);
                      }
                    }}
                    title={`View ${listing.provider?.full_name}'s Public Profile`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#eaedff] group-hover:bg-[#dbe4ff] text-[#1E40AF] font-bold text-xs flex items-center justify-center transition-colors">
                      {listing.provider?.full_name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#1E40AF] group-hover:underline transition-colors">
                          {listing.provider?.full_name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                        {/* Rating Beside Name */}
                        <div className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] rounded text-[10px] font-bold">
                          <span>★</span>
                          <span>{getProviderRating(listing.provider?.id).rating.toFixed(1)}</span>
                          <span className="text-[#92400E]/70 font-normal">({getProviderRating(listing.provider?.id).reviewCount})</span>
                        </div>
                        {isFemaleHostel(listing.provider?.hostel_block) && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] rounded font-bold">
                            GH Protected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                        <span>{listing.provider?.hostel_block}</span>
                        <span>•</span>
                        <span>{listing.provider?.department}</span>
                      </div>
                    </div>
                  </div>
                  <span className="hh-badge-hostel text-[10px]">
                    {isFemaleHostel(listing.provider?.hostel_block) && !isFemaleHostel(currentUser?.hostel_block)
                      ? "Common Hub"
                      : listing.provider?.room_number || "Verified"}
                  </span>
                </div>

                {/* Body: Title & Description */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {listing.girls_hostel_only && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF]">
                        👩‍🎓 Girls Hostel Only
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Footer: Price, Turnaround, & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1E40AF] tracking-tight">
                      ₹{listing.indicative_price}
                    </span>
                    <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#94A3B8]" />
                      {listing.turnaround_time}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {canAccessDirectContact(listing.provider?.hostel_block, currentUser?.hostel_block) ? (
                      <a
                        href={getWhatsAppUrl(
                          listing.provider?.phone_number,
                          `Hi ${listing.provider?.full_name || "peer"}, I saw your HostelHire listing "${listing.title}" (₹${listing.indicative_price}). Are you available to help?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] transition-colors flex items-center justify-center"
                        title="Direct WhatsApp Message"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span
                        className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center"
                        title="Privacy Shield: Contact protected. Apply to request consent."
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}

                    {isFemaleHostel(listing.provider?.hostel_block) && !isFemaleHostel(currentUser?.hostel_block) ? (
                      <button className="py-1 px-2.5 text-xs font-bold rounded-lg bg-[#9333EA] hover:bg-[#7E22CE] text-white flex items-center gap-1 shadow-xs transition-colors">
                        <span>Request Service</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button className="hh-btn-primary py-1 px-2.5 text-xs flex items-center gap-1">
                        <span>Express Interest</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        ) : filteredRequests.length === 0 ? (
          <div className="hh-card p-8 text-center text-[#64748B] text-xs">
            No active student requests right now.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => onSelectRequest(request)}
              className="hh-card-interactive p-3.5 cursor-pointer flex flex-col gap-2.5 border-l-4 border-l-[#D97706]"
            >
              {/* Header: Urgency Badge & Seeker Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="hh-badge-pending text-[10px]">
                    <Zap className="w-3 h-3 text-[#D97706]" />
                    {request.urgency}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {request.seeker?.hostel_block}
                  </span>
                  {isFemaleHostel(request.seeker?.hostel_block) && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] rounded font-bold">
                      GH Protected
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-[#059669]">
                  Budget: ₹{request.expected_budget}
                </span>
              </div>

              {/* Body: Title & Need */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {request.girls_hostel_only && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF]">
                      👩‍🎓 Girls Hostel Only
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                  {request.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                  {request.description}
                </p>
              </div>

              {/* Footer: Poster name & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                <span className="text-[11px] text-[#64748B]">
                  Posted by <strong className="text-[#0F172A]">{request.seeker?.full_name}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {canAccessDirectContact(request.seeker?.hostel_block, currentUser?.hostel_block) ? (
                    <a
                      href={getWhatsAppUrl(
                        request.seeker?.phone_number,
                        `Hi ${request.seeker?.full_name || "peer"}, I saw your HostelHire request "${request.title}" (Budget: ₹${request.expected_budget}). I can help you with this!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] transition-colors flex items-center justify-center"
                      title="Direct WhatsApp Message"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span
                      className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center"
                      title="Privacy Shield: Contact protected. Tap Offer to Help."
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}

                  <button className="hh-btn-secondary py-1 px-2.5 text-xs flex items-center gap-1 text-[#1E40AF] font-bold">
                    <MessageSquarePlus className="w-3 h-3" />
                    <span>Offer to Help</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

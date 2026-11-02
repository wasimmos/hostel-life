"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, Clock, Zap, ArrowRight, MessageSquarePlus } from "lucide-react";
import { ServiceListing, ServiceRequest } from "@/types/database.types";

interface DiscoveryFeedProps {
  listings: (ServiceListing & { provider: any })[];
  requests: (ServiceRequest & { seeker: any })[];
  onSelectListing: (listing: ServiceListing) => void;
  onSelectRequest: (request: ServiceRequest) => void;
}

export function DiscoveryFeed({
  listings,
  requests,
  onSelectListing,
  onSelectRequest,
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

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.skill_category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter requests
  const filteredRequests = requests.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.skill_category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 1. Dual-Mode Segmented Switcher */}
      <div className="bg-[#eaedff] p-1 rounded-xl flex items-center border border-[#dae2fd]">
        <button
          onClick={() => setMode("services")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === "services"
              ? "bg-[#1E40AF] text-white"
              : "text-[#444653] hover:text-[#0F172A]"
          }`}
        >
          Services Offered ({listings.length})
        </button>
        <button
          onClick={() => setMode("requests")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === "requests"
              ? "bg-[#1E40AF] text-white"
              : "text-[#444653] hover:text-[#0F172A]"
          }`}
        >
          Requests Needed ({requests.length})
        </button>
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
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#1E40AF] font-bold text-xs flex items-center justify-center">
                      {listing.provider?.full_name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {listing.provider?.full_name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                        <span>{listing.provider?.hostel_block}</span>
                        <span>•</span>
                        <span>{listing.provider?.department}</span>
                      </div>
                    </div>
                  </div>
                  <span className="hh-badge-hostel text-[10px]">
                    {listing.provider?.room_number || "Verified"}
                  </span>
                </div>

                {/* Body: Title & Description */}
                <div>
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

                  <button className="hh-btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                    <span>Express Interest</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
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
                </div>
                <span className="text-xs font-bold text-[#059669]">
                  Budget: ₹{request.expected_budget}
                </span>
              </div>

              {/* Body: Title & Need */}
              <div>
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

                <button className="hh-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 text-[#1E40AF] font-bold">
                  <MessageSquarePlus className="w-3 h-3" />
                  <span>Offer to Help</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

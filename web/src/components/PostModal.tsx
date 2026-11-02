"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Profile } from "@/types/database.types";
import { isFemaleHostel } from "@/lib/contact";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitListing: (data: any) => void;
  onSubmitRequest: (data: any) => void;
  currentUser?: Profile;
}

export function PostModal({
  isOpen,
  onClose,
  onSubmitListing,
  onSubmitRequest,
  currentUser,
}: PostModalProps) {
  const isUserFemale = isFemaleHostel(currentUser?.hostel_block);
  const [postType, setPostType] = useState<"service" | "request">("service");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics & Hardware");
  const [price, setPrice] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [description, setDescription] = useState("");
  const [girlsHostelOnly, setGirlsHostelOnly] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) return;

    if (postType === "service") {
      onSubmitListing({
        title,
        skill_category: category,
        indicative_price: parseFloat(price),
        turnaround_time: timeframe || "Within 24 Hours",
        description,
        girls_hostel_only: isUserFemale ? girlsHostelOnly : false,
      });
    } else {
      onSubmitRequest({
        title,
        skill_category: category,
        expected_budget: parseFloat(price),
        urgency: timeframe || "Needed Tonight",
        description,
        girls_hostel_only: isUserFemale ? girlsHostelOnly : false,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-[480px] bg-white rounded-t-2xl sm:rounded-2xl p-5 border border-[#E2E8F0] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <h3 className="text-sm font-bold text-[#0F172A]">Create New Post</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="bg-[#eaedff] p-1 rounded-xl flex items-center">
          <button
            type="button"
            onClick={() => setPostType("service")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              postType === "service"
                ? "bg-[#1E40AF] text-white"
                : "text-[#444653]"
            }`}
          >
            Offer a Service
          </button>
          <button
            type="button"
            onClick={() => setPostType("request")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              postType === "request"
                ? "bg-[#1E40AF] text-white"
                : "text-[#444653]"
            }`}
          >
            Request Assistance
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#475569] block mb-1">
              {postType === "service" ? "Service Title" : "What do you need help with?"}
            </label>
            <input
              type="text"
              required
              placeholder={
                postType === "service"
                  ? "e.g. Laptop thermal paste & cleaning"
                  : "e.g. Urgent LaTeX lab record formatting"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#475569] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
              >
                <option value="Electronics & Hardware">Electronics & Hardware</option>
                <option value="Academic Support">Academic Support</option>
                <option value="Design & Media">Design & Media</option>
                <option value="Hostel Essentials">Hostel Essentials</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#475569] block mb-1">
                {postType === "service" ? "Rate (₹ INR)" : "Budget (₹ INR)"}
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="₹150"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#475569] block mb-1">
              {postType === "service" ? "Typical Turnaround Time" : "Urgency / Deadline"}
            </label>
            <input
              type="text"
              placeholder={postType === "service" ? "e.g. Within 24 hours" : "e.g. Needed tonight before 11 PM"}
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#475569] block mb-1">
              Detailed Description & Scope
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what you will do, materials needed, and room location..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>

          {/* Girls Hostel Only Toggle (Strictly female resident only) */}
          {isUserFemale && (
            <div className="p-3 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl flex items-start gap-2.5">
              <input
                type="checkbox"
                id="gh-only"
                checked={girlsHostelOnly}
                onChange={(e) => setGirlsHostelOnly(e.target.checked)}
                className="mt-0.5 rounded text-[#9333EA] focus:ring-[#9333EA]"
              />
              <label htmlFor="gh-only" className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#6B21A8]">Girls Hostel (GH) Only</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#F3E8FF] text-[#7E22CE] rounded-full font-bold">Privacy Shield</span>
                </div>
                <p className="text-[11px] text-[#7E22CE]/80 leading-snug mt-0.5">
                  Restrict this post and room visits exclusively to verified female hostel peers.
                </p>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="hh-btn-primary w-full py-2.5 text-xs font-bold mt-2"
          >
            {postType === "service" ? "Publish Service Listing" : "Post to Request Board"}
          </button>
        </form>
      </div>
    </div>
  );
}

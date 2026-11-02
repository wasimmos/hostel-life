"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Gig } from "@/types/database.types";

interface MyGigsListProps {
  gigs: (Gig & { seeker: any; provider: any })[];
  onSelectGig: (gig: Gig) => void;
}

export function MyGigsList({ gigs, onSelectGig }: MyGigsListProps) {
  const [filter, setFilter] = useState<"active" | "completed">("active");

  const activeGigs = gigs.filter(
    (g) => g.status === "ACCEPTED" || g.status === "IN_PROGRESS" || g.status === "COMPLETION_PENDING"
  );
  const completedGigs = gigs.filter((g) => g.status === "COMPLETED");

  const displayedGigs = filter === "active" ? activeGigs : completedGigs;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-base font-bold text-[#0F172A]">My Gig Engagements</h2>
        <p className="text-xs text-[#64748B]">
          Track real-time progress, contact handovers, and mutual completions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#eaedff] p-1 rounded-xl flex items-center border border-[#dae2fd]">
        <button
          onClick={() => setFilter("active")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filter === "active"
              ? "bg-[#1E40AF] text-white"
              : "text-[#444653] hover:text-[#0F172A]"
          }`}
        >
          Active ({activeGigs.length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filter === "completed"
              ? "bg-[#1E40AF] text-white"
              : "text-[#444653] hover:text-[#0F172A]"
          }`}
        >
          Completed ({completedGigs.length})
        </button>
      </div>

      {/* Gigs List */}
      <div className="flex flex-col gap-3">
        {displayedGigs.length === 0 ? (
          <div className="hh-card p-8 text-center text-[#64748B] text-xs">
            No {filter} gigs at the moment.
          </div>
        ) : (
          displayedGigs.map((g) => (
            <div
              key={g.id}
              onClick={() => onSelectGig(g)}
              className="hh-card-interactive p-4 cursor-pointer flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B]">
                  ID: #{g.id.substring(0, 8)}
                </span>
                {g.status === "COMPLETED" ? (
                  <span className="hh-badge-verified text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : g.status === "COMPLETION_PENDING" ? (
                  <span className="hh-badge-pending text-[10px]">
                    <Clock className="w-3 h-3" /> Awaiting Peer Confirm
                  </span>
                ) : (
                  <span className="bg-[#eff6ff] text-[#1E40AF] border border-[#bfdbfe] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Accepted • In Progress
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-[#0F172A]">
                Hostel Micro-Task Service
              </h3>

              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>With: <strong className="text-[#0F172A]">{g.provider?.full_name || g.seeker?.full_name}</strong></span>
                <span className="text-sm font-bold text-[#1E40AF]">₹{g.agreed_price}</span>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-[#F1F5F9] text-xs font-bold text-[#1E40AF] gap-1">
                <span>View Status Stepper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

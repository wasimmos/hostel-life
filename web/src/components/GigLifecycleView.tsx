"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Gig, Profile } from "@/types/database.types";

interface GigLifecycleViewProps {
  gig: Gig;
  currentUserRole: "seeker" | "provider";
  onBack: () => void;
  onConfirmCompletion: (gigId: string) => void;
  onConsentContact: (gigId: string) => void;
}

export function GigLifecycleView({
  gig,
  currentUserRole,
  onBack,
  onConfirmCompletion,
  onConsentContact,
}: GigLifecycleViewProps) {
  const [contactShared, setContactShared] = useState(true); // Demo default unlocked or toggleable
  const [hasConfirmed, setHasConfirmed] = useState(
    gig.status === "COMPLETED" || gig.status === "COMPLETION_PENDING"
  );

  const steps = [
    { key: "OPEN", label: "Open" },
    { key: "INTERESTED", label: "Interested" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "COMPLETED", label: "Completed" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "OPEN":
        return 0;
      case "INTERESTED":
        return 1;
      case "ACCEPTED":
      case "IN_PROGRESS":
        return 2;
      case "COMPLETION_PENDING":
        return 2.5;
      case "COMPLETED":
        return 3;
      default:
        return 2;
    }
  };

  const currentStepIdx = getStepIndex(gig.status);
  const otherParty = currentUserRole === "seeker" ? gig.provider : gig.seeker;

  return (
    <div className="flex flex-col gap-4 p-4 pb-12">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Gigs</span>
      </button>

      {/* Header Info */}
      <div className="hh-card p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="hh-badge-verified text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Engagement
          </span>
          <span className="text-[11px] text-[#64748B]">
            ID: #{gig.id.substring(0, 8)}
          </span>
        </div>

        <h2 className="text-base font-bold text-[#0F172A] leading-tight">
          Campus Micro-Gig Transaction
        </h2>

        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span>Role: <strong>{currentUserRole === "seeker" ? "Service Seeker" : "Service Provider"}</strong></span>
          <span>•</span>
          <span>With: <strong>{otherParty?.full_name || "Peer Student"}</strong></span>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="hh-card p-4">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
          Transaction Lifecycle
        </h3>
        <div className="relative flex items-center justify-between">
          {/* Connector Line */}
          <div className="absolute left-2 right-2 top-3 h-0.5 bg-[#E2E8F0] -z-0"></div>
          <div
            className="absolute left-2 top-3 h-0.5 bg-[#1E40AF] transition-all duration-300 -z-0"
            style={{ width: `${(Math.min(currentStepIdx, 3) / 3) * 100}%` }}
          ></div>

          {steps.map((s, idx) => {
            const isCompleted = currentStepIdx > idx;
            const isCurrent = currentStepIdx === idx || (idx === 2 && currentStepIdx === 2.5);

            return (
              <div key={s.key} className="flex flex-col items-center z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    isCompleted
                      ? "bg-[#1E40AF] border-[#1E40AF] text-white"
                      : isCurrent
                      ? "bg-white border-[#1E40AF] text-[#1E40AF]"
                      : "bg-white border-[#CBD5E1] text-[#94A3B8]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium ${
                    isCurrent ? "font-bold text-[#1E40AF]" : "text-[#64748B]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {gig.status === "COMPLETION_PENDING" && (
          <div className="mt-4 p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg flex items-center gap-2 text-xs text-[#D97706]">
            <Clock className="w-4 h-4 shrink-0" />
            <span>One student has confirmed completion. Awaiting second confirmation.</span>
          </div>
        )}
      </div>

      {/* Agreed Pricing & Recorded Earnings Box */}
      <div className="hh-card p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-[#64748B] block">Agreed Final Amount</span>
          <span className="text-xl font-bold text-[#0F172A] tracking-tight">₹{gig.agreed_price}</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-[#64748B] block">Payment Method</span>
          <span className="text-xs font-bold text-[#059669]">Direct UPI / Cash</span>
        </div>
      </div>

      {/* Consent-Based Contact Card */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {contactShared ? (
              <Unlock className="w-4 h-4 text-[#059669]" />
            ) : (
              <Lock className="w-4 h-4 text-[#64748B]" />
            )}
            <h4 className="text-xs font-bold text-[#0F172A]">
              Consent-Based Direct Contact
            </h4>
          </div>
          <span className="text-[10px] text-[#64748B]">Privacy Protected</span>
        </div>

        {contactShared ? (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Hostel & Room:</span>
              <strong className="text-[#0F172A]">
                {otherParty?.hostel_block}, {otherParty?.room_number || "Room 214"}
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Phone Number:</span>
              <strong className="text-[#0F172A]">{otherParty?.phone_number || "+91 9876543210"}</strong>
            </div>

            {/* External Coordination Handover Action */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
              <a
                href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(
                  otherParty?.full_name || ""
                )},%20I%20am%20coordinating%20for%20our%20HostelHire%20gig%20(Agreed:%20₹${
                  gig.agreed_price
                })`}
                target="_blank"
                rel="noreferrer"
                className="hh-btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 bg-[#ECFDF5] border-[#A7F3D0] text-[#059669] font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+919876543210"
                className="hh-btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-[#475569]" />
                <span>Call Peer</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl">
            <p className="text-xs text-[#64748B] mb-2">
              Contact details are locked until both parties agree to share.
            </p>
            <button
              onClick={() => {
                setContactShared(true);
                onConsentContact(gig.id);
              }}
              className="hh-btn-primary py-1.5 px-3 text-xs"
            >
              Share My Contact Details
            </button>
          </div>
        )}
      </div>

      {/* Two-Way Completion Action */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <h4 className="text-xs font-bold text-[#0F172A]">
          Mutual Completion Confirmation
        </h4>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Both the seeker and the provider must verify completion before this gig is marked as finished and reviews can be submitted.
        </p>

        {gig.status === "COMPLETED" ? (
          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#059669]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gig Successfully Completed</span>
            </div>
            <p className="text-[11px] text-[#047857] mt-0.5">
              Payment confirmed and trust records updated.
            </p>
          </div>
        ) : (
          <button
            onClick={() => {
              setHasConfirmed(true);
              onConfirmCompletion(gig.id);
            }}
            disabled={hasConfirmed}
            className={`w-full py-2.5 text-xs font-bold rounded-lg transition-all ${
              hasConfirmed
                ? "bg-[#E2E8F0] text-[#64748B] cursor-not-allowed"
                : "hh-btn-primary"
            }`}
          >
            {hasConfirmed ? "✓ You Confirmed Completion (Pending Peer)" : "Mark Task as Completed"}
          </button>
        )}
      </div>

      {/* Safety & Report Link */}
      <div className="text-center pt-2">
        <button className="text-[11px] text-[#EF4444] hover:underline flex items-center justify-center gap-1 mx-auto">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report a problem with this gig</span>
        </button>
      </div>
    </div>
  );
}

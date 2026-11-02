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
  Copy,
  Check,
  MapPin,
  HeartHandshake,
} from "lucide-react";
import { Gig, Profile } from "@/types/database.types";
import { getWhatsAppUrl, getTelUrl, isFemaleHostel, maskPhoneNumber } from "@/lib/contact";

interface GigLifecycleViewProps {
  gig: Gig;
  currentUserRole: "seeker" | "provider";
  onBack: () => void;
  onConfirmCompletion: (gigId: string) => void;
  onConsentContact: (gigId: string) => void;
  onAcceptRequest?: (gigId: string) => void;
  onRejectRequest?: (gigId: string) => void;
  currentUser?: Profile;
}

export function GigLifecycleView({
  gig,
  currentUserRole,
  onBack,
  onConfirmCompletion,
  onConsentContact,
  onAcceptRequest,
  onRejectRequest,
  currentUser,
}: GigLifecycleViewProps) {
  const [contactShared, setContactShared] = useState(true); // Demo default unlocked or toggleable
  const [copied, setCopied] = useState(false);
  const [femaleConsentApproved, setFemaleConsentApproved] = useState(false);
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

      {/* Girl-to-Boy Request Moderation & Decision Card */}
      {gig.status === "INTERESTED" && isFemaleHostel(gig.provider?.hostel_block) && (
        currentUserRole === "provider" ? (
          <div className="p-4 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B21A8] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#9333EA]" />
                Incoming Service Request
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE] font-bold">Action Required</span>
            </div>
            <p className="text-xs text-[#7E22CE]/90 leading-relaxed">
              <strong>{gig.seeker?.full_name}</strong> from <strong>{gig.seeker?.hostel_block}</strong> has requested your service. In accordance with campus policy, meeting takes place at a Campus Common Hub.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-[#E9D5FF] flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Requester:</span>
                <strong className="text-[#0F172A]">{gig.seeker?.full_name} ({gig.seeker?.department})</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Proposed Amount:</span>
                <strong className="text-[#059669]">₹{gig.agreed_price}</strong>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAcceptRequest && onAcceptRequest(gig.id)}
                className="py-2.5 px-3 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Request</span>
              </button>
              <button
                type="button"
                onClick={() => onRejectRequest && onRejectRequest(gig.id)}
                className="py-2.5 px-3 bg-white hover:bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Decline / Reject</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <span className="text-xs font-bold text-[#92400E]">Service Request Sent • Awaiting Approval</span>
            </div>
            <p className="text-[11px] text-[#B45309] leading-relaxed">
              You requested this service from <strong>{gig.provider?.full_name}</strong>. Per Girls Hostel campus safety regulations, contact and handover details remain locked until she reviews and accepts your request.
            </p>
          </div>
        )
      )}

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
          <span className="text-[10px] text-[#64748B]">
            {isFemaleHostel(otherParty?.hostel_block) ? "GH Privacy Shield" : "Privacy Protected"}
          </span>
        </div>

        {/* Girls Hostel Privacy Shield Banner */}
        {isFemaleHostel(otherParty?.hostel_block) && !isFemaleHostel(currentUser?.hostel_block) && (
          <div className="p-3 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#9333EA] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#6B21A8]">
                <span>Girls Hostel Privacy Shield Active</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#F3E8FF] rounded font-bold">JEC Rules</span>
              </div>
              <p className="text-[11px] text-[#7E22CE]/80 leading-relaxed mt-0.5">
                Per campus safety regulations, male students cannot enter Girls Hostels. Room handovers are relocated to campus common hubs, and direct phone contact requires female approval.
              </p>
            </div>
          </div>
        )}

        {/* Mutual Female Peer Trust Banner */}
        {isFemaleHostel(otherParty?.hostel_block) && isFemaleHostel(currentUser?.hostel_block) && (
          <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#059669]">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span className="font-semibold text-[11px]">
              Verified Girls Hostel Peer Collaboration — Full room & WhatsApp details unlocked.
            </span>
          </div>
        )}

        {contactShared ? (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Coordination Meeting Point:</span>
              <strong className="text-[#0F172A] text-right">
                {isFemaleHostel(otherParty?.hostel_block) && !isFemaleHostel(currentUser?.hostel_block)
                  ? "Campus Common Hub (Central Library / Admin Canteen / GH Gate)"
                  : `${otherParty?.hostel_block}, ${otherParty?.room_number || "Room 214"}`}
              </strong>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Phone Number:</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-[#0F172A]">
                  {isFemaleHostel(otherParty?.hostel_block) &&
                  !isFemaleHostel(currentUser?.hostel_block) &&
                  !femaleConsentApproved
                    ? maskPhoneNumber(otherParty?.phone_number)
                    : otherParty?.phone_number || "+91 9876543210"}
                </strong>
                {(!isFemaleHostel(otherParty?.hostel_block) ||
                  isFemaleHostel(currentUser?.hostel_block) ||
                  femaleConsentApproved) && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(otherParty?.phone_number || "+919876543210");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1 hover:bg-[#E2E8F0] rounded text-[#64748B] hover:text-[#0F172A]"
                    title="Copy Phone Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Female Student Explicit Approval Action */}
            {isFemaleHostel(currentUser?.hostel_block) &&
              !isFemaleHostel(otherParty?.hostel_block) &&
              !femaleConsentApproved && (
                <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-1.5">
                  <span className="text-[11px] text-[#64748B]">
                    Do you want to share your WhatsApp and phone number with {otherParty?.full_name}?
                  </span>
                  <button
                    type="button"
                    onClick={() => setFemaleConsentApproved(true)}
                    className="hh-btn-primary py-2 text-xs font-bold bg-[#9333EA] hover:bg-[#7E22CE] border-none flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Approve Contact Share with {otherParty?.full_name}</span>
                  </button>
                </div>
              )}

            {/* External Coordination Handover Action */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
              {isFemaleHostel(otherParty?.hostel_block) &&
              !isFemaleHostel(currentUser?.hostel_block) &&
              !femaleConsentApproved ? (
                <div className="col-span-2 py-2 px-3 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-center text-xs text-[#64748B] font-medium flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Awaiting Female Student Approval to Reveal Contact</span>
                </div>
              ) : (
                <>
                  <a
                    href={getWhatsAppUrl(
                      otherParty?.phone_number,
                      `Hi ${otherParty?.full_name || "peer"}, I am coordinating with you for our HostelHire gig (Agreed: ₹${gig.agreed_price}). Are you free to coordinate?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hh-btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 bg-[#ECFDF5] border-[#A7F3D0] text-[#059669] font-bold hover:bg-[#D1FAE5]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={getTelUrl(otherParty?.phone_number)}
                    className="hh-btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 font-bold hover:bg-[#F1F5F9]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Call Peer</span>
                  </a>
                </>
              )}
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

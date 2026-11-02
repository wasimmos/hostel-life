"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Users,
  Briefcase,
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Building,
} from "lucide-react";

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [reports, setReports] = useState([
    {
      id: "rep-101",
      reportedUser: "Debojit Sharma (Hostel 4)",
      reporter: "Wasim Ahmed (Hostel 4)",
      reason: "No-show after agreed time for LaTeX review",
      category: "NO_SHOW",
      date: "Today, 4:30 PM",
      status: "PENDING",
    },
    {
      id: "rep-102",
      reportedUser: "Anonymous Poster",
      reporter: "Rhea Goswami (GH 2)",
      reason: "Requested contact details before gig was agreed",
      category: "INAPPROPRIATE_CONTACT",
      date: "Yesterday",
      status: "INVESTIGATING",
    },
  ]);

  const [auditLog, setAuditLog] = useState<string[]>([
    "Admin dismissed report #rep-098 (Spam flag) • 2 days ago",
    "Admin verified student profile 'Wasim Ahmed' (Roll: 2481102401) • 3 days ago",
  ]);

  const handleAction = (reportId: string, action: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setAuditLog([`Admin executed '${action}' on report #${reportId} • Just now`, ...auditLog]);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </button>

      {/* Header */}
      <div className="hh-card p-4 bg-[#1E40AF] text-white flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#82F5C1]" />
          <span className="text-[11px] font-bold tracking-wider text-[#82F5C1] uppercase">
            Campus Moderation & Governance
          </span>
        </div>
        <h2 className="text-base font-bold">JEC Hostel Administration Console</h2>
        <p className="text-xs text-[#a8b8ff]">
          Maintain campus safety, audit peer trust records, and supervise student micro-gigs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="hh-card p-3">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="text-[11px] font-medium">Campus Volume</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">₹18,450</span>
          <span className="text-[10px] text-[#059669] block mt-0.5">Direct peer income</span>
        </div>

        <div className="hh-card p-3">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="text-[11px] font-medium">Verified Students</span>
            <Users className="w-3.5 h-3.5 text-[#1E40AF]" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">184</span>
          <span className="text-[10px] text-[#64748B] block mt-0.5">Across 7 hostels</span>
        </div>

        <div className="hh-card p-3">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="text-[11px] font-medium">Completed Gigs</span>
            <Briefcase className="w-3.5 h-3.5 text-[#1E40AF]" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">92</span>
          <span className="text-[10px] text-[#64748B] block mt-0.5">100% mutual sign-off</span>
        </div>

        <div className="hh-card p-3">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="text-[11px] font-medium">Pending Reports</span>
            <AlertOctagon className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <span className="text-xl font-bold text-[#D97706]">{reports.length}</span>
          <span className="text-[10px] text-[#D97706] block mt-0.5">Requires review</span>
        </div>
      </div>

      {/* Active Incident Reports */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
          Flagged Incidents & Disputes ({reports.length})
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-[#64748B] py-3 text-center">
            Zero active reports. All campus transactions are in good standing.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#92400E] font-bold">{rep.category}</strong>
                  <span className="text-[10px] text-[#B45309]">{rep.date}</span>
                </div>

                <p className="text-xs text-[#0F172A]">
                  <strong>Target:</strong> {rep.reportedUser}
                  <br />
                  <strong>Reason:</strong> {rep.reason}
                </p>

                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[#FDE68A]">
                  <button
                    onClick={() => handleAction(rep.id, "DISMISSED")}
                    className="hh-btn-secondary py-1 px-2.5 text-[11px]"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleAction(rep.id, "WARNED")}
                    className="py-1 px-2.5 bg-[#D97706] text-white font-bold rounded-md text-[11px]"
                  >
                    Send Warning
                  </button>
                  <button
                    onClick={() => handleAction(rep.id, "RESTRICTED")}
                    className="py-1 px-2.5 bg-[#DC2626] text-white font-bold rounded-md text-[11px]"
                  >
                    Restrict
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Institutional Skill Discovery View (For College Admin to hire students) */}
      <div className="hh-card p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-[#1E40AF]" />
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Institutional Skill Pool
          </h3>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Aggregated talent for campus events, IT maintenance, and departmental media:
        </p>

        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="font-semibold text-[#0F172A]">Electronics & Hardware Fixers</span>
            <span className="text-[#1E40AF] font-bold">28 Students</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="font-semibold text-[#0F172A]">LaTeX & Technical Typesetters</span>
            <span className="text-[#1E40AF] font-bold">42 Students</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="font-semibold text-[#0F172A]">Graphic & Poster Designers</span>
            <span className="text-[#1E40AF] font-bold">36 Students</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-[#0F172A]">Peer Engineering Tutors</span>
            <span className="text-[#1E40AF] font-bold">19 Students</span>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="hh-card p-4">
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
          Moderation Audit Log
        </h3>
        <ul className="text-[11px] text-[#64748B] space-y-1.5 list-disc pl-4">
          {auditLog.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Bell, ShieldCheck } from "lucide-react";

interface TopHeaderProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function TopHeader({ onNotificationClick, onProfileClick }: TopHeaderProps) {
  return (
    <header className="sticky top-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-30 border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-bold text-base tracking-tight">
          H
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-[#0F172A] tracking-tight leading-none">
              HostelHire
            </h1>
            <span className="hh-badge-verified text-[10px] py-0.5 px-1.5">
              <ShieldCheck className="w-3 h-3 text-[#059669]" />
              JEC Campus
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5">
            Jorhat Engineering College
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNotificationClick}
          className="relative w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1E40AF]"></span>
        </button>

        <button
          onClick={onProfileClick}
          className="w-9 h-9 rounded-lg border border-[#CBD5E1] bg-white overflow-hidden flex items-center justify-center font-bold text-xs text-[#1E40AF]"
          aria-label="User Profile"
        >
          WA
        </button>
      </div>
    </header>
  );
}

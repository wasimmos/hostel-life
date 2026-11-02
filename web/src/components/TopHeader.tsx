"use client";

import React from "react";
import { Bell } from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";

interface TopHeaderProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
}

export function TopHeader({
  onNotificationClick,
  onProfileClick,
  onAdminClick,
  isAdmin,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-30 border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-bold text-base tracking-tight shrink-0">
          H
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-[#0F172A] tracking-tight leading-none">
              HostelHire
            </h1>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5">
            Jorhat Engineering College
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <RoleSwitcher />

        {isAdmin && (
          <button
            onClick={onAdminClick}
            className="px-2 py-1 bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] rounded-lg text-xs font-bold hover:bg-[#FEF3C7] transition-colors"
          >
            Admin
          </button>
        )}

        <button
          onClick={onNotificationClick}
          className="relative w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1E40AF]"></span>
        </button>
      </div>
    </header>
  );
}

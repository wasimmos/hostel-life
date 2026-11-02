"use client";

import React from "react";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TopHeaderProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  unreadCount?: number;
}

export function TopHeader({
  onNotificationClick,
  onProfileClick,
  onAdminClick,
  isAdmin,
  unreadCount = 0,
}: TopHeaderProps) {
  const { user, isRealAuth, setIsAuthModalOpen, signOut } = useAuth();

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
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#E2E8F0] rounded-lg">
          <div className="w-5 h-5 rounded-full bg-[#1E40AF] text-white flex items-center justify-center text-[10px] font-bold">
            {user.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-[#0F172A] leading-none max-w-[95px] truncate">
              {user.full_name?.split(" ")[0]}
            </span>
            <span className="text-[9px] text-[#64748B] leading-none mt-0.5 max-w-[95px] truncate">
              {user.hostel_block}
            </span>
          </div>
        </div>

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
          title="Campus Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1E40AF] text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => signOut()}
          className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#FEF2F2] hover:border-[#FCA5A5] flex items-center justify-center text-[#64748B] hover:text-[#DC2626] transition-colors"
          title="Sign Out / Switch Persona"
          aria-label="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}

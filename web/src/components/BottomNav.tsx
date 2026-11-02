"use client";

import React from "react";
import { Compass, Briefcase, PlusCircle, Wallet, User } from "lucide-react";

export type TabType = "explore" | "activity" | "post" | "earnings" | "profile";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  interface TabItem {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isAction?: boolean;
  }

  const tabs: TabItem[] = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "activity", label: "My Gigs", icon: Briefcase },
    { id: "post", label: "Post", icon: PlusCircle, isAction: true },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[#E2E8F0] px-3 py-2 z-40 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center -mt-5"
              aria-label="Post a Gig or Request"
            >
              <div className="w-12 h-12 rounded-full bg-[#1E40AF] text-white flex items-center justify-center border-2 border-white hover:bg-[#1D4ED8] transition-colors">
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-semibold text-[#1E40AF] mt-1">Post</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${
              isActive ? "text-[#1E40AF]" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            <span
              className={`text-[11px] mt-1 tracking-tight ${
                isActive ? "font-bold text-[#1E40AF]" : "font-medium"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserCheck, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const { user, switchUser, availableUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#eaedff] border border-[#dae2fd] rounded-lg text-xs font-semibold text-[#1E40AF] hover:bg-[#dbe4ff] transition-colors"
      >
        <UserCheck className="w-3.5 h-3.5 text-[#1E40AF]" />
        <span className="max-w-[120px] truncate">{user.full_name}</span>
        <ChevronDown className="w-3 h-3 text-[#444653]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-2 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 py-1">
              Switch Test Student Persona
            </span>
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setIsOpen(false);
                }}
                className={`flex flex-col text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
                  u.id === user.id
                    ? "bg-[#1E40AF] text-white"
                    : "hover:bg-[#F8FAFC] text-[#0F172A]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{u.full_name}</span>
                  <span
                    className={`text-[10px] ${
                      u.id === user.id ? "text-white/80" : "text-[#64748B]"
                    }`}
                  >
                    {u.hostel_block}
                  </span>
                </div>
                <span
                  className={`text-[11px] ${
                    u.id === user.id ? "text-white/80" : "text-[#64748B]"
                  }`}
                >
                  {u.department} • Sem {u.semester}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

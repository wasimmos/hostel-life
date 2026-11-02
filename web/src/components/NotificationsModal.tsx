"use client";

import React from "react";
import { X, CheckCheck, Bell, MessageSquare, DollarSign, Star, Info } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "gig" | "payment" | "review" | "alert";
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}: NotificationsModalProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "gig":
        return <MessageSquare className="w-4 h-4 text-[#1E40AF]" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-[#059669]" />;
      case "review":
        return <Star className="w-4 h-4 text-[#D97706]" />;
      case "alert":
        return <Info className="w-4 h-4 text-[#475569]" />;
      default:
        return <Bell className="w-4 h-4 text-[#1E40AF]" />;
    }
  };

  const getBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "gig":
        return "bg-[#eaedff]";
      case "payment":
        return "bg-[#ECFDF5]";
      case "review":
        return "bg-[#FFFBEB]";
      case "alert":
        return "bg-[#F1F5F9]";
      default:
        return "bg-[#F1F5F9]";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-[480px] bg-white rounded-b-2xl sm:rounded-2xl p-4 border border-[#E2E8F0] shadow-xl flex flex-col gap-3 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#1E40AF] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] leading-none">Notifications</h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 divide-y divide-[#F8FAFC]">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-[#64748B] text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification && onSelectNotification(n)}
                className={`pt-2.5 pb-2 px-2 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                  n.read ? "bg-white hover:bg-[#F8FAFC]" : "bg-[#F8FAFC] hover:bg-[#F1F5F9]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${getBg(
                    n.type
                  )} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs ${
                        n.read ? "font-semibold text-[#334155]" : "font-bold text-[#0F172A]"
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-[#94A3B8] shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#1E40AF] shrink-0 mt-2"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#F1F5F9] text-center">
          <button
            onClick={onClose}
            className="hh-btn-secondary w-full py-2 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

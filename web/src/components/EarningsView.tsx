"use client";

import React from "react";
import { Wallet, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function EarningsView() {
  const transactions = [
    {
      id: "tx-1",
      title: "Laptop Thermal Paste & Deep Dust Cleanout",
      peer: "Bikash Kalita (Hostel 1)",
      amount: 180,
      date: "Yesterday",
      confirmed: true,
    },
    {
      id: "tx-2",
      title: "LaTeX Typesetting Lab Record",
      peer: "Rhea Goswami (GH 2)",
      amount: 80,
      date: "28 Oct 2026",
      confirmed: true,
    },
    {
      id: "tx-3",
      title: "Windows 11 Clean Install & MATLAB Setup",
      peer: "Debojit Sharma (Hostel 4)",
      amount: 120,
      date: "25 Oct 2026",
      confirmed: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-base font-bold text-[#0F172A]">Earnings & Economic Ledger</h2>
        <p className="text-xs text-[#64748B]">
          Transparent, wallet-free record of completed campus micro-monetization.
        </p>
      </div>

      {/* Main Stats Card */}
      <div className="hh-card p-5 bg-gradient-to-br from-[#1E40AF] to-[#00288E] text-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#a8b8ff]">Total Reported Earnings</span>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight">₹2,450</span>
          <span className="text-xs text-[#a8b8ff]">INR earned on campus</span>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#b8c4ff]">
          <span>Direct Peer-to-Peer UPI</span>
          <span className="font-semibold text-white">0% Platform Fee</span>
        </div>
      </div>

      {/* Notice Card */}
      <div className="hh-card p-3 bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-2.5 text-xs text-[#065F46]">
        <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Community-Audited Transactions</strong>
          All transactions are paid directly between students without intermediaries. Completed gigs require mutual sign-off.
        </div>
      </div>

      {/* Transaction Records */}
      <div className="hh-card p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
          Recent Completed Receipts
        </h3>

        <div className="flex flex-col divide-y divide-[#F1F5F9]">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0F172A]">{tx.title}</span>
                <span className="text-[11px] text-[#64748B]">
                  From: {tx.peer} • {tx.date}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-[#059669] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +₹{tx.amount}
                </span>
                <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                  Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

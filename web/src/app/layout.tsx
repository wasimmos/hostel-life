import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HostelHire — Campus Micro-Gig Marketplace",
  description: "Peer-to-peer skill monetization and micro-gigs for hostel residents at Jorhat Engineering College.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1E40AF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans antialiased`}>
      <body className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex justify-center">
        {/* Mobile viewport container restricted to max-w-[480px] per DESIGN.md */}
        <div className="w-full max-w-[480px] min-h-screen bg-[#F8FAFC] flex flex-col relative pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}

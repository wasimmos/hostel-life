"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav, TabType } from "@/components/BottomNav";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { GigLifecycleView } from "@/components/GigLifecycleView";
import { PostModal } from "@/components/PostModal";
import { ProfileView } from "@/components/ProfileView";
import { MyGigsList } from "@/components/MyGigsList";
import { EarningsView } from "@/components/EarningsView";
import { ServiceListing, ServiceRequest, Gig, Profile, Review } from "@/types/database.types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Mock initial student user
  const currentUser: Profile = {
    id: "11111111-1111-1111-1111-111111111111",
    full_name: "Wasim Ahmed",
    roll_number: "2481102401",
    college_email: "wasim.ee@jecassam.ac.in",
    department: "Electrical Engineering",
    semester: 5,
    hostel_block: "Hostel 4",
    room_number: "Room 214",
    phone_number: "+91 9876543210",
    bio: "Electronics enthusiast. Can fix laptops, format OS, and repair small electricals.",
    is_admin: true,
    created_at: "2026-10-30T10:00:00.000Z",
    updated_at: "2026-10-30T10:00:00.000Z",
  };

  // Mock listings
  const [listings, setListings] = useState<(ServiceListing & { provider: any })[]>([
    {
      id: "a1",
      provider_id: currentUser.id,
      title: "Laptop Thermal Paste & Deep Dust Cleanout",
      description: "Will open your laptop safely, clean heatsink fans, and apply Arctic MX-4 thermal paste. Brings down temps by 15-20°C.",
      skill_category: "Electronics & Hardware",
      indicative_price: 180,
      turnaround_time: "Same Day (2 hrs)",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: currentUser,
    },
    {
      id: "a2",
      provider_id: "2222",
      title: "LaTeX Typesetting & Lab Record Margin Formatting",
      description: "Send your raw Word or handwritten files. I format them into clean IEEE/college-compliant LaTeX PDFs ready for printing.",
      skill_category: "Academic Support",
      indicative_price: 80,
      turnaround_time: "Overnight (12 hrs)",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "2222",
        full_name: "Rhea Goswami",
        department: "Computer Science",
        semester: 5,
        hostel_block: "Girls Hostel 2",
        room_number: "Room 108",
        phone_number: "+91 9876543211",
        college_email: "rhea.cse@jecassam.ac.in",
        is_admin: false,
        created_at: "2026-10-30T10:00:00.000Z",
        updated_at: "2026-10-30T10:00:00.000Z",
      },
    },
    {
      id: "a3",
      provider_id: "3333",
      title: "Engineering Graphics (ED) Sheet Assistance & CAD 2D",
      description: "Struggling with isometric projections or sectional views? 1-on-1 sheet drawing assistance in my room.",
      skill_category: "Academic Support",
      indicative_price: 140,
      turnaround_time: "Flexible",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "3333",
        full_name: "Anupam Saikia",
        department: "Electrical Engg",
        semester: 5,
        hostel_block: "Hostel 3",
        room_number: "Room 302",
        phone_number: "+91 9876543212",
        college_email: "anupam.ee@jecassam.ac.in",
        is_admin: false,
        created_at: "2026-10-30T10:00:00.000Z",
        updated_at: "2026-10-30T10:00:00.000Z",
      },
    },
    {
      id: "a4",
      provider_id: "4444",
      title: "Shirt / Trouser Quick Stitching & Button Replacement",
      description: "Torn shirt pocket, loose hem, or missing button before formal placement drive? Quick manual stitching fix.",
      skill_category: "Hostel Essentials",
      indicative_price: 40,
      turnaround_time: "30 Minutes",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "4444",
        full_name: "Bikash Kalita",
        department: "Mechanical Engg",
        semester: 7,
        hostel_block: "Hostel 1",
        room_number: "Room 112",
        phone_number: "+91 9876543213",
        college_email: "bikash.me@jecassam.ac.in",
        is_admin: false,
        created_at: "2026-10-30T10:00:00.000Z",
        updated_at: "2026-10-30T10:00:00.000Z",
      },
    },
  ]);

  // Mock requests
  const [requests, setRequests] = useState<(ServiceRequest & { seeker: any })[]>([
    {
      id: "b1",
      seeker_id: "5555",
      title: "Need urgent help fixing margins in LaTeX S5 Lab Manual",
      description: "Due tomorrow 9 AM. I have tables overflowing the page border and figures refusing to align in center.",
      skill_category: "Academic Support",
      expected_budget: 100,
      urgency: "Urgent (Tonight)",
      is_open: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "5555",
        full_name: "Debojit Sharma",
        department: "Civil Engineering",
        semester: 3,
        hostel_block: "Hostel 4",
        room_number: "Room 205",
        phone_number: "+91 9876543214",
        college_email: "debojit.ce@jecassam.ac.in",
        is_admin: false,
        created_at: "2026-10-30T10:00:00.000Z",
        updated_at: "2026-10-30T10:00:00.000Z",
      },
    },
    {
      id: "b2",
      seeker_id: "4444",
      title: "Bicycle tire puncture repair near Hostel 1",
      description: "Cycle flat tire, need someone with puncture kit and patch. Will pay ₹60 cash or UPI immediately.",
      skill_category: "Hostel Essentials",
      expected_budget: 60,
      urgency: "Within 3 hours",
      is_open: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "4444",
        full_name: "Bikash Kalita",
        department: "Mechanical Engg",
        semester: 7,
        hostel_block: "Hostel 1",
        room_number: "Room 112",
        phone_number: "+91 9876543213",
        college_email: "bikash.me@jecassam.ac.in",
        is_admin: false,
        created_at: "2026-10-30T10:00:00.000Z",
        updated_at: "2026-10-30T10:00:00.000Z",
      },
    },
  ]);

  // Mock Gigs
  const [gigs, setGigs] = useState<(Gig & { seeker: any; provider: any })[]>([
    {
      id: "gig-101",
      source_type: "LISTING",
      source_id: "a1",
      seeker_id: "4444",
      provider_id: currentUser.id,
      accepted_interest_id: "int-1",
      agreed_price: 180,
      status: "ACCEPTED",
      created_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "4444",
        full_name: "Bikash Kalita",
        hostel_block: "Hostel 1",
        room_number: "Room 112",
        phone_number: "+91 9876543213",
      },
      provider: currentUser,
    },
    {
      id: "gig-102",
      source_type: "LISTING",
      source_id: "a2",
      seeker_id: currentUser.id,
      provider_id: "2222",
      accepted_interest_id: "int-2",
      agreed_price: 80,
      status: "COMPLETED",
      created_at: "2026-10-28T10:00:00.000Z",
      completed_at: "2026-10-29T10:00:00.000Z",
      seeker: currentUser,
      provider: {
        id: "2222",
        full_name: "Rhea Goswami",
        hostel_block: "Girls Hostel 2",
        room_number: "Room 108",
        phone_number: "+91 9876543211",
      },
    },
  ]);

  // Mock reviews
  const mockReviews: (Review & { reviewer: any })[] = [
    {
      id: "rev-1",
      gig_id: "gig-102",
      reviewer_id: "4444",
      reviewed_user_id: currentUser.id,
      rating: 5,
      comment: "Cleaned my laptop fan completely and replaced thermal paste right in his room. Temps dropped by 18°C. Highly recommend!",
      created_at: "2 days ago",
      reviewer: {
        id: "4444",
        full_name: "Bikash Kalita",
      },
    },
    {
      id: "rev-2",
      gig_id: "gig-103",
      reviewer_id: "5555",
      reviewed_user_id: currentUser.id,
      rating: 5,
      comment: "Helped me dual boot Ubuntu for our OS lab assignment. Very helpful senior.",
      created_at: "5 days ago",
      reviewer: {
        id: "5555",
        full_name: "Debojit Sharma",
      },
    },
  ];

  // Actions
  const handleTabChange = (tab: TabType) => {
    if (tab === "post") {
      setIsPostModalOpen(true);
    } else {
      setSelectedGig(null);
      setActiveTab(tab);
    }
  };

  const handleAddListing = (data: any) => {
    const newListing = {
      id: `a-${Date.now()}`,
      provider_id: currentUser.id,
      ...data,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: currentUser,
    };
    setListings([newListing, ...listings]);
    setActiveTab("explore");
  };

  const handleAddRequest = (data: any) => {
    const newReq = {
      id: `b-${Date.now()}`,
      seeker_id: currentUser.id,
      ...data,
      is_open: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seeker: currentUser,
    };
    setRequests([newReq, ...requests]);
    setActiveTab("explore");
  };

  const handleConfirmGigCompletion = (gigId: string) => {
    setGigs((prev) =>
      prev.map((g) => (g.id === gigId ? { ...g, status: "COMPLETED" as const } : g))
    );
    if (selectedGig && selectedGig.id === gigId) {
      setSelectedGig({ ...selectedGig, status: "COMPLETED" });
    }
  };

  return (
    <>
      <TopHeader
        onProfileClick={() => {
          setSelectedGig(null);
          setActiveTab("profile");
        }}
      />

      <main className="flex-1">
        {selectedGig ? (
          <GigLifecycleView
            gig={selectedGig}
            currentUserRole={selectedGig.seeker_id === currentUser.id ? "seeker" : "provider"}
            onBack={() => setSelectedGig(null)}
            onConfirmCompletion={handleConfirmGigCompletion}
            onConsentContact={() => {}}
          />
        ) : activeTab === "explore" ? (
          <DiscoveryFeed
            listings={listings}
            requests={requests}
            onSelectListing={(listing) => {
              // Create or jump into gig view
              const existing = gigs.find((g) => g.source_id === listing.id);
              if (existing) {
                setSelectedGig(existing);
              } else {
                // Mock instant engagement creation
                const newGig: Gig & { seeker: any; provider: any } = {
                  id: `gig-${Date.now().toString().slice(-4)}`,
                  source_type: "LISTING",
                  source_id: listing.id,
                  seeker_id: currentUser.id,
                  provider_id: listing.provider_id,
                  accepted_interest_id: `int-${Date.now()}`,
                  agreed_price: listing.indicative_price,
                  status: "ACCEPTED",
                  created_at: new Date().toISOString(),
                  seeker: currentUser,
                  provider: (listing as any).provider,
                };
                setGigs([newGig, ...gigs]);
                setSelectedGig(newGig);
              }
            }}
            onSelectRequest={(request) => {
              const newGig: Gig & { seeker: any; provider: any } = {
                id: `gig-${Date.now().toString().slice(-4)}`,
                source_type: "REQUEST",
                source_id: request.id,
                seeker_id: request.seeker_id,
                provider_id: currentUser.id,
                accepted_interest_id: `int-${Date.now()}`,
                agreed_price: request.expected_budget,
                status: "ACCEPTED",
                created_at: new Date().toISOString(),
                seeker: (request as any).seeker,
                provider: currentUser,
              };
              setGigs([newGig, ...gigs]);
              setSelectedGig(newGig);
            }}
          />
        ) : activeTab === "activity" ? (
          <MyGigsList gigs={gigs} onSelectGig={(g) => setSelectedGig(g)} />
        ) : activeTab === "earnings" ? (
          <EarningsView />
        ) : (
          <ProfileView
            profile={currentUser}
            reviews={mockReviews}
            onBack={() => setActiveTab("explore")}
          />
        )}
      </main>

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmitListing={handleAddListing}
        onSubmitRequest={handleAddRequest}
      />

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}

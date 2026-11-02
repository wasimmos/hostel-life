"use client";

import React, { useState, useEffect } from "react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav, TabType } from "@/components/BottomNav";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { GigLifecycleView } from "@/components/GigLifecycleView";
import { PostModal } from "@/components/PostModal";
import { AuthModal } from "@/components/AuthModal";
import { ProfileView } from "@/components/ProfileView";
import { MyGigsList } from "@/components/MyGigsList";
import { EarningsView } from "@/components/EarningsView";
import { AdminPanel } from "@/components/AdminPanel";
import { LoginScreen } from "@/components/LoginScreen";
import { NotificationsModal, NotificationItem } from "@/components/NotificationsModal";
import { useAuth } from "@/context/AuthContext";
import { isFemaleHostel } from "@/lib/contact";
import {
  fetchListings,
  fetchRequests,
  createServiceListing,
  createServiceRequest,
  acceptGigInterestRPC,
  confirmGigCompletionRPC,
} from "@/lib/api";
import { ServiceListing, ServiceRequest, Gig, Review } from "@/types/database.types";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Campus Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Interest Accepted! ⚡",
      message: "Wasim Ahmed accepted your request for 'LaTeX S5 Lab Manual'. Contact details unlocked.",
      time: "5m ago",
      read: false,
      type: "gig",
    },
    {
      id: "notif-2",
      title: "New Student Interest 💬",
      message: "Debojit Sharma proposed ₹180 for 'Laptop Thermal Paste Cleanout'.",
      time: "40m ago",
      read: false,
      type: "gig",
    },
    {
      id: "notif-3",
      title: "Payment Recorded 💰",
      message: "₹80 payment confirmed for IEEE Seminar Report Typesetting.",
      time: "2h ago",
      read: false,
      type: "payment",
    },
    {
      id: "notif-4",
      title: "Hostel 4 Maintenance 📢",
      message: "LAN switch maintenance scheduled tomorrow 2:00 PM – 4:00 PM.",
      time: "1d ago",
      read: true,
      type: "alert",
    },
  ]);

  // Discovery Listings State
  const [listings, setListings] = useState<(ServiceListing & { provider: any })[]>([
    {
      id: "a1",
      provider_id: "11111111-1111-1111-1111-111111111111",
      title: "Laptop Thermal Paste & Deep Dust Cleanout",
      description: "Will open your laptop safely, clean heatsink fans, and apply Arctic MX-4 thermal paste. Brings down temps by 15-20°C.",
      skill_category: "Electronics & Hardware",
      indicative_price: 180,
      turnaround_time: "Same Day (2 hrs)",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "11111111-1111-1111-1111-111111111111",
        full_name: "Wasim Ahmed",
        department: "Electrical Engineering",
        semester: 5,
        hostel_block: "Hostel 4",
        room_number: "Room 214",
        phone_number: "+91 9876543210",
      },
    },
    {
      id: "a2",
      provider_id: "22222222-2222-2222-2222-222222222222",
      title: "LaTeX Typesetting & Lab Record Margin Formatting",
      description: "Send your raw Word or handwritten files. I format them into clean IEEE/college-compliant LaTeX PDFs ready for printing.",
      skill_category: "Academic Support",
      indicative_price: 80,
      turnaround_time: "Overnight (12 hrs)",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "22222222-2222-2222-2222-222222222222",
        full_name: "Rhea Goswami",
        department: "Computer Science",
        semester: 5,
        hostel_block: "Girls Hostel 2",
        room_number: "Room 108",
        phone_number: "+91 9876543211",
      },
    },
    {
      id: "a3",
      provider_id: "33333333-3333-3333-3333-333333333333",
      title: "Engineering Graphics (ED) Sheet Assistance & CAD 2D",
      description: "Struggling with isometric projections or sectional views? 1-on-1 sheet drawing assistance in my room.",
      skill_category: "Academic Support",
      indicative_price: 140,
      turnaround_time: "Flexible",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "33333333-3333-3333-3333-333333333333",
        full_name: "Anupam Saikia",
        department: "Electrical Engg",
        semester: 5,
        hostel_block: "Hostel 3",
        room_number: "Room 302",
        phone_number: "+91 9876543212",
      },
    },
    {
      id: "a4",
      provider_id: "44444444-4444-4444-4444-444444444444",
      title: "Shirt / Trouser Quick Stitching & Button Replacement",
      description: "Torn shirt pocket, loose hem, or missing button before formal placement drive? Quick manual stitching fix.",
      skill_category: "Hostel Essentials",
      indicative_price: 40,
      turnaround_time: "30 Minutes",
      is_active: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      provider: {
        id: "44444444-4444-4444-4444-444444444444",
        full_name: "Bikash Kalita",
        department: "Mechanical Engg",
        semester: 7,
        hostel_block: "Hostel 1",
        room_number: "Room 112",
        phone_number: "+91 9876543213",
      },
    },
  ]);

  // Request Board State
  const [requests, setRequests] = useState<(ServiceRequest & { seeker: any })[]>([
    {
      id: "b1",
      seeker_id: "55555555-5555-5555-5555-555555555555",
      title: "Need urgent help fixing margins in LaTeX S5 Lab Manual",
      description: "Due tomorrow 9 AM. I have tables overflowing the page border and figures refusing to align in center.",
      skill_category: "Academic Support",
      expected_budget: 100,
      urgency: "Urgent (Tonight)",
      is_open: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "55555555-5555-5555-5555-555555555555",
        full_name: "Debojit Sharma",
        department: "Civil Engineering",
        semester: 3,
        hostel_block: "Hostel 4",
        room_number: "Room 205",
        phone_number: "+91 9876543214",
      },
    },
    {
      id: "b2",
      seeker_id: "44444444-4444-4444-4444-444444444444",
      title: "Bicycle tire puncture repair near Hostel 1",
      description: "Cycle flat tire, need someone with puncture kit and patch. Will pay ₹60 cash or UPI immediately.",
      skill_category: "Hostel Essentials",
      expected_budget: 60,
      urgency: "Within 3 hours",
      is_open: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "44444444-4444-4444-4444-444444444444",
        full_name: "Bikash Kalita",
        department: "Mechanical Engg",
        semester: 7,
        hostel_block: "Hostel 1",
        room_number: "Room 112",
        phone_number: "+91 9876543213",
      },
    },
    {
      id: "b3",
      seeker_id: "22222222-2222-2222-2222-222222222222",
      title: "Need senior peer tutor for Digital Signal Processing (GH 2)",
      description: "Looking for a female senior in GH 2 to clarify FFT & IIR filter derivations in hostel study room before internal test.",
      skill_category: "Academic Support",
      expected_budget: 150,
      urgency: "This Weekend",
      is_open: true,
      girls_hostel_only: true,
      created_at: "2026-10-30T10:00:00.000Z",
      updated_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "22222222-2222-2222-2222-222222222222",
        full_name: "Rhea Goswami",
        department: "Computer Science",
        semester: 5,
        hostel_block: "Girls Hostel 2",
        room_number: "Room 108",
        phone_number: "+91 9876543211",
      },
    },
  ]);

  // Gigs State
  const [gigs, setGigs] = useState<(Gig & { seeker: any; provider: any })[]>([
    {
      id: "gig-101",
      source_type: "LISTING",
      source_id: "a1",
      seeker_id: "44444444-4444-4444-4444-444444444444",
      provider_id: "11111111-1111-1111-1111-111111111111",
      accepted_interest_id: "int-1",
      agreed_price: 180,
      status: "ACCEPTED",
      created_at: "2026-10-30T10:00:00.000Z",
      seeker: {
        id: "44444444-4444-4444-4444-444444444444",
        full_name: "Bikash Kalita",
        hostel_block: "Hostel 1",
        room_number: "Room 112",
        phone_number: "+91 9876543213",
      },
      provider: {
        id: "11111111-1111-1111-1111-111111111111",
        full_name: "Wasim Ahmed",
        hostel_block: "Hostel 4",
        room_number: "Room 214",
        phone_number: "+91 9876543210",
      },
    },
    {
      id: "gig-102",
      source_type: "LISTING",
      source_id: "a2",
      seeker_id: "11111111-1111-1111-1111-111111111111",
      provider_id: "22222222-2222-2222-2222-222222222222",
      accepted_interest_id: "int-2",
      agreed_price: 80,
      status: "COMPLETED",
      created_at: "2026-10-28T10:00:00.000Z",
      completed_at: "2026-10-29T10:00:00.000Z",
      seeker: {
        id: "11111111-1111-1111-1111-111111111111",
        full_name: "Wasim Ahmed",
        hostel_block: "Hostel 4",
        room_number: "Room 214",
        phone_number: "+91 9876543210",
      },
      provider: {
        id: "22222222-2222-2222-2222-222222222222",
        full_name: "Rhea Goswami",
        hostel_block: "Girls Hostel 2",
        room_number: "Room 108",
        phone_number: "+91 9876543211",
      },
    },
  ]);

  // Load from Supabase with continuous live polling for cross-device sync
  const loadData = async () => {
    try {
      const liveListings = await fetchListings();
      if (liveListings && liveListings.length > 0) {
        setListings(liveListings);
      }
      const liveRequests = await fetchRequests();
      if (liveRequests && liveRequests.length > 0) {
        setRequests(liveRequests);
      }
    } catch (err) {
      console.error("Data sync error:", err);
    }
  };

  useEffect(() => {
    // Rehydrate any local saved gigs so they persist across page restarts
    try {
      const saved = localStorage.getItem("hostelhire_saved_gigs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGigs((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const extra = parsed.filter((g: any) => !existingIds.has(g.id));
            return [...extra, ...prev];
          });
        }
      }
    } catch {}

    loadData();
    // 5-second polling interval so listings posted on one mobile appear on another immediately
    const pollInterval = setInterval(loadData, 5000);
    return () => clearInterval(pollInterval);
  }, [isAuthenticated]);

  // Mock Reviews
  const mockReviews: (Review & { reviewer: any })[] = [
    {
      id: "rev-1",
      gig_id: "gig-102",
      reviewer_id: "44444444-4444-4444-4444-444444444444",
      reviewed_user_id: user.id,
      rating: 5,
      comment: "Cleaned my laptop fan completely and replaced thermal paste right in his room. Temps dropped by 18°C. Highly recommend!",
      created_at: "2 days ago",
      reviewer: {
        id: "44444444-4444-4444-4444-444444444444",
        full_name: "Bikash Kalita",
      },
    },
    {
      id: "rev-2",
      gig_id: "gig-103",
      reviewer_id: "55555555-5555-5555-5555-555555555555",
      reviewed_user_id: user.id,
      rating: 5,
      comment: "Helped me dual boot Ubuntu for our OS lab assignment. Very patient senior.",
      created_at: "5 days ago",
      reviewer: {
        id: "55555555-5555-5555-5555-555555555555",
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
      setIsAdminView(false);
      setActiveTab(tab);
    }
  };

  const handleAddListing = async (data: any) => {
    const payload = {
      provider_id: user.id,
      title: data.title,
      description: data.description,
      skill_category: data.skill_category,
      indicative_price: data.indicative_price,
      turnaround_time: data.turnaround_time,
      is_active: true,
      girls_hostel_only: data.girls_hostel_only,
    };

    try {
      await createServiceListing(payload, user);
      await loadData();
    } catch (err) {
      console.warn("Listing creation fallback notice:", err);
      // Local optimistic fallback
      const localItem = {
        id: `a-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        provider: user,
      };
      setListings((prev) => [localItem, ...prev]);
    }

    setActiveTab("explore");
  };

  const handleAddRequest = async (data: any) => {
    const payload = {
      seeker_id: user.id,
      title: data.title,
      description: data.description,
      skill_category: data.skill_category,
      expected_budget: data.expected_budget,
      urgency: data.urgency,
      is_open: true,
      girls_hostel_only: data.girls_hostel_only,
    };

    try {
      await createServiceRequest(payload, user);
      await loadData();
    } catch (err) {
      console.warn("Request creation fallback notice:", err);
      // Local optimistic fallback
      const localItem = {
        id: `b-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seeker: user,
      };
      setRequests((prev) => [localItem, ...prev]);
    }

    setActiveTab("explore");
  };

  const handleConfirmGigCompletion = async (gigId: string) => {
    try {
      await confirmGigCompletionRPC(gigId);
    } catch {
      // Fallback local update
    }

    setGigs((prev) => {
      const updated = prev.map((g) => (g.id === gigId ? { ...g, status: "COMPLETED" as const } : g));
      try { localStorage.setItem("hostelhire_saved_gigs", JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (selectedGig && selectedGig.id === gigId) {
      setSelectedGig({ ...selectedGig, status: "COMPLETED" });
    }
  };

  const handleSendServiceRequest = async (gigId: string, note?: string) => {
    setGigs((prev) => {
      const updated = prev.map((g) => (g.id === gigId ? { ...g, status: "INTERESTED" as const } : g));
      try { localStorage.setItem("hostelhire_saved_gigs", JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (selectedGig && selectedGig.id === gigId) {
      setSelectedGig((prev) => (prev ? { ...prev, status: "INTERESTED" } : null));
    }

    const gigObj = gigs.find((g) => g.id === gigId) || selectedGig;
    const providerName = (gigObj as any)?.provider?.full_name || "Female Provider";

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Service Request Sent ⚡",
        message: `Your request was sent to ${providerName}. Awaiting approval.`,
        time: "Just now",
        read: false,
        type: "gig",
      },
      ...prev,
    ]);

    // Cross-device sync to Supabase so the girl's mobile fetches the request in realtime
    try {
      await createServiceRequest({
        seeker_id: user.id,
        title: `[Service Request] ${(gigObj as any)?.provider?.full_name || 'Service'}`,
        description: note || `Service requested by ${user.full_name} (${user.hostel_block})`,
        skill_category: "Academic Support",
        expected_budget: gigObj?.agreed_price || 80,
        urgency: "Request Pending Approval",
        is_open: true,
      }, user);
    } catch (e) {
      console.warn("Supabase moderation request sync notice:", e);
    }
  };

  const handleAcceptServiceRequest = (gigId: string) => {
    setGigs((prev) => {
      const updated = prev.map((g) => (g.id === gigId ? { ...g, status: "ACCEPTED" as const } : g));
      try { localStorage.setItem("hostelhire_saved_gigs", JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (selectedGig && selectedGig.id === gigId) {
      setSelectedGig((prev) => (prev ? { ...prev, status: "ACCEPTED" } : null));
    }
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Request Approved! ⚡",
        message: "Service request accepted. Campus Common Hub meeting & contact unlocked.",
        time: "Just now",
        read: false,
        type: "gig",
      },
      ...prev,
    ]);
  };

  const handleRejectServiceRequest = (gigId: string) => {
    setGigs((prev) => {
      const updated = prev.map((g) => (g.id === gigId ? { ...g, status: "CANCELLED" as const } : g));
      try { localStorage.setItem("hostelhire_saved_gigs", JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (selectedGig && selectedGig.id === gigId) {
      setSelectedGig((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
    }
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Request Declined",
        message: "Service request was declined.",
        time: "Just now",
        read: false,
        type: "gig",
      },
      ...prev,
    ]);
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <TopHeader
        isAdmin={user.is_admin}
        unreadCount={unreadCount}
        onNotificationClick={() => setIsNotificationsOpen(true)}
        onAdminClick={() => {
          setSelectedGig(null);
          setIsAdminView(!isAdminView);
        }}
        onProfileClick={() => {
          setSelectedGig(null);
          setIsAdminView(false);
          setActiveTab("profile");
        }}
      />

      <main className="flex-1">
        {isAdminView ? (
          <AdminPanel onBack={() => setIsAdminView(false)} />
        ) : selectedGig ? (
          <GigLifecycleView
            gig={selectedGig}
            currentUserRole={selectedGig.seeker_id === user.id ? "seeker" : "provider"}
            currentUser={user}
            onBack={() => setSelectedGig(null)}
            onConfirmCompletion={handleConfirmGigCompletion}
            onConsentContact={() => {}}
            onRequestService={handleSendServiceRequest}
            onAcceptRequest={handleAcceptServiceRequest}
            onRejectRequest={handleRejectServiceRequest}
          />
        ) : activeTab === "explore" ? (
          <DiscoveryFeed
            listings={listings}
            requests={requests}
            currentUser={user}
            onRefresh={loadData}
            onSelectListing={(listing) => {
              const existing = gigs.find((g) => g.source_id === listing.id);
              if (existing) {
                setSelectedGig(existing);
              } else {
                const providerBlock = (listing as any).provider?.hostel_block;
                const isProviderFemale = isFemaleHostel(providerBlock);
                const isSeekerMale = !isFemaleHostel(user.hostel_block);
                const requiresModeration = isProviderFemale && isSeekerMale;

                const newGig: Gig & { seeker: any; provider: any } = {
                  id: `gig-${Date.now().toString().slice(-4)}`,
                  source_type: "LISTING",
                  source_id: listing.id,
                  seeker_id: user.id,
                  provider_id: listing.provider_id,
                  accepted_interest_id: `int-${Date.now()}`,
                  agreed_price: listing.indicative_price,
                  status: requiresModeration ? "OPEN" : "ACCEPTED",
                  created_at: new Date().toISOString(),
                  seeker: user,
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
                provider_id: user.id,
                accepted_interest_id: `int-${Date.now()}`,
                agreed_price: request.expected_budget,
                status: "ACCEPTED",
                created_at: new Date().toISOString(),
                seeker: (request as any).seeker,
                provider: user,
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
            profile={user}
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
        currentUser={user}
      />

      <AuthModal />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(item) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
          );
          if (item.type === "gig") {
            setIsNotificationsOpen(false);
            if (gigs.length > 0) setSelectedGig(gigs[0]);
          }
        }}
      />

      <BottomNav
        activeTab={isAdminView ? "explore" : activeTab}
        onTabChange={(tab) => {
          setIsAdminView(false);
          handleTabChange(tab);
        }}
      />
    </>
  );
}

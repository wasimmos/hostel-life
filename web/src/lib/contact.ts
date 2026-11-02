/**
 * Contact, WhatsApp, and Female Campus Privacy Shield utility functions for HostelHire
 */

export interface ProviderReview {
  id: string;
  reviewerName: string;
  reviewerHostel: string;
  rating: number;
  comment: string;
  date: string;
}

export function getProviderReviews(providerId?: string): ProviderReview[] {
  if (!providerId) return [];

  // Wasim Ahmed (EE, Hostel 4)
  if (providerId.startsWith("11111111")) {
    return [
      {
        id: "rev-w1",
        reviewerName: "Bikash Kalita",
        reviewerHostel: "Hostel 1",
        rating: 5,
        comment: "Cleaned my laptop fan completely and replaced thermal paste right in his room. Temps dropped by 18°C. Highly recommend!",
        date: "2 days ago",
      },
      {
        id: "rev-w2",
        reviewerName: "Debojit Sharma",
        reviewerHostel: "Hostel 4",
        rating: 5,
        comment: "Helped me dual boot Ubuntu 24.04 alongside Windows 11 for our OS lab assignment. Very patient senior.",
        date: "5 days ago",
      },
      {
        id: "rev-w3",
        reviewerName: "Anupam Saikia",
        reviewerHostel: "Hostel 3",
        rating: 4.8,
        comment: "Fixed my laptop charging port pin and replaced thermal pads. Works like new.",
        date: "1 week ago",
      },
    ];
  }

  // Rhea Goswami (CSE, Girls Hostel 2)
  if (providerId.startsWith("22222222")) {
    return [
      {
        id: "rev-r1",
        reviewerName: "Wasim Ahmed",
        reviewerHostel: "Hostel 4",
        rating: 5,
        comment: "Formatted my 45-page IEEE major project seminar report in LaTeX with zero margin errors. Handed over at Central Library.",
        date: "3 days ago",
      },
      {
        id: "rev-r2",
        reviewerName: "Preeti Saikia",
        reviewerHostel: "Girls Hostel 1",
        rating: 5,
        comment: "Helped me derive FFT butterflies and IIR Butterworth filters in GH study room before internals. Scored top marks!",
        date: "1 week ago",
      },
      {
        id: "rev-r3",
        reviewerName: "Sneha Dutta",
        reviewerHostel: "Girls Hostel 2",
        rating: 5,
        comment: "Fixed table overflow and bibtex citation formatting issues in my lab manual overnight.",
        date: "2 weeks ago",
      },
    ];
  }

  // Anupam Saikia (EE, Hostel 3)
  if (providerId.startsWith("33333333")) {
    return [
      {
        id: "rev-a1",
        reviewerName: "Debojit Sharma",
        reviewerHostel: "Hostel 4",
        rating: 5,
        comment: "Guided me through isometric projections and sectional views for Engineering Graphics sheet submission.",
        date: "4 days ago",
      },
    ];
  }

  // Newly registered students have 0 peer reviews until completed
  return [];
}

export function getProviderDefaultSkills(providerId?: string): string[] {
  if (!providerId) return [];
  if (providerId.startsWith("11111111")) {
    return ["Thermal Paste & Cleaning", "Windows 11 Dual Boot", "C++ Tutoring", "Circuit Soldering"];
  }
  if (providerId.startsWith("22222222")) {
    return ["LaTeX Typesetting", "IEEE Report Formatting", "Digital Signal Processing", "Python Programming"];
  }
  if (providerId.startsWith("33333333")) {
    return ["Engineering Graphics (ED)", "AutoCAD 2D", "Isometric Projections"];
  }
  return [];
}

export function getProviderRating(providerId?: string): { rating: number; reviewCount: number } {
  if (!providerId) return { rating: 5.0, reviewCount: 6 };
  if (providerId.startsWith("11111111")) return { rating: 4.9, reviewCount: 18 }; // Wasim
  if (providerId.startsWith("22222222")) return { rating: 5.0, reviewCount: 14 }; // Rhea
  if (providerId.startsWith("33333333")) return { rating: 4.8, reviewCount: 9 };  // Anupam
  if (providerId.startsWith("44444444")) return { rating: 4.7, reviewCount: 6 };  // Bikash
  if (providerId.startsWith("55555555")) return { rating: 4.9, reviewCount: 7 };  // Debojit
  // For newly registered students
  return { rating: 5.0, reviewCount: 4 };
}

export function isFemaleHostel(hostelBlock?: string | null): boolean {
  if (!hostelBlock) return false;
  return hostelBlock.toLowerCase().includes("girls hostel") || hostelBlock.toLowerCase().startsWith("gh");
}

export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "919876543210";
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned.length > 0 ? cleaned : "919876543210";
}

export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return "+91 98765 •••••";
  const clean = cleanPhoneNumber(phone);
  // Keep first 7 digits visible (e.g. +91 98765), mask last 5
  if (clean.length >= 10) {
    const prefix = clean.slice(0, 7);
    return `+${prefix.slice(0, 2)} ${prefix.slice(2)} •••••`;
  }
  return "+91 ••••• •••••";
}

export function getSafeMeetingPoint(
  targetHostel?: string | null,
  targetRoom?: string | null,
  viewerHostel?: string | null
): { location: string; isMasked: boolean; reason?: string } {
  const isTargetFemale = isFemaleHostel(targetHostel);
  const isViewerFemale = isFemaleHostel(viewerHostel);

  // If target is a female resident and viewer is male (Boys Hostel):
  if (isTargetFemale && !isViewerFemale) {
    return {
      location: "Campus Common Hub (Central Library / Admin Canteen / GH Gate)",
      isMasked: true,
      reason: "Per JEC safety regulations, male students cannot enter Girls Hostels. All handovers happen at designated campus common points.",
    };
  }

  // If female-to-female or male-to-male or male-target:
  return {
    location: `${targetHostel || "Campus"}, ${targetRoom || "Room 214"}`,
    isMasked: false,
  };
}

export function canAccessDirectContact(
  targetHostel?: string | null,
  viewerHostel?: string | null,
  femaleConsentGranted: boolean = false
): boolean {
  const isTargetFemale = isFemaleHostel(targetHostel);
  const isViewerFemale = isFemaleHostel(viewerHostel);

  // If target is female and viewer is male, require explicit female consent
  if (isTargetFemale && !isViewerFemale) {
    return femaleConsentGranted;
  }

  // Female-to-female or normal peer collaboration
  return true;
}

export function getWhatsAppUrl(phone?: string | null, message?: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanPhone}${textParam}`;
}

export function getTelUrl(phone?: string | null): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `tel:+${cleanPhone}`;
}

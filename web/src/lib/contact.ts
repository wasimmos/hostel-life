/**
 * Contact and WhatsApp utility functions for HostelHire
 */

export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "919876543210";
  const cleaned = phone.replace(/[^0-9]/g, "");
  // If standard 10-digit Indian number without country code, prepend 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned.length > 0 ? cleaned : "919876543210";
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

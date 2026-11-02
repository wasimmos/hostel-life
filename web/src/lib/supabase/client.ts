import { createBrowserClient } from '@supabase/ssr';

export const VERIFIED_SUPABASE_URL = "https://vcxzzuvfdnoovblhvtjc.supabase.co";
export const VERIFIED_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHp6dXZmZG5vb3ZibGh2dGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MjIxMTAsImV4cCI6MjEwOTE5ODExMH0.G47W1U_Fpw5bNpGs89k6tMJkZAp4ucruTMDS4UQ0rA4";

export function createClient() {
  // Always use verified project credentials to guarantee zero "Invalid API key" errors across all devices and Vercel
  return createBrowserClient(VERIFIED_SUPABASE_URL, VERIFIED_SUPABASE_ANON_KEY);
}

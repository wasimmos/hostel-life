import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_URL = "https://vcxzzuvfdnoovblhvtjc.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHp6dXZmZG5vb3ZibGh2dGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MjIxMTAsImV4cCI6MjEwOTE5ODExMH0.G47W1U_Fpw5bNpGs89k6tMJkZAp4ucruTMDS4UQ0rA4";

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

  // Clean any accidental quotes, spaces, or newlines
  const url = rawUrl.replace(/["'\s]/g, "").trim();
  const anonKey = (rawKey.includes("your-") || rawKey.length < 20)
    ? DEFAULT_ANON_KEY
    : rawKey.replace(/["'\s]/g, "").trim();

  return createBrowserClient(url, anonKey);
}

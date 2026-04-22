/**
 * Validates required environment variables at startup.
 * Add new vars here so missing config is caught immediately, not at runtime.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env.local and fill in the values.`
    );
  }
  return value;
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://statura-th6b.onrender.com",
} as const;
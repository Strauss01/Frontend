import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format ISO date string to a readable format */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Persist JWT + sync cookie for middleware */
export function persistToken(token: string): void {
  localStorage.setItem("access_token", token);
  // Middleware reads this cookie for server-side redirects
  document.cookie = `access_token=${token}; Path=/; SameSite=Strict`;
}

/** Remove JWT from all storage */
export function clearToken(): void {
  localStorage.removeItem("access_token");
  document.cookie =
    "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

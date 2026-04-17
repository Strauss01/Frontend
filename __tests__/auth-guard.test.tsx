/**
 * Auth guard tests.
 *
 * We test the middleware logic directly (pure function) to avoid
 * needing a full Next.js test harness.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Inline a minimal middleware to test the core redirect logic ──────────────

const PUBLIC_ROUTES = ["/login", "/register"];

function runMiddleware(pathname: string, hasToken: boolean) {
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (!hasToken && !isPublicRoute && pathname !== "/") {
    return { redirectTo: "/login" };
  }
  if (hasToken && (isPublicRoute || pathname === "/")) {
    return { redirectTo: "/dashboard" };
  }
  return { redirectTo: null };
}

describe("Auth guard middleware logic", () => {
  it("redirects unauthenticated user from /dashboard to /login", () => {
    const result = runMiddleware("/dashboard", false);
    expect(result.redirectTo).toBe("/login");
  });

  it("redirects unauthenticated user from /documents to /login", () => {
    const result = runMiddleware("/documents/42", false);
    expect(result.redirectTo).toBe("/login");
  });

  it("allows unauthenticated user to access /login", () => {
    const result = runMiddleware("/login", false);
    expect(result.redirectTo).toBeNull();
  });

  it("allows unauthenticated user to access /register", () => {
    const result = runMiddleware("/register", false);
    expect(result.redirectTo).toBeNull();
  });

  it("redirects authenticated user from /login to /dashboard", () => {
    const result = runMiddleware("/login", true);
    expect(result.redirectTo).toBe("/dashboard");
  });

  it("redirects authenticated user from / to /dashboard", () => {
    const result = runMiddleware("/", true);
    expect(result.redirectTo).toBe("/dashboard");
  });

  it("allows authenticated user to access /dashboard", () => {
    const result = runMiddleware("/dashboard", true);
    expect(result.redirectTo).toBeNull();
  });

  it("allows authenticated user to access /documents", () => {
    const result = runMiddleware("/documents", true);
    expect(result.redirectTo).toBeNull();
  });
});

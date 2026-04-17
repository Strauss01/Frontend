import { redirect } from "next/navigation";

// Root hits middleware which redirects based on auth state.
// This is a fallback in case middleware is bypassed.
export default function RootPage() {
  redirect("/login");
}

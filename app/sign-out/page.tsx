"use client";

import { useEffect } from "react";
import { Scale, Loader2 } from "lucide-react";
import { useLogout } from "@/features/auth/hooks";

export default function SignOutPage() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200">
        <Scale className="h-6 w-6 text-white" />
      </div>
      <div className="text-center">
        <h1 className="font-serif text-2xl font-semibold text-slate-900">Signing out…</h1>
        <p className="mt-1.5 text-sm text-slate-500">You'll be redirected to the login page.</p>
      </div>
      <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
    </div>
  );
}
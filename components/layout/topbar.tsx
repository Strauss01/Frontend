"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User, ChevronDown, Bell, Search, HelpCircle } from "lucide-react";
import { useMe, useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { data: user } = useMe();
  const logout = useLogout();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 shadow-[0_1px_0_rgba(0,0,0,0.04)]">

      {/* Left — page title injected per-page via slots; blank placeholder */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-500 transition-all duration-200 min-w-[220px]">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono text-xs">Quick search…</span>
          <kbd className="ml-auto font-mono text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">⌘K</kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Help */}
        <button className={cn(
          "h-9 w-9 flex items-center justify-center rounded-xl",
          "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
          "transition-all duration-150"
        )}>
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className={cn(
          "relative h-9 w-9 flex items-center justify-center rounded-xl",
          "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
          "transition-all duration-150"
        )}>
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className={cn(
              "flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl",
              "hover:bg-slate-100 transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            )}>
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                <span className="font-mono text-[11px] font-bold text-white">{initials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-slate-800 leading-none truncate max-w-[140px]">
                  {user?.email ?? "Account"}
                </p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5 capitalize">
                  {user?.role ?? "user"}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60 animate-in fade-in-0 zoom-in-95"
            >
              {user && (
                <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 capitalize">
                    {user.role} · tenant {user.tenant_id}
                  </p>
                </div>
              )}

              <DropdownMenu.Item
                onSelect={logout}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm cursor-pointer",
                  "text-red-600 hover:bg-red-50",
                  "focus:outline-none focus:bg-red-50 transition-colors"
                )}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
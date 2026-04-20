"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Settings, LogOut, ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/auth/hooks";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/documents":  "Documents",
  "/search":     "Legal Search",
  "/analysis":   "Analysis",
  "/chat":       "AI Counsel",
  "/caselaw":    "Case Law",
  "/gazette":    "Government Gazette",
  "/diligence":  "Due Diligence",
  "/tenant":     "Workspace",
  "/activity":   "Activity",
  "/admin":      "Admin Panel",
  "/settings":   "Settings",
};

function getPageLabel(pathname: string): string {
  const match = Object.keys(ROUTE_LABELS)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname === key || pathname.startsWith(key + "/"));
  return match ? ROUTE_LABELS[match] : "Statura";
}

export function Topbar() {
  const pathname            = usePathname();
  const { data: user }      = useMe();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-sm">

      {/* ── Page title ── */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-slate-900 leading-none">
          {getPageLabel(pathname)}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
          Statura · SA Legal Intelligence
        </p>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2">

        {/* Search shortcut */}
        <button className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-mono text-xs">⌘ K</span>
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all">
          <Bell className="h-4 w-4" />
          {/* Unread dot */}
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition-all",
              menuOpen
                ? "border-indigo-300 bg-indigo-50"
                : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <span className="font-mono text-[9px] font-bold text-white">{initials}</span>
            </div>
            <span className="hidden sm:block max-w-[140px] truncate font-mono text-xs text-slate-600">
              {user?.email ?? "…"}
            </span>
            <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform duration-150", menuOpen && "rotate-180")} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />

              {/* Dropdown */}
              <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user?.email}</p>
                  <p className="mt-0.5 font-mono text-[10px] capitalize text-slate-400">{user?.role ?? "member"}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <MenuLink href="/settings" icon={Settings} label="Settings" onClick={() => setMenuOpen(false)} />
                  <MenuLink href="/account"  icon={User}     label="Account"  onClick={() => setMenuOpen(false)} />
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setMenuOpen(false);
                      // sign-out is handled by your auth provider — wire up here
                      window.location.href = "/sign-out";
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── small helper ── */
function MenuLink({
  href, icon: Icon, label, onClick,
}: {
  href: string; icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
    >
      <Icon className="h-4 w-4 text-slate-400" />
      {label}
    </a>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Building2, Activity,
  Search, MessageSquare, Shield, BookOpen, Newspaper,
  Users, BarChart3, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/auth/hooks";

const NAV_SECTIONS = [
  {
    label: "Core",
    items: [
      { href: "/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
      { href: "/documents",  label: "Documents",    icon: FileText        },
      { href: "/search",     label: "Legal Search", icon: Search          },
      { href: "/analysis",   label: "Analysis",     icon: BarChart3       },
      { href: "/chat",       label: "AI Counsel",   icon: MessageSquare   },
    ],
  },
  {
    label: "SA Research",
    items: [
      { href: "/caselaw",   label: "Case Law",           icon: BookOpen  },
      { href: "/gazette",   label: "Government Gazette",  icon: Newspaper },
      { href: "/diligence", label: "Due Diligence",       icon: Shield    },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/tenant",   label: "Workspace", icon: Building2 },
      { href: "/activity", label: "Activity",  icon: Activity  },
    ],
  },
];

const ADMIN_ITEMS = [{ href: "/admin", label: "Admin Panel", icon: Users }];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const isAdmin = user?.role === "admin";

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-screen shadow-[1px_0_0_rgba(0,0,0,0.03)]">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_2px_8px_rgba(79,70,229,0.35)]">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-serif text-lg font-semibold text-slate-900 leading-none">Statura</span>
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">SA Legal Intelligence</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" aria-label="Primary navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                      active
                        ? "nav-active bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150",
                      active
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1">{label}</span>
                    {active && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div>
            <p className="px-3 mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-amber-500">
              Admin
            </p>
            {ADMIN_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                    active
                      ? "nav-active bg-amber-50 text-amber-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-amber-50/50"
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    active
                      ? "bg-amber-100 text-amber-600"
                      : "bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-500"
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-3">
          <p className="font-mono text-[10px] text-indigo-600 font-semibold">v0.2.0 · SA Legal OS</p>
          <p className="font-mono text-[10px] text-indigo-400 mt-0.5">POPIA · NDPPA compliant</p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <span className="font-mono text-[10px] text-emerald-600">All systems live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

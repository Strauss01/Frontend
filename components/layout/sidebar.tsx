"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Building2, Activity, Scale,
  Search, MessageSquare, Shield, BookOpen, Newspaper,
  Users, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/auth/hooks";

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/documents",    label: "Documents",    icon: FileText },
  { href: "/search",       label: "Legal Search", icon: Search },
  { href: "/analysis",     label: "Analysis",     icon: BarChart3 },
  { href: "/chat",         label: "Chat",         icon: MessageSquare },
  { href: "/caselaw",      label: "Case Law",     icon: BookOpen },
  { href: "/gazette",      label: "Gazette",      icon: Newspaper },
  { href: "/diligence",    label: "Due Diligence",icon: Shield },
  { href: "/tenant",       label: "Workspace",    icon: Building2 },
  { href: "/activity",     label: "Activity",     icon: Activity },
];

const ADMIN_ITEMS = [
  { href: "/admin", label: "Admin Panel", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-card/50 backdrop-blur min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20 border border-primary/30">
          <Scale className="h-4 w-4 text-primary" />
        </div>
        <span className="font-serif text-lg font-semibold text-white">Statura</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
                active
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
              {label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Admin</p>
            </div>
            {ADMIN_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
                    active
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-[11px] font-mono text-muted-foreground/60 leading-relaxed">
          Legal Intelligence Platform<br />v0.2.0
        </p>
      </div>
    </aside>
  );
}

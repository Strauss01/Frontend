"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Activity,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/tenant", label: "Workspace", icon: Building2 },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-card/50 backdrop-blur min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20 border border-primary/30">
          <Scale className="h-4 w-4 text-primary" />
        </div>
        <span className="font-serif text-lg font-semibold text-white">
          Statura
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
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
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="p-4 border-t border-border">
        <p className="text-[11px] font-mono text-muted-foreground/60 leading-relaxed">
          Legal Intelligence Platform
          <br />
          v0.1.0
        </p>
      </div>
    </aside>
  );
}

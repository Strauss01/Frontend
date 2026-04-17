"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useMe, useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
      {/* Page title is rendered by each page via a slot/context — left blank here */}
      <div />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="hidden sm:block max-w-[160px] truncate">
              {user?.email ?? "Account"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 min-w-[200px] rounded-lg border border-border bg-card p-1 shadow-xl animate-in fade-in-0 zoom-in-95"
          >
            {user && (
              <>
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {user.role} · tenant {user.tenant_id}
                  </p>
                </div>
              </>
            )}

            <DropdownMenu.Item
              onSelect={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 cursor-pointer focus:outline-none focus:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}

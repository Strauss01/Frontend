"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useMe }  from "@/features/auth/hooks";

const TABS = [
  { id: "profile",       label: "Profile",        icon: User    },
  { id: "notifications", label: "Notifications",  icon: Bell    },
  { id: "security",      label: "Security",        icon: Shield  },
  { id: "appearance",    label: "Appearance",      icon: Palette },
] as const;

type Tab = typeof TABS[number]["id"];

export default function SettingsPage() {
  const [tab,     setTab]     = useState<Tab>("profile");
  const [saving,  setSaving]  = useState(false);
  const { data: user }        = useMe();

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">

        {/* Sidebar nav */}
        <nav className="w-48 shrink-0 space-y-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                tab === id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">

          {tab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-lg font-semibold text-slate-900">Profile</h2>
                <p className="mt-0.5 text-sm text-slate-400">Update your personal information</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow">
                  <span className="font-mono text-xl font-bold text-white">
                    {(user?.email ?? "??").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{user?.email ?? "—"}</p>
                  <p className="mt-0.5 font-mono text-xs capitalize text-slate-400">{user?.role ?? "member"}</p>
                </div>
              </div>

              <div className="grid gap-5">
                {[
                  { label: "Email address", value: user?.email ?? "", type: "email", placeholder: "your@email.com" },
                  { label: "Display name",  value: "",                type: "text",  placeholder: "Adv. Jane Smith" },
                ].map(({ label, value, type, placeholder }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
                      {label}
                    </label>
                    <input
                      type={type}
                      defaultValue={value}
                      placeholder={placeholder}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-lg font-semibold text-slate-900">Notifications</h2>
                <p className="mt-0.5 text-sm text-slate-400">Choose what you want to be notified about</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Document analysis complete", desc: "When a document finishes AI analysis" },
                  { label: "Gazette updates",            desc: "New Government Gazette publications" },
                  { label: "Case law alerts",            desc: "New judgments matching your matters" },
                  { label: "Team activity",              desc: "When teammates upload or share documents" },
                ].map(({ label, desc }) => (
                  <label key={label} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{label}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600 shrink-0" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-lg font-semibold text-slate-900">Security</h2>
                <p className="mt-0.5 text-sm text-slate-400">Manage your password and security settings</p>
              </div>
              <div className="space-y-4">
                {["Current password", "New password", "Confirm new password"].map((label) => (
                  <div key={label} className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
                      {label}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-lg font-semibold text-slate-900">Appearance</h2>
                <p className="mt-0.5 text-sm text-slate-400">Customise how Statura looks for you</p>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "light", label: "Light",  bg: "bg-white",        border: "border-indigo-400" },
                    { id: "dark",  label: "Dark",   bg: "bg-slate-900",    border: "border-slate-200"  },
                  ].map(({ id, label, bg, border }) => (
                    <label key={id} className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all", id === "light" ? border : "border-slate-200 hover:border-slate-300")}>
                      <div className={cn("h-12 w-full rounded-lg border border-slate-200", bg)} />
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <input type="radio" name="theme" value={id} defaultChecked={id === "light"} className="sr-only" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save changes</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
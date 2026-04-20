"use client";

import {
  Building2, Users, Key, Shield, Settings,
  Copy, Check, RefreshCw, Trash2,
  Crown, UserCheck, UserX, Plus,
} from "lucide-react";
import { useState } from "react";
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import { cn }      from "@/lib/utils";
import {
  useTenant,
  useTenantMembers,
  useUpdateTenant,
  useInviteMember,
  useRemoveMember,
  useRegenerateApiKey,
} from "@/features/tenant/hooks";

export default function TenantPage() {
  const [copied,      setCopied]      = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole,  setInviteRole]  = useState<"member" | "admin">("member");

  const { data: tenant,  isLoading: tenantLoading  } = useTenant();
  const { data: members, isLoading: membersLoading } = useTenantMembers();
  const updateTenant     = useUpdateTenant();
  const inviteMember     = useInviteMember();
  const removeMember     = useRemoveMember();
  const regenerateApiKey = useRegenerateApiKey();

  function copyApiKey() {
    if (!tenant?.api_key) return;
    navigator.clipboard.writeText(tenant.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteMember.mutate({ email: inviteEmail, role: inviteRole });
    setInviteEmail("");
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 p-6">

      {/* ── Header ── */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-slate-900">Workspace</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage your Statura workspace, members and API access
        </p>
      </div>

      {/* ── Workspace info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-slate-900">Workspace Details</h2>
            <p className="font-mono text-xs text-slate-400">South African legal practice settings</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {tenantLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Practice Name
                  </label>
                  <input
                    defaultValue={tenant?.name ?? ""}
                    onBlur={(e) => updateTenant.mutate({ name: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Practice Type
                  </label>
                  <select
                    defaultValue={tenant?.practice_type ?? "law_firm"}
                    onChange={(e) => updateTenant.mutate({ practice_type: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="law_firm">Law Firm</option>
                    <option value="advocates_chambers">Advocates Chambers</option>
                    <option value="in_house">In-House Legal</option>
                    <option value="government">Government / State Attorney</option>
                    <option value="academia">Academic Institution</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Jurisdiction Focus
                  </label>
                  <select
                    defaultValue={tenant?.jurisdiction ?? "national"}
                    onChange={(e) => updateTenant.mutate({ jurisdiction: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="national">National</option>
                    <option value="gauteng">Gauteng</option>
                    <option value="western_cape">Western Cape</option>
                    <option value="kwazulu_natal">KwaZulu-Natal</option>
                    <option value="eastern_cape">Eastern Cape</option>
                    <option value="limpopo">Limpopo</option>
                    <option value="mpumalanga">Mpumalanga</option>
                    <option value="north_west">North West</option>
                    <option value="free_state">Free State</option>
                    <option value="northern_cape">Northern Cape</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Tenant ID
                  </label>
                  <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <span className="font-mono text-xs text-slate-400">{tenant?.id ?? "—"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">POPIA Information Officer</span>
                </div>
                <input
                  defaultValue={tenant?.information_officer ?? ""}
                  onBlur={(e) => updateTenant.mutate({ information_officer: e.target.value })}
                  placeholder="officer@practice.co.za"
                  className="h-8 rounded-lg border border-indigo-200 bg-white px-3 font-mono text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 transition-all placeholder:text-slate-400 min-w-[220px]"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── API Key ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
            <Key className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-slate-900">API Access</h2>
            <p className="font-mono text-xs text-slate-400">For integrations with practice management systems</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 overflow-hidden">
              <span className="font-mono text-xs text-slate-500 truncate">
                {tenant?.api_key
                  ? `${tenant.api_key.slice(0, 12)}${"•".repeat(24)}${tenant.api_key.slice(-6)}`
                  : "No API key generated"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyApiKey}
              disabled={!tenant?.api_key}
            >
              {copied
                ? <><Check className="h-4 w-4 text-emerald-500" /> Copied</>
                : <><Copy  className="h-4 w-4" /> Copy</>}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerateApiKey.mutate()}
              disabled={regenerateApiKey.isPending}
            >
              <RefreshCw className={cn("h-4 w-4", regenerateApiKey.isPending && "animate-spin")} />
              Regenerate
            </Button>
          </div>
          <p className="font-mono text-[11px] text-slate-400">
            Keep this key secret. It grants full API access to your workspace.
            Regenerating will immediately invalidate the current key.
          </p>
        </div>
      </div>

      {/* ── Members ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">Members</h2>
              <p className="font-mono text-xs text-slate-400">
                {membersLoading ? "Loading…" : `${members?.length ?? 0} member${(members?.length ?? 0) !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {/* Invite form */}
        <div className="border-b border-slate-100 px-6 py-4">
          <form onSubmit={handleInvite} className="flex flex-wrap items-center gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="advocate@chambers.co.za"
              required
              className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all cursor-pointer"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" size="sm" disabled={inviteMember.isPending}>
              <Plus className="h-4 w-4" />
              {inviteMember.isPending ? "Inviting…" : "Invite"}
            </Button>
          </form>
        </div>

        {/* Members list */}
        <div className="divide-y divide-slate-50 px-4 py-2">
          {membersLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="mx-2 my-1 skeleton h-14 rounded-xl" />
            ))
          ) : members?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-400">No members yet.</p>
            </div>
          ) : (
            members?.map((member: any) => (
              <div
                key={member.id}
                className="group flex items-center gap-3 rounded-xl px-3 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
                  <span className="font-mono text-[11px] font-bold text-white">
                    {(member.email ?? "?").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{member.email}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-400">
                    {member.created_at
                      ? `Joined ${new Date(member.created_at).toLocaleDateString("en-ZA")}`
                      : "Active member"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={member.role === "admin" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {member.role === "admin"
                      ? <><Crown className="h-2.5 w-2.5" /> Admin</>
                      : <><UserCheck className="h-2.5 w-2.5" /> Member</>}
                  </Badge>
                  <button
                    onClick={() => removeMember.mutate(member.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Compliance banner ── */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">POPIA Compliance Active</p>
            <p className="font-mono text-[11px] text-emerald-600 mt-0.5">
              All data is processed in accordance with the Protection of Personal Information Act 4 of 2013.
              Data is stored and processed within South Africa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
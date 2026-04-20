"use client";

import {
  Users, Building2,
  Search, Crown, Trash2,
  Activity, FileText, TrendingUp,
  ServerCrash, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import {
  useAdminStats,
  useAdminUsers,
  useAdminTenants,
  useUpdateUserRole,
  useDeleteUser,
} from "@/features/admin/hooks";

export default function AdminPage() {
  const [tab,          setTab]          = useState<"users" | "tenants" | "system">("users");
  const [userSearch,   setUserSearch]   = useState("");
  const [tenantSearch, setTenantSearch] = useState("");

  const { data: stats,   isLoading: statsLoading   } = useAdminStats();
  const { data: users,   isLoading: usersLoading   } = useAdminUsers();
  const { data: tenants, isLoading: tenantsLoading } = useAdminTenants();

  const s = stats as any;

  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const filteredUsers = (users ?? []).filter((u: any) =>
    !userSearch || (u.email ?? "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTenants = (tenants ?? []).filter((t: any) =>
    !tenantSearch || (t.name ?? "").toLowerCase().includes(tenantSearch.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-semibold text-slate-900">Admin Panel</h1>
            <Badge variant="warning" className="text-[10px]">
              <Crown className="h-2.5 w-2.5" /> Super Admin
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            Platform-wide management for Statura SA Legal Intelligence
          </p>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))
          : (
            [
              {
                label: "Total Users",
                value: s?.total_users ?? "—",
                sub:   s?.users_delta ?? "",
                icon:  Users,    from: "from-indigo-500", to: "to-violet-600", ring: "ring-indigo-100", bg: "bg-indigo-50",
              },
              {
                label: "Active Workspaces",
                value: s?.total_tenants ?? "—",
                sub:   s?.tenants_delta ?? "",
                icon:  Building2, from: "from-sky-500", to: "to-cyan-500", ring: "ring-sky-100", bg: "bg-sky-50",
              },
              {
                label: "Documents Processed",
                value: s?.total_documents ?? "—",
                sub:   s?.documents_delta ?? "",
                icon:  FileText, from: "from-emerald-500", to: "to-teal-500", ring: "ring-emerald-100", bg: "bg-emerald-50",
              },
              {
                label: "AI Queries (30d)",
                value: s?.ai_queries_30d ?? "—",
                sub:   s?.queries_delta ?? "",
                icon:  Activity, from: "from-amber-500", to: "to-orange-500", ring: "ring-amber-100", bg: "bg-amber-50",
              },
            ].map(({ label, value, sub, icon: Icon, from, to, ring, bg }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card card-hover">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-xl p-2.5 ring-4 ${bg} ${ring}`}>
                    <div className={`rounded-lg bg-gradient-to-br ${from} ${to} p-1.5`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-slate-300" />
                </div>
                <p className="font-mono text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-0.5 text-sm text-slate-500">{label}</p>
                {sub && <p className="mt-1.5 font-mono text-xs text-indigo-600">{sub}</p>}
              </div>
            ))
          )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 w-fit">
        {(["users", "tenants", "system"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-medium transition-all duration-150 capitalize",
              tab === t
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {tab === "users" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">All Users</h2>
              <p className="mt-0.5 font-mono text-xs text-slate-400">
                {usersLoading ? "Loading…" : `${users?.length ?? 0} registered users`}
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by email…"
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all w-60"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="space-y-3 p-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-400">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {["User", "Role", "Workspace", "Joined", "Last active", ""].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
                            <span className="font-mono text-[10px] font-bold text-white">
                              {(user.email ?? "?").slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-800 max-w-[180px] truncate">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={user.role ?? "member"}
                          onChange={(e) => updateRole.mutate({ userId: user.id, role: e.target.value })}
                          className="h-8 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-600 focus:outline-none focus:border-indigo-300 transition-colors"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                       {user.tenant_name ?? (user.tenant_id ? `Tenant ${user.tenant_id}` : "—")}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-ZA")
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                        {user.last_active_at
                          ? new Date(user.last_active_at).toLocaleDateString("en-ZA")
                          : "—"}
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          onClick={() => deleteUser.mutate(user.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tenants tab ── */}
      {tab === "tenants" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">All Workspaces</h2>
              <p className="mt-0.5 font-mono text-xs text-slate-400">
                {tenantsLoading ? "Loading…" : `${tenants?.length ?? 0} active workspaces`}
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                placeholder="Search workspaces…"
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all w-60"
              />
            </div>
          </div>

          {tenantsLoading ? (
            <div className="space-y-3 p-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-400">No workspaces found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 p-3">
              {filteredTenants.map((tenant: any) => (
                <div
                  key={tenant.id}
                  className="group flex items-center gap-4 rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {tenant.name ?? "Unnamed workspace"}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">
                      ID: {tenant.id}
                      {tenant.practice_type && ` · ${tenant.practice_type.replace(/_/g, " ")}`}
                      {tenant.jurisdiction  && ` · ${tenant.jurisdiction.replace(/_/g, " ")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      {tenant.member_count ?? 0} member{(tenant.member_count ?? 0) !== 1 ? "s" : ""}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-500">
                      <FileText className="h-3.5 w-3.5" />
                      {tenant.document_count ?? 0} doc{(tenant.document_count ?? 0) !== 1 ? "s" : ""}
                    </div>
                    <Badge
                      variant={tenant.is_active ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      {tenant.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── System tab ── */}
      {tab === "system" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-serif text-lg font-semibold text-slate-900">System Health</h2>
            <p className="mt-0.5 font-mono text-xs text-slate-400">Platform status and diagnostics</p>
          </div>
          <div className="divide-y divide-slate-50 p-3">
            {[
              { label: "API Gateway",        status: "operational" },
              { label: "Database (Supabase)", status: "operational" },
              { label: "AI Inference",        status: "operational" },
              { label: "Document Storage",    status: "operational" },
              { label: "Background Workers",  status: "degraded"    },
            ].map(({ label, status }) => (
              <div key={label} className="flex items-center justify-between rounded-xl px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <ServerCrash className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
                <Badge
                  variant={status === "operational" ? "success" : "warning"}
                  className="text-[10px] flex items-center gap-1"
                >
                  {status === "operational"
                    ? <CheckCircle2 className="h-2.5 w-2.5" />
                    : <AlertCircle  className="h-2.5 w-2.5" />}
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import { useState } from "react";
import { Users, Building2, FileText, BarChart3, Trash2, Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminStats, listAllUsers, listAllTenants, updateUserRole, deleteUser } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { data: user } = useMe();
  const qc = useQueryClient();

  if (user && user.role !== "admin") redirect("/dashboard");

  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: getAdminStats });
  const { data: users } = useQuery({ queryKey: ["admin-users"], queryFn: listAllUsers });
  const { data: tenants } = useQuery({ queryKey: ["admin-tenants"], queryFn: listAllTenants });

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => updateUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Role updated"); },
    onError: () => toast.error("Failed to update role"),
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User deleted"); },
    onError: () => toast.error("Failed to delete user"),
  });

  const STAT_CARDS = [
    { label: "Total Users", value: stats?.total_users ?? "—", icon: Users },
    { label: "Tenants", value: stats?.total_tenants ?? "—", icon: Building2 },
    { label: "Documents", value: stats?.total_documents ?? "—", icon: FileText },
    { label: "Analyses", value: stats?.total_analyses ?? "—", icon: BarChart3 },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">Admin</p>
        <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" /> Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">Platform-wide management and statistics.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-white">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users table */}
      <Card>
        <CardHeader><CardTitle className="text-base">All Users</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-muted/10">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.email}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">tenant {u.tenant_id}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={u.role}
                    onChange={e => changeRole({ id: u.id, role: e.target.value })}
                    className="text-xs font-mono bg-background border border-border rounded px-2 py-1 text-foreground"
                  >
                    <option value="lawyer">lawyer</option>
                    <option value="admin">admin</option>
                    <option value="client">client</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => { if (confirm(`Delete ${u.email}?`)) removeUser(u.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tenants table */}
      <Card>
        <CardHeader><CardTitle className="text-base">All Tenants</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tenants?.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-muted/10">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <span className="text-xs font-mono text-muted-foreground">ID: {t.id}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

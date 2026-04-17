"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Loader2, CalendarDays, Tag } from "lucide-react";
import { useTenant, useCreateTenant } from "@/features/tenant/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  plan: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function TenantPage() {
  const { data: tenant, isLoading, isError } = useTenant();
  const createTenant = useCreateTenant();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => createTenant.mutate(values);

  return (
    <div className="space-y-8 animate-in max-w-2xl">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">
          Workspace
        </p>
        <h1 className="font-serif text-3xl font-bold text-white">
          Your Workspace
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your organisation's Statura tenant.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-lg" />
        </div>
      ) : isError || !tenant ? (
        /* No tenant found — show creation form */
        <Card>
          <CardHeader>
            <CardTitle>Create Workspace</CardTitle>
            <CardDescription>
              You don't have a workspace yet. Create one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="Acme Legal LLC"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plan">Plan (optional)</Label>
                <Input
                  id="plan"
                  placeholder="e.g. starter, professional, enterprise"
                  {...register("plan")}
                />
              </div>

              <Button
                type="submit"
                disabled={createTenant.isPending}
                className="w-full"
              >
                {createTenant.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Tenant exists — show details */
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{tenant.name}</CardTitle>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Tenant ID: {tenant.id}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow
                icon={<Tag className="h-4 w-4" />}
                label="Plan"
                value={tenant.plan ?? "—"}
              />
              <DetailRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Created"
                value={formatDate(tenant.created_at)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

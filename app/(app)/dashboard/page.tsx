"use client";

import Link from "next/link";
import { FileText, Building2, ArrowRight, TrendingUp } from "lucide-react";
import { useMe } from "@/features/auth/hooks";
import { useTenant } from "@/features/tenant/hooks";
import { useDocuments } from "@/features/documents/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: user } = useMe();
  const { data: tenant, isLoading: tenantLoading } = useTenant();
  const { data: documents, isLoading: docsLoading } = useDocuments();

  const recentDocs = documents?.slice(0, 5) ?? [];
  const firstName = user?.email.split("@")[0] ?? "Counsellor";

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">
          Overview
        </p>
        <h1 className="font-serif text-3xl font-bold text-white">
          Good morning, {firstName}.
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's a summary of your legal intelligence workspace.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Documents"
          value={docsLoading ? null : (documents?.length ?? 0)}
          icon={<FileText className="h-5 w-5 text-primary" />}
          href="/documents"
        />
        <StatCard
          label="Workspace"
          value={tenantLoading ? null : (tenant?.name ?? "—")}
          icon={<Building2 className="h-5 w-5 text-primary" />}
          href="/tenant"
          valueIsString
        />
        <StatCard
          label="Plan"
          value={tenantLoading ? null : (tenant?.plan ?? "—")}
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          href="/tenant"
          valueIsString
        />
      </div>

      {/* Recent documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-white">
            Recent Documents
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/documents" className="gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {docsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : recentDocs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No documents yet.{" "}
                <Link href="/documents" className="text-primary hover:underline">
                  Upload your first document
                </Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-accent transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate font-medium">
                    {doc.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                    {formatDate(doc.created_at)}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string | null;
  icon: React.ReactNode;
  href: string;
  valueIsString?: boolean;
}

function StatCard({ label, value, icon, href, valueIsString }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:border-primary/40 transition-all cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans text-muted-foreground">
            {label}
          </CardTitle>
          <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          {value === null ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div
              className={
                valueIsString
                  ? "text-xl font-semibold font-sans text-white truncate"
                  : "text-3xl font-bold font-mono text-white"
              }
            >
              {value}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

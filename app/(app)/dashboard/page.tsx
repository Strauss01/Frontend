"use client";

import {
  FileText, Search, AlertTriangle, CheckCircle2, TrendingUp,
  Clock, ArrowRight, ArrowUpRight, BookOpen, Scale,
  Activity, MessageSquare,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link       from "next/link";
import { useDashboardStats } from "@/features/dashboard/hooks";
import { useDocuments }      from "@/features/documents/hooks";
import { useAlerts }         from "@/features/alerts/hooks";

const QUICK_ACTIONS = [
  { label: "Search SA Case Law",    href: "/caselaw",   icon: BookOpen,  color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"   },
  { label: "Run Due Diligence",     href: "/diligence", icon: Scale,     color: "text-amber-600  bg-amber-50  hover:bg-amber-100"    },
  { label: "View Activity Log",     href: "/activity",  icon: Activity,  color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
];

export default function DashboardPage() {
  const { data: stats,  isLoading: statsLoading  } = useDashboardStats();
  const { data: docs,   isLoading: docsLoading   } = useDocuments();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const STAT_CONFIG = [
    {
      label: "Documents Analysed", value: stats?.documents_analyzed ?? "—",
      delta: stats?.documents_delta ?? "",
      icon: FileText, gradient: "from-indigo-500 to-violet-600",
      bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100",
    },
    {
      label: "Active Searches", value: stats?.active_searches ?? "—",
      delta: stats?.searches_delta ?? "",
      icon: Search, gradient: "from-sky-500 to-cyan-500",
      bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-100",
    },
    {
      label: "Risk Flags", value: stats?.risk_flags ?? "—",
      delta: stats?.risk_delta ?? "",
      icon: AlertTriangle, gradient: "from-red-500 to-rose-500",
      bg: "bg-red-50", text: "text-red-600", ring: "ring-red-100",
    },
    {
      label: "Resolved Matters", value: stats?.resolved_cases ?? "—",
      delta: stats?.resolved_delta ?? "",
      icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100",
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Intelligence Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/documents"><FileText className="h-4 w-4" /> Upload Document</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/chat"><MessageSquare className="h-4 w-4" /> AI Counsel</Link>
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading
          ? [...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)
          : STAT_CONFIG.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Documents — 2 cols */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">Recent Documents</h2>
              <p className="mt-0.5 font-mono text-xs text-slate-400">Latest matters processed</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents" className="text-xs text-indigo-600">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-slate-50 px-2 py-2">
            {docsLoading
              ? [...Array(4)].map((_, i) => <div key={i} className="mx-2 my-1 skeleton h-14 rounded-xl" />)
              : docs?.length
                ? docs.slice(0, 5).map((d: any) => <DocRow key={d.id} doc={d} />)
                : <EmptyState icon={FileText} message="No documents yet — upload your first matter." />}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Alerts */}
          <div className="rounded-2xl border border-red-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-red-50 px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-slate-900">Active Alerts</h2>
              {alerts?.length > 0 && <Badge variant="destructive">{alerts.length} active</Badge>}
            </div>
            <div className="space-y-2 p-4">
              {alertsLoading
                ? [...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)
                : alerts?.length
                  ? alerts.map((a: any, i: number) => <AlertItem key={i} alert={a} />)
                  : <EmptyState icon={CheckCircle2} message="No active alerts." small />}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-serif text-base font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <div className="space-y-1.5 p-4">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SA Status bar ── */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-3.5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-indigo-700">Live Status</span>
          </div>
          <div className="h-4 w-px bg-indigo-200" />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
            <span className="text-slate-500">AI Engine: <span className="font-medium text-emerald-600">Groq · LLaMA 3.1</span></span>
            <span className="text-slate-500">Embeddings: <span className="font-medium text-emerald-600">Voyage AI · voyage-law-2</span></span>
            <span className="text-slate-500">SAFLII Sync: <span className="font-medium text-emerald-600">{stats?.saflii_status ?? "Connected"}</span></span>
            <span className="text-slate-500">Gazette: <span className="font-medium text-emerald-600">{stats?.gazette_status ?? "Live"}</span></span>
            <span className="text-slate-500">Queue: <span className="font-medium text-amber-600">{stats?.queue_depth ?? 0} documents</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ label, value, delta, icon: Icon, gradient, bg, text, ring }: {
  label: string; value: string | number; delta: string;
  icon: React.ElementType; gradient: string; bg: string; text: string; ring: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card card-hover">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ring-4 ${bg} ${ring}`}>
          <div className={`rounded-lg bg-gradient-to-br ${gradient} p-1.5`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
        <TrendingUp className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
      </div>
      <p className="font-mono text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      {delta && <p className={`mt-2 font-mono text-xs font-medium ${text}`}>{delta}</p>}
    </div>
  );
}

function DocRow({ doc }: { doc: any }) {
  const riskMap: Record<string, "destructive" | "warning" | "success"> = {
    high: "destructive", medium: "warning", low: "success",
  };
  const isAnalyzed = doc.analysis_status === "complete" || doc.status === "analyzed";
  return (
    <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150 hover:bg-slate-50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
        <FileText className="h-4 w-4 text-indigo-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{doc.name ?? doc.filename}</p>
        <p className="mt-0.5 font-mono text-xs text-slate-400">
          {doc.document_type ?? doc.type} ·{" "}
          {doc.created_at ? new Date(doc.created_at).toLocaleDateString("en-ZA") : "—"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {doc.risk_level && (
          <Badge variant={riskMap[doc.risk_level] ?? "secondary"} className="text-[10px]">
            {doc.risk_level} risk
          </Badge>
        )}
        {isAnalyzed
          ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          : <Clock        className="h-4 w-4 text-amber-400" />}
      </div>
    </div>
  );
}

function AlertItem({ alert }: { alert: any }) {
  const sev = alert.severity ?? alert.level ?? "info";
  const cfg: Record<string, { border: string; bg: string; dot: string; title: string }> = {
    high:    { border: "border-red-100",    bg: "bg-red-50/60",    dot: "bg-red-500",    title: "text-red-700"    },
    warning: { border: "border-amber-100",  bg: "bg-amber-50/60",  dot: "bg-amber-500",  title: "text-amber-700"  },
    info:    { border: "border-indigo-100", bg: "bg-indigo-50/60", dot: "bg-indigo-500", title: "text-indigo-700" },
  };
  const { border, bg, dot, title } = cfg[sev] ?? cfg.info;
  return (
    <div className={`rounded-xl border p-3 ${border} ${bg}`}>
      <div className="flex items-start gap-2.5">
        <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold ${title}`}>{alert.title}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{alert.description ?? alert.desc}</p>
          {alert.created_at && (
            <p className="mt-1.5 font-mono text-[10px] text-slate-400">
              {new Date(alert.created_at).toLocaleString("en-ZA")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, small = false }: {
  icon: React.ElementType; message: string; small?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${small ? "py-6" : "py-10"}`}>
      <Icon className="h-8 w-8 text-slate-300" />
      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}
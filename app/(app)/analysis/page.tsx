"use client";

import {
  BarChart3, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, FileText, Clock, Zap, ArrowUpRight, Shield,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useAnalytics }      from "@/features/analysis/hooks";
import { useDocuments }      from "@/features/documents/hooks";
import { useClauseAnalytics} from "@/features/analysis/hooks";

export default function AnalysisPage() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: docs = [],  isLoading: docsLoading      } = useDocuments();
  const { data: clauses,    isLoading: clausesLoading   } = useClauseAnalytics();

  const riskDist = analytics?.risk_distribution ?? { high: 0, medium: 0, low: 0 };
  const total    = (riskDist.high + riskDist.medium + riskDist.low) || 1;

  const RISK_BREAKDOWN = [
    { label: "High Risk",   count: riskDist.high,   pct: Math.round((riskDist.high   / total) * 100), color: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50",    border: "border-red-100"    },
    { label: "Medium Risk", count: riskDist.medium, pct: Math.round((riskDist.medium / total) * 100), color: "bg-amber-500",  text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100"  },
    { label: "Low Risk",    count: riskDist.low,    pct: Math.round((riskDist.low    / total) * 100), color: "bg-emerald-500",text: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Analysis</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            AI-powered risk intelligence across your SA legal document portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">
            <Zap className="h-4 w-4" /> Run Bulk Analysis
          </Button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {analyticsLoading
          ? [...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)
          : [
              {
                label: "Portfolio Risk Score",
                value: analytics?.portfolio_risk_score != null ? `${analytics.portfolio_risk_score}/100` : "—",
                sub:   analytics?.risk_label ?? "Calculating…",
                icon:  Shield,       from: "from-amber-500",  to: "to-orange-500",  ring: "ring-amber-100",  bg: "bg-amber-50",
              },
              {
                label: "Documents Analysed",
                value: analytics?.total_documents ?? "—",
                sub:   analytics?.documents_delta ?? "",
                icon:  FileText,     from: "from-indigo-500", to: "to-violet-600",  ring: "ring-indigo-100", bg: "bg-indigo-50",
              },
              {
                label: "Clauses Flagged",
                value: analytics?.clauses_flagged ?? "—",
                sub:   analytics?.clauses_sub ?? "",
                icon:  AlertTriangle,from: "from-red-500",    to: "to-rose-500",    ring: "ring-red-100",    bg: "bg-red-50",
              },
              {
                label: "Avg. Analysis Time",
                value: analytics?.avg_analysis_time ?? "—",
                sub:   "Per document",
                icon:  Clock,        from: "from-emerald-500",to: "to-teal-500",    ring: "ring-emerald-100",bg: "bg-emerald-50",
              },
            ].map(({ label, value, sub, icon: Icon, from, to, ring, bg }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card card-hover">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-xl p-2.5 ring-4 ${bg} ${ring}`}>
                    <div className={`rounded-lg bg-gradient-to-br ${from} ${to} p-1.5`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300" />
                </div>
                <p className="font-mono text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-0.5 text-sm text-slate-500">{label}</p>
                {sub && <p className="mt-1.5 font-mono text-xs text-indigo-600">{sub}</p>}
              </div>
            ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Risk distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-serif text-lg font-semibold text-slate-900">Risk Distribution</h2>
            <p className="mt-0.5 font-mono text-xs text-slate-400">Portfolio breakdown</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex h-3 overflow-hidden rounded-full gap-0.5">
              {RISK_BREAKDOWN.map(({ label, pct, color }) => (
                <div key={label} className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              ))}
            </div>
            <div className="space-y-3">
              {RISK_BREAKDOWN.map(({ label, count, pct, text, bg, border, color }) => (
                <div key={label} className={`flex items-center justify-between rounded-xl border p-3.5 ${bg} ${border}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`h-3 w-3 rounded-full ${color}`} />
                    <span className={`text-sm font-medium ${text}`}>{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm font-bold ${text}`}>{count}</span>
                    <span className={`font-mono text-xs ${text} opacity-60`}>{pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent documents with risk scores */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">Risk Scores by Document</h2>
              <p className="mt-0.5 font-mono text-xs text-slate-400">Groq AI · LLaMA 3.1 analysis</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-indigo-600">View all</Button>
          </div>
          <div className="divide-y divide-slate-50 p-2">
            {docsLoading
              ? [...Array(5)].map((_, i) => <div key={i} className="m-2 skeleton h-14 rounded-xl" />)
              : docs.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-400">No documents analysed yet.</p>
                  </div>
                )
                : docs.slice(0, 6).map((doc: any) => {
                  const score = doc.risk_score ?? 0;
                  const trend = doc.risk_trend ?? "up";
                  return (
                    <div key={doc.id} className="group flex items-center gap-4 rounded-xl px-4 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{doc.name ?? doc.filename}</p>
                        <p className="mt-0.5 font-mono text-xs text-slate-400">
                          {doc.document_type ?? doc.type} ·{" "}
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString("en-ZA") : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-28 hidden sm:block">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] text-slate-400">Risk score</span>
                            <span className={cn(
                              "font-mono text-xs font-bold",
                              score < 40 ? "text-red-600" : score < 70 ? "text-amber-600" : "text-emerald-600"
                            )}>{score}</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                score < 40 ? "bg-red-500" : score < 70 ? "bg-amber-500" : "bg-emerald-500"
                              )}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-xs font-medium border",
                          trend === "up"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {trend === "up"
                            ? <TrendingUp   className="h-3 w-3" />
                            : <TrendingDown className="h-3 w-3" />}
                          {score}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* ── SA clause frequency ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-slate-900">SA Clause Frequency</h2>
            <p className="mt-0.5 font-mono text-xs text-slate-400">
              Most common clause types flagged in South African contracts
            </p>
          </div>
          {clauses?.length > 0 && (
            <Badge variant="secondary" className="font-mono text-[10px]">{clauses.length} types</Badge>
          )}
        </div>
        <div className="p-6">
          {clausesLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
            </div>
          ) : clauses?.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clauses.map((clause: any) => {
                const riskVariant: Record<string, "destructive" | "warning" | "success"> = {
                  high: "destructive", medium: "warning", low: "success",
                };
                const barColor: Record<string, string> = {
                  high: "bg-red-500", medium: "bg-amber-500", low: "bg-emerald-500",
                };
                const maxCount = clauses[0]?.count ?? 1;
                return (
                  <div key={clause.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-slate-700">{clause.label}</p>
                      <Badge variant={riskVariant[clause.risk] ?? "secondary"} className="text-[10px]">
                        {clause.risk}
                      </Badge>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-mono text-xl font-bold text-slate-900">{clause.count}</span>
                      <span className="font-mono text-xs text-slate-400 mb-0.5">occurrences</span>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor[clause.risk] ?? "bg-indigo-500"}`}
                        style={{ width: `${(clause.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-400">No clause data yet — upload and analyse documents to see patterns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import {
  Shield, CheckCircle2, AlertTriangle, Clock,
  FileText, Building2, Search, Zap,
  BarChart3, ExternalLink, Download,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useDiligence } from "@/features/diligence/hooks";

const CHECKS = [
  {
    id: "cipc",
    label: "CIPC Registration",
    desc: "Verify Companies and Intellectual Property Commission registration status",
    icon: Building2,
  },
  {
    id: "directors",
    label: "Director & Officer Search",
    desc: "Search current directors, deregistered companies and disqualification records",
    icon: Search,
  },
  {
    id: "litigation",
    label: "Litigation History",
    desc: "Search court records via SAFLII — High Court, SCA and CC proceedings",
    icon: Shield,
  },
  {
    id: "financial",
    label: "Financial Statements",
    desc: "Review most recent annual financial statements lodged with CIPC",
    icon: BarChart3,
  },
  {
    id: "contracts",
    label: "Material Contracts",
    desc: "Review uploaded contracts, MOIs and shareholder agreements",
    icon: FileText,
  },
  {
    id: "bbbee",
    label: "B-BBEE Status",
    desc: "Verify current B-BBEE rating certificate and verification agency",
    icon: CheckCircle2,
  },
  {
    id: "popia",
    label: "POPIA Compliance",
    desc: "Check POPIA information officer registration and privacy notices",
    icon: Shield,
  },
  {
    id: "tax",
    label: "SARS Tax Clearance",
    desc: "Verify current SARS tax clearance certificate (good standing)",
    icon: FileText,
  },
];

const STATUS_CONFIG: Record<string, {
  badge: "success" | "warning" | "destructive" | "secondary";
  dot: string;
  label: string;
  bg: string;
  border: string;
  text: string;
}> = {
  complete: { badge: "success",     dot: "bg-emerald-500", label: "Clear",     bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700" },
  warning:  { badge: "warning",     dot: "bg-amber-500",   label: "Attention", bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-700"   },
  error:    { badge: "destructive", dot: "bg-red-500",     label: "Flag",      bg: "bg-red-50",     border: "border-red-100",     text: "text-red-700"     },
  pending:  { badge: "secondary",   dot: "bg-slate-300",   label: "Pending",   bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-500"   },
  running:  { badge: "pending",     dot: "bg-indigo-400",  label: "Running",   bg: "bg-indigo-50",  border: "border-indigo-100",  text: "text-indigo-600"  },
};

export default function DiligencePage() {
  const [entity,  setEntity]  = useState("");
  const [regNo,   setRegNo]   = useState("");
  const [started, setStarted] = useState(false);

  const { data: report, isLoading, mutate: runDiligence } = useDiligence();

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!entity.trim()) return;
    setStarted(true);
    runDiligence({ entity_name: entity, registration_number: regNo });
  }

  const checks = report?.checks ?? CHECKS.map((c) => ({ ...c, status: "pending", notes: null }));
  const complete = checks.filter((c: any) => c.status === "complete").length;
  const flagged  = checks.filter((c: any) => c.status === "error" || c.status === "warning").length;
  const progress = Math.round((complete / checks.length) * 100);

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-6">

      {/* ── Header ── */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-slate-900">Due Diligence</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          AI-powered entity research for South African companies — CIPC, SAFLII, SARS & POPIA
        </p>
      </div>

      {/* ── Entity input ── */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm">
        <form onSubmit={handleStart} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Entity Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  placeholder="e.g. Naspers Limited"
                  required
                  className={cn(
                    "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm",
                    "text-slate-900 placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300",
                    "transition-all duration-200"
                  )}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                CIPC Registration No. <span className="text-slate-400 normal-case">(optional)</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. 1925/001431/06"
                  className={cn(
                    "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm",
                    "text-slate-900 placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300",
                    "transition-all duration-200"
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {CHECKS.map((c) => (
                <span key={c.id} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-[10px] text-slate-500 shadow-sm">
                  {c.label}
                </span>
              ))}
            </div>
            <Button type="submit" disabled={isLoading} className="shrink-0 ml-4">
              {isLoading
                ? <><Clock className="h-4 w-4 animate-spin" /> Running…</>
                : <><Zap className="h-4 w-4" /> Run Diligence</>}
            </Button>
          </div>
        </form>
      </div>

      {/* ── Report ── */}
      {started && (
        <div className="space-y-5 animate-in">

          {/* Progress card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="font-serif text-lg font-semibold text-slate-900">
                  {report?.entity_name ?? entity}
                </h2>
                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  {regNo && `Reg. ${regNo} · `}
                  {complete}/{checks.length} checks complete
                  {flagged > 0 && (
                    <span className="ml-2 text-red-600 font-medium">· {flagged} flag{flagged !== 1 ? "s" : ""}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-slate-900">{progress}%</span>
                  <p className="font-mono text-[10px] text-slate-400">complete</p>
                </div>
                <Button variant="outline" size="sm" disabled={!report}>
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  flagged > 0
                    ? "bg-gradient-to-r from-amber-500 to-red-500"
                    : "bg-gradient-to-r from-indigo-500 to-violet-600"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Overall risk badge */}
            {report?.overall_risk && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-slate-500">Overall risk:</span>
                <Badge
                  variant={
                    report.overall_risk === "high" ? "destructive" :
                    report.overall_risk === "medium" ? "warning" : "success"
                  }
                >
                  {report.overall_risk} risk
                </Badge>
              </div>
            )}
          </div>

          {/* Check cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {checks.map((check: any, i: number) => {
              const cfg      = STATUS_CONFIG[check.status ?? "pending"];
              const Icon     = CHECKS.find((c) => c.id === check.id)?.icon ?? Shield;
              const desc     = CHECKS.find((c) => c.id === check.id)?.desc ?? "";
              return (
                <div
                  key={check.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card animate-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="mb-3.5 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                      <Icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        cfg.dot,
                        check.status === "running" && "animate-pulse"
                      )} />
                      <Badge variant={cfg.badge} className="text-[10px]">{cfg.label}</Badge>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">{check.label}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{desc}</p>

                  {check.notes && (
                    <div className={cn("mt-3 rounded-xl border px-3 py-2", cfg.bg, cfg.border)}>
                      <p className={cn("text-xs font-medium", cfg.text)}>{check.notes}</p>
                    </div>
                  )}

                  {!check.notes && (
                    <div className={cn("mt-3 rounded-xl border px-3 py-2", cfg.bg, cfg.border)}>
                      <p className={cn("flex items-center gap-1.5 text-xs", cfg.text)}>
                        {check.status === "complete"  && <><CheckCircle2 className="h-3.5 w-3.5" /> No issues found</>}
                        {check.status === "warning"   && <><AlertTriangle className="h-3.5 w-3.5" /> Requires review</>}
                        {check.status === "error"     && <><AlertTriangle className="h-3.5 w-3.5" /> Issue flagged</>}
                        {check.status === "pending"   && <><Clock className="h-3.5 w-3.5" /> Queued</>}
                        {check.status === "running"   && <><Zap className="h-3.5 w-3.5 animate-pulse" /> Analysing…</>}
                      </p>
                    </div>
                  )}

                  {check.source_url && (
                    <a
                      href={check.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1 font-mono text-[10px] text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> View source
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Idle ── */}
      {!started && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
            <Shield className="h-8 w-8 text-indigo-400 animate-float" />
          </div>
          <h3 className="mt-5 font-serif text-xl font-semibold text-slate-800">
            Start a due diligence report
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
            Enter a South African entity name and optional CIPC registration number
            to run a comprehensive AI-powered due diligence check across CIPC, SAFLII, SARS and POPIA registers.
          </p>
        </div>
      )}
    </div>
  );
}
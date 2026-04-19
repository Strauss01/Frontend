"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Info, CheckCircle, ChevronDown, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Document {
  id: number;
  title: string;
  created_at: string;
}

interface DueDiligenceResult {
  red_flags: string[];
  risks: string[];
  recommendations: string[];
  overall_risk: "low" | "medium" | "high" | "unknown";
}

interface AnalysisResult {
  id: number;
  document_id: number;
  summary: string;
  confidence_score: number;
  due_diligence: DueDiligenceResult | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  low:     { label: "Low Risk",     colour: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  medium:  { label: "Medium Risk",  colour: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20" },
  high:    { label: "High Risk",    colour: "text-red-400",     bg: "bg-red-400/10 border-red-400/20" },
  unknown: { label: "Risk Unknown", colour: "text-zinc-400",    bg: "bg-zinc-400/10 border-zinc-400/20" },
};

function RiskBadge({ level }: { level: keyof typeof RISK_CONFIG }) {
  const cfg = RISK_CONFIG[level] ?? RISK_CONFIG.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.colour}`}>
      <Shield className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function Section({
  title,
  icon,
  items,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  accent: string;
}) {
  const [open, setOpen] = useState(true);
  if (!items.length) return null;
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <span className={`flex items-center gap-2 text-sm font-medium ${accent}`}>
          {icon}
          {title}
          <span className="ml-1 text-xs font-normal text-muted-foreground">({items.length})</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${accent.replace("text-", "bg-")}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiligencePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Fetch available documents on mount
  useEffect(() => {
    fetch("/api/v1/documents/list", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setDocuments(Array.isArray(data) ? data : []))
      .catch(() => setDocuments([]));
  }, []);

  async function runDueDiligence() {
    if (!selectedDocId) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Start analysis
      const runRes = await fetch("/api/v1/analysis/run", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: selectedDocId }),
      });

      if (!runRes.ok) {
        const err = await runRes.json().catch(() => ({}));
        throw new Error(err?.detail ?? `Analysis failed (${runRes.status})`);
      }

      const { analysis_id } = await runRes.json();

      // 2. Fetch full result
      const resultRes = await fetch(`/api/v1/analysis/${analysis_id}`, {
        credentials: "include",
      });

      if (!resultRes.ok) throw new Error("Could not retrieve analysis result.");

      setResult(await resultRes.json());
    } catch (e: any) {
      setError(e.message ?? "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  const dd = result?.due_diligence;
  const riskLevel = (dd?.overall_risk ?? "unknown") as keyof typeof RISK_CONFIG;

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">Due Diligence</p>
        <h1 className="font-serif text-3xl font-bold text-white">Due Diligence Engine</h1>
        <p className="text-muted-foreground mt-1">
          Risk analysis, red flags, and recommendations on legal documents.
        </p>
      </div>

      {/* Document selector + run */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-gold-400" />
            Select Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents found. Upload a document via the Documents page first.
            </p>
          ) : (
            <select
              value={selectedDocId ?? ""}
              onChange={(e) => {
                setSelectedDocId(Number(e.target.value) || null);
                setResult(null);
                setError(null);
              }}
              className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400"
            >
              <option value="">— Choose a document —</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={runDueDiligence}
            disabled={!selectedDocId || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gold-400 text-black text-sm font-semibold hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analysing…
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Run Due Diligence
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && dd && (
        <div className="space-y-4">
          {/* Risk overview */}
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Overall Risk Assessment</p>
                <RiskBadge level={riskLevel} />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {Math.round((result.confidence_score ?? 0) * 100)}
                  <span className="text-sm font-normal text-muted-foreground">%</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {result.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Red flags / Risks / Recommendations */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Section
                title="Red Flags"
                icon={<AlertTriangle className="h-4 w-4" />}
                items={dd.red_flags}
                accent="text-red-400"
              />
              <Section
                title="Risks"
                icon={<Info className="h-4 w-4" />}
                items={dd.risks}
                accent="text-amber-400"
              />
              <Section
                title="Recommendations"
                icon={<CheckCircle className="h-4 w-4" />}
                items={dd.recommendations}
                accent="text-emerald-400"
              />
              {!dd.red_flags.length && !dd.risks.length && !dd.recommendations.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No issues identified.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

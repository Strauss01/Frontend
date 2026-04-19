"use client";

import { useState } from "react";
import { BarChart3, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { runAnalysis, getAnalysis } from "@/lib/services";
import { useDocuments } from "@/features/documents/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AnalysisPage() {
  const { data: documents, isLoading: docsLoading } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);

  const { mutate: run, isPending } = useMutation({
    mutationFn: () => runAnalysis(selectedDocId!),
    onSuccess: (data) => {
      setAnalysisId(data.analysis_id);
      toast.success("Analysis complete");
    },
    onError: () => toast.error("Analysis failed. Please try again."),
  });

  const { data: analysis } = useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: () => getAnalysis(analysisId!),
    enabled: !!analysisId,
  });

  const irac = analysis?.irac ? (typeof analysis.irac === "string" ? JSON.parse(analysis.irac) : analysis.irac) : null;
  const issues = analysis?.issues ? (typeof analysis.issues === "string" ? JSON.parse(analysis.issues) : analysis.issues) : [];
  const citations = analysis?.citations ? (typeof analysis.citations === "string" ? JSON.parse(analysis.citations) : analysis.citations) : [];
  const due = analysis?.due_diligence ? (typeof analysis.due_diligence === "string" ? JSON.parse(analysis.due_diligence) : analysis.due_diligence) : null;

  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">AI Analysis</p>
        <h1 className="font-serif text-3xl font-bold text-white">Legal Analysis</h1>
        <p className="text-muted-foreground mt-1">Run the multi-agent AI pipeline on any uploaded document.</p>
      </div>

      {/* Document selector */}
      <Card>
        <CardHeader><CardTitle className="text-base">Select Document</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {docsLoading ? (
            <p className="text-sm text-muted-foreground">Loading documents…</p>
          ) : documents?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {documents?.map((doc: any) => (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedDocId(doc.id); setAnalysisId(null); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                    selectedDocId === doc.id
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium truncate">{doc.title}</span>
                  {selectedDocId === doc.id && <CheckCircle className="h-4 w-4 text-primary ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          )}
          <Button onClick={() => run()} disabled={!selectedDocId || isPending} className="w-full">
            {isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analysing…</> : "Run Analysis"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Summary</CardTitle>
              <span className={cn(
                "ml-auto text-xs font-mono px-2 py-1 rounded-full",
                (analysis.confidence_score || 0) > 0.8 ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
              )}>
                {Math.round((analysis.confidence_score || 0) * 100)}% confidence
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          {/* Issues */}
          {issues.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Key Legal Issues</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {issues.map((issue: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{issue}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* IRAC */}
          {irac && (
            <Card>
              <CardHeader><CardTitle className="text-base">IRAC Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {["issue", "rule", "application", "conclusion"].map((key) => irac[key] && (
                  <div key={key}>
                    <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">{key}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{irac[key]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Citations */}
          {citations.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Citations ({citations.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {citations.map((c: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30 border border-border">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    <span className="text-xs font-mono text-foreground">{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Due Diligence */}
          {due && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Due Diligence</CardTitle>
                <span className={cn(
                  "text-xs font-mono px-2 py-1 rounded-full capitalize",
                  due.overall_risk === "low" ? "bg-green-500/10 text-green-400" :
                  due.overall_risk === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"
                )}>
                  {due.overall_risk} risk
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                {due.red_flags?.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">Red Flags</p>
                    {due.red_flags.map((f: string, i: number) => (
                      <p key={i} className="text-sm text-muted-foreground flex items-start gap-2 mb-1">
                        <span className="text-red-400 shrink-0">⚠</span>{f}
                      </p>
                    ))}
                  </div>
                )}
                {due.recommendations?.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-2">Recommendations</p>
                    {due.recommendations.map((r: string, i: number) => (
                      <p key={i} className="text-sm text-muted-foreground flex items-start gap-2 mb-1">
                        <span className="text-green-400 shrink-0">✓</span>{r}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useDocument } from "@/features/documents/hooks";
import { useRunAnalysis, useTaskPolling } from "@/features/analysis/hooks";
import { AnalysisReport } from "@/features/analysis/components/AnalysisReport";
import { TaskStatusBadge } from "@/features/analysis/components/TaskStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import type { Analysis } from "@/features/analysis/types";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const docId = Number(params.id);

  const { data: document, isLoading, isError } = useDocument(docId);
  const runAnalysis = useRunAnalysis();

  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedAnalysis, setCompletedAnalysis] = useState<Analysis | null>(null);

  const handleSuccess = useCallback((analysis: Analysis) => {
    setCompletedAnalysis(analysis);
    setTaskId(null);
  }, []);

  const { status: taskStatus, isPolling } = useTaskPolling({
    taskId,
    onSuccess: handleSuccess,
    onFailure: () => setTaskId(null),
  });

  const handleRunAnalysis = () => {
    setCompletedAnalysis(null);
    runAnalysis.mutate(
      { document_id: docId },
      { onSuccess: (data) => setTaskId(data.task_id) }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (isError || !document) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-8 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Document not found or failed to load.</p>
        </CardContent>
      </Card>
    );
  }

  const isRunning = runAnalysis.isPending || isPolling;

  return (
    <div className="space-y-6 animate-in max-w-4xl">
      {/* Back nav */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Documents
      </Button>

      {/* Document header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg">{document.title}</CardTitle>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  ID {document.id} · Uploaded {formatDate(document.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {taskStatus && isPolling && (
                <TaskStatusBadge status={taskStatus.status} />
              )}
              <Button
                onClick={handleRunAnalysis}
                disabled={isRunning}
                size="sm"
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {isPolling ? "Analysing…" : "Starting…"}
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis status / result */}
      {isPolling && !completedAnalysis && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">Analysing document…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This may take a moment. Hang tight.
                </p>
              </div>
              {taskStatus && (
                <TaskStatusBadge status={taskStatus.status} />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {completedAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-sans font-semibold">
              Analysis Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalysisReport analysis={completedAnalysis} />
          </CardContent>
        </Card>
      )}

      {!isPolling && !completedAnalysis && !runAnalysis.isPending && (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Play className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No analysis yet. Click{" "}
              <span className="text-primary font-medium">Run Analysis</span> to
              extract legal intelligence from this document.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { analysisApi } from "./api";
import { queryKeys } from "@/lib/query-keys";
import { usePolling } from "@/hooks/usePolling";
import type { Analysis, TaskStatusResponse } from "./types";

export function useRunAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analysisApi.run,
    onSuccess: () => {
      // Invalidate documents so status badges refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all() });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to start analysis");
    },
  });
}

export function useAnalysis(analysisId: number | null) {
  return useQuery({
    queryKey: queryKeys.analysis.detail(analysisId ?? 0),
    queryFn: () => analysisApi.get(analysisId!),
    enabled: !!analysisId,
  });
}

interface UseTaskPollingOptions {
  taskId: string | null;
  onSuccess: (analysis: Analysis) => void;
  onFailure?: () => void;
}

/**
 * Polls a Celery task until it reaches SUCCESS or FAILURE.
 * Exposes the latest status and a stop handle.
 */
export function useTaskPolling({
  taskId,
  onSuccess,
  onFailure,
}: UseTaskPollingOptions) {
  const [status, setStatus] = useState<TaskStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState(!!taskId);

  const handleData = useCallback(
    (data: TaskStatusResponse) => {
      setStatus(data);
      const s = data.status?.toUpperCase();

      if (s === "SUCCESS" && data.result) {
        setIsPolling(false);
        toast.success("Analysis complete");
        onSuccess(data.result);
      } else if (s === "FAILURE") {
        setIsPolling(false);
        toast.error("Analysis failed");
        onFailure?.();
      }
      // PENDING / PROGRESS — keep polling
    },
    [onSuccess, onFailure]
  );

  const { stop } = usePolling({
    fn: () => analysisApi.status(taskId!),
    enabled: isPolling && !!taskId,
    interval: 2500,
    timeout: 5 * 60 * 1000,
    onData: handleData,
    onTimeout: () => {
      setIsPolling(false);
      toast.error("Analysis timed out — please try again");
    },
    onError: () => {
      // silently retry; usePolling already schedules the next tick
    },
  });

  const cancel = useCallback(() => {
    setIsPolling(false);
    stop();
  }, [stop]);

  return { status, isPolling, cancel };
}

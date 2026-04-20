import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAnalytics(params?: Record<string, string>) {
  return useQuery({ queryKey: ["analytics", params], queryFn: () => api.get("/analysis/analytics", { params }) });
}
export function useClauseAnalytics(documentId?: string) {
  return useQuery({ queryKey: ["analytics", "clauses", documentId], queryFn: () => api.get("/analysis/clauses", { params: { document_id: documentId } }), enabled: !!documentId });
}
export function useRunAnalysis() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post("/analysis/run", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["analytics"] }) });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDiligence(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["diligence", params],
    queryFn: () => api.get("/diligence", { params }),
  });
}

export function useDiligenceReport(id: string) {
  return useQuery({
    queryKey: ["diligence", id],
    queryFn: () => api.get(`/diligence/${id}`),
    enabled: !!id,
  });
}

export function useCreateDiligence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post("/diligence", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diligence"] }),
  });
}

export function useDeleteDiligence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/diligence/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diligence"] }),
  });
}

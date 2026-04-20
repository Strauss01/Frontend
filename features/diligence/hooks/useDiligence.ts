import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDiligence() {
  return useQuery({ queryKey: ["diligence"], queryFn: () => api.get("/diligence") });
}

export function useDiligenceReport(id: string) {
  return useQuery({ queryKey: ["diligence", id], queryFn: () => api.get(`/diligence/${id}`), enabled: !!id });
}

export function useCreateDiligence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post("/diligence", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diligence"] }),
  });
}
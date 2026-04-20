import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSearch(query: string, filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["search", query, filters],
    queryFn: () => api.get("/search", { params: { q: query, ...filters } }),
    enabled: query.length > 1,
  });
}

export function useSearchHistory() {
  return useQuery({
    queryKey: ["search", "history"],
    queryFn: () => api.get("/search/history"),
  });
}

export function useSaveSearch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post("/search/saved", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["search", "history"] }),
  });
}

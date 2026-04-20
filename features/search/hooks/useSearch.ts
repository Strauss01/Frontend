import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => api.get("/search", { params: { q: query } }),
    enabled: query.length > 2,
  });
}

export function useSearchResults(query: string, filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["search", "results", query, filters],
    queryFn: () => api.get("/search/results", { params: { q: query, ...filters } }),
    enabled: query.length > 2,
  });
}
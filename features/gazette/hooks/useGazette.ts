import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useGazette(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["gazette", params],
    queryFn: () => api.get("/gazette", { params }),
  });
}

export function useGazetteIssue(id: string) {
  return useQuery({
    queryKey: ["gazette", id],
    queryFn: () => api.get(`/gazette/${id}`),
    enabled: !!id,
  });
}

export function useGazetteSearch(query: string) {
  return useQuery({
    queryKey: ["gazette", "search", query],
    queryFn: () => api.get("/gazette/search", { params: { q: query } }),
    enabled: query.length > 1,
  });
}

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useGazette(params?: Record<string, string>) {
  return useQuery({ queryKey: ["gazette", params], queryFn: () => api.get("/gazette", { params }) });
}

export function useGazetteIssue(id: string) {
  return useQuery({ queryKey: ["gazette", id], queryFn: () => api.get(`/gazette/${id}`), enabled: !!id });
}
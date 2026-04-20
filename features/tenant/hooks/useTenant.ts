import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTenant() {
  return useQuery({ queryKey: ["tenant"], queryFn: () => api.get("/tenant") });
}
export function useTenantMembers() {
  return useQuery({ queryKey: ["tenant", "members"], queryFn: () => api.get("/tenant/members") });
}
export function useUpdateTenant() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.patch("/tenant", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant"] }) });
}
export function useInviteMember() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { email: string; role?: string }) => api.post("/tenant/members/invite", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant", "members"] }) });
}
export function useRemoveMember() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (userId: string) => api.delete(`/tenant/members/${userId}`), onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant", "members"] }) });
}
export function useRegenerateApiKey() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.post("/tenant/api-key/regenerate"), onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant"] }) });
}

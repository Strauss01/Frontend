import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tenantApi } from "./api";
import { queryKeys } from "@/lib/query-keys";
import type { CreateTenantPayload } from "./types";

export function useTenant() {
  return useQuery({
    queryKey: queryKeys.tenant.current(),
    queryFn: tenantApi.current,
    retry: false,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTenantPayload) => tenantApi.create(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.tenant.current(), data);
      toast.success(`Workspace "${data.name}" created`);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to create workspace");
    },
  });
}

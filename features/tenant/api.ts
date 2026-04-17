import { apiClient } from "@/lib/axios";
import type { CreateTenantPayload, Tenant } from "./types";

export const tenantApi = {
  create: async (payload: CreateTenantPayload): Promise<Tenant> => {
    const { data } = await apiClient.post<Tenant>("/tenant/create", payload);
    return data;
  },

  current: async (): Promise<Tenant> => {
    const { data } = await apiClient.get<Tenant>("/tenant/current");
    return data;
  },
};

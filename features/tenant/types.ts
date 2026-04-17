export interface Tenant {
  id: number;
  name: string;
  plan: string;
  created_at: string;
}

export interface CreateTenantPayload {
  name: string;
  plan?: string;
}

export const useTenant = () => ({ data: null as any, isLoading: false });
export const useTenantMembers = () => ({ data: [] as any[], isLoading: false });
export const useUpdateTenant = () => ({ mutate: (_data: unknown) => {}, isLoading: false, isPending: false });
export const useInviteMember = () => ({ mutate: (_data: { email: string; role?: string }) => {}, isLoading: false, isPending: false });
export const useRemoveMember = () => ({ mutate: (_userId: string) => {}, isLoading: false, isPending: false });
export const useRegenerateApiKey = () => ({ mutate: () => {}, isLoading: false, isPending: false });
export const useAdminStats = () => ({ data: null as any, isLoading: false });
export const useAdminUsers = () => ({ data: [] as any[], isLoading: false });
export const useAdminTenants = () => ({ data: [] as any[], isLoading: false });
export const useUpdateUserRole = () => ({ mutate: (_p: { userId: string; role: string }) => {}, isLoading: false });
export const useDeleteUser = () => ({ mutate: (_id: string) => {}, isLoading: false });

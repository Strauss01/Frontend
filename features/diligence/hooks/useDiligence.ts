export const useDiligence = (_params?: Record<string, string>) => ({ data: [] as any[], isLoading: false });
export const useDiligenceReport = (_id: string) => ({ data: null as any, isLoading: false });
export const useCreateDiligence = () => ({ mutate: (_data: unknown) => {}, isLoading: false });
export const useDeleteDiligence = () => ({ mutate: (_id: string) => {}, isLoading: false });
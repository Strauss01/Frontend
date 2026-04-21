export const useAnalytics = (_params?: Record<string, string>) => ({ data: null as any, isLoading: false });
export const useClauseAnalytics = (_documentId?: string) => ({ data: null as any, isLoading: false });
export const useRunAnalysis = () => ({ mutate: (_data: unknown) => {}, isLoading: false });
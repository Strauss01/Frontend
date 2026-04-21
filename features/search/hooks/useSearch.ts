export const useSearch = (_query: string, _filters?: Record<string, string>) => ({ data: [] as any[], isLoading: false, mutate: (_data?: unknown) => {} });
export const useLegalSearch = (_query?: string, _filters?: Record<string, string>) => ({ data: [] as any[], isLoading: false, mutate: (_data?: unknown) => {} });
export const useSearchHistory = () => ({ data: [] as any[], isLoading: false });
export const useSaveSearch = () => ({ mutate: (_data: unknown) => {}, isLoading: false });
export const useGazette = (_params?: Record<string, string>) => ({ data: [] as any[], isLoading: false });
export const useGazetteIssue = (_id: string) => ({ data: null as any, isLoading: false });
export const useGazetteSearch = (_query: string) => ({ data: [] as any[], isLoading: false });
export const useBookmarkGazette = () => ({ mutate: (_id: string) => {}, isLoading: false });
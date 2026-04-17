/**
 * Centralized TanStack Query key factory.
 * Using factories ensures invalidation is precise and type-safe.
 */
export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  tenant: {
    current: () => ["tenant", "current"] as const,
  },
  documents: {
    all: () => ["documents"] as const,
    list: () => ["documents", "list"] as const,
    detail: (id: number) => ["documents", id] as const,
  },
  analysis: {
    status: (taskId: string) => ["analysis", "status", taskId] as const,
    detail: (analysisId: number) => ["analysis", analysisId] as const,
  },
} as const;

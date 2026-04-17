import { apiClient } from "@/lib/axios";
import type {
  Analysis,
  RunAnalysisPayload,
  RunAnalysisResponse,
  TaskStatusResponse,
} from "./types";

export const analysisApi = {
  run: async (payload: RunAnalysisPayload): Promise<RunAnalysisResponse> => {
    const { data } = await apiClient.post<RunAnalysisResponse>(
      "/analysis/run",
      payload
    );
    return data;
  },

  status: async (taskId: string): Promise<TaskStatusResponse> => {
    const { data } = await apiClient.get<TaskStatusResponse>(
      `/analysis/status/${taskId}`
    );
    return data;
  },

  get: async (analysisId: number): Promise<Analysis> => {
    const { data } = await apiClient.get<Analysis>(`/analysis/${analysisId}`);
    return data;
  },
};

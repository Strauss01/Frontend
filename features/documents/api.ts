import { apiClient } from "@/lib/axios";
import type { Document, UploadResponse } from "./types";

export const documentsApi = {
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<UploadResponse>(
      "/documents/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  list: async (): Promise<Document[]> => {
    const { data } = await apiClient.get<Document[]>("/documents/list");
    return data;
  },

  get: async (id: number): Promise<Document> => {
    const { data } = await apiClient.get<Document>(`/documents/${id}`);
    return data;
  },
};

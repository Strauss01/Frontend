import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentsApi } from "./api";
import { queryKeys } from "@/lib/query-keys";

export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: documentsApi.list,
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: queryKeys.documents.detail(id),
    queryFn: () => documentsApi.get(id),
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => documentsApi.upload(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.list() });
      toast.success(data.message ?? "Document uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Upload failed");
    },
  });
}

export interface Document {
  id: number;
  title: string;
  created_at: string;
  tenant_id: number;
}

export interface UploadResponse {
  message: string;
  document_id: number;
}

import { apiClient } from "@/lib/api";

// ─── Search ──────────────────────────────────────────────────────────────────
export const searchCases = (q: string, court?: string, limit = 10) =>
  apiClient.get("/search/cases", { params: { q, court, limit } }).then(r => r.data);

export const searchLegislation = (q: string, limit = 10) =>
  apiClient.get("/search/legislation", { params: { q, limit } }).then(r => r.data);

export const searchGazettes = (q: string, limit = 10) =>
  apiClient.get("/search/gazettes", { params: { q, limit } }).then(r => r.data);

export const getCitationGraph = (caseId: number) =>
  apiClient.get(`/search/citations/${caseId}`).then(r => r.data);

// ─── Analysis ────────────────────────────────────────────────────────────────
export const runAnalysis = (document_id: number) =>
  apiClient.post("/analysis/run", { document_id }).then(r => r.data);

export const getAnalysis = (analysisId: number) =>
  apiClient.get(`/analysis/${analysisId}`).then(r => r.data);

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const askQuestion = (document_id: number, question: string, history: { role: string; content: string }[]) =>
  apiClient.post("/chat/ask", { document_id, question, history }).then(r => r.data);

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getAdminStats = () =>
  apiClient.get("/admin/stats").then(r => r.data);

export const listAllUsers = () =>
  apiClient.get("/admin/users").then(r => r.data);

export const listAllTenants = () =>
  apiClient.get("/admin/tenants").then(r => r.data);

export const updateUserRole = (userId: number, role: string) =>
  apiClient.patch(`/admin/users/${userId}/role`, { role }).then(r => r.data);

export const deleteUser = (userId: number) =>
  apiClient.delete(`/admin/users/${userId}`).then(r => r.data);

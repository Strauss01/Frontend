export interface IracBlock {
  issue: string;
  rule: string;
  application: string;
  conclusion: string;
}

export interface Analysis {
  id: number;
  document_id: number;
  summary: string;
  issues: string[];
  irac: IracBlock;
  citations: string[];
  confidence_score: number;
}

export interface RunAnalysisPayload {
  document_id: number;
}

export interface RunAnalysisResponse {
  task_id: string;
}

export type TaskStatus = "PENDING" | "PROGRESS" | "SUCCESS" | "FAILURE" | string;

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  result: Analysis | null;
}

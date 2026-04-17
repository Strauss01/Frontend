"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/features/analysis/types";

interface Props {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: Props) {
  const s = status.toUpperCase();

  if (s === "SUCCESS") {
    return <Badge variant="success">Complete</Badge>;
  }
  if (s === "FAILURE") {
    return <Badge variant="destructive">Failed</Badge>;
  }
  if (s === "PROGRESS") {
    return (
      <Badge variant="pending" className="gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Analysing…
      </Badge>
    );
  }
  // PENDING or unknown
  return (
    <Badge variant="warning" className="gap-1.5">
      <Loader2 className="h-3 w-3 animate-spin" />
      Queued
    </Badge>
  );
}

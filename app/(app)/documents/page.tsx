"use client";

import Link from "next/link";
import { FileText, ArrowRight, AlertCircle } from "lucide-react";
import { useDocuments } from "@/features/documents/hooks";
import { DropzoneUpload } from "@/features/documents/components/DropzoneUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const { data: documents, isLoading, isError } = useDocuments();

  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">
          Documents
        </p>
        <h1 className="font-serif text-3xl font-bold text-white">
          Your Documents
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload legal documents and run AI analysis.
        </p>
      </div>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-sans font-semibold">
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DropzoneUpload />
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-white">
          All Documents
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="flex items-center gap-3 py-8 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">Failed to load documents. Please refresh.</p>
            </CardContent>
          </Card>
        ) : !documents || documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-14 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No documents yet — upload one above to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between px-5 py-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-accent transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      ID {doc.id} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

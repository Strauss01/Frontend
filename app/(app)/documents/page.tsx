"use client";

import Link from "next/link";
import { FileText, ArrowRight, AlertCircle } from "lucide-react";
import { useDocuments } from "@/features/documents/hooks";
import { DropzoneUpload } from "@/features/documents/components/DropzoneUpload";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const { data: documents, isLoading, isError } = useDocuments();

  return (
    <div className="space-y-10 animate-in">

      {/* HEADER */}
      <div>
        <p className="text-xs font-mono text-yellow-400 tracking-widest uppercase mb-2">
          Documents
        </p>
        <h1 className="font-serif text-4xl font-bold text-white">
          Your Legal Documents
        </h1>
        <p className="text-white/60 mt-2">
          Upload, analyse, and extract legal intelligence from case files and contracts.
        </p>
      </div>

      {/* UPLOAD ZONE */}
      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-white">
            Upload Document
          </h2>
          <p className="text-sm text-white/50">
            Drop files for AI legal analysis and precedent extraction
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <DropzoneUpload />
        </div>
      </GlassCard>

      {/* LIST SECTION */}
      <div className="space-y-4">

        <h2 className="font-serif text-xl font-semibold text-white">
          Case File Repository
        </h2>

        {/* LOADING */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <GlassCard key={i} className="p-4">
                <Skeleton className="h-6 w-full" />
              </GlassCard>
            ))}
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <GlassCard className="p-6 border-red-500/20">
            <div className="flex items-center gap-3 text-red-300">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                Failed to load documents. Please refresh or retry ingestion.
              </p>
            </div>
          </GlassCard>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && (!documents || documents.length === 0) && (
          <GlassCard className="p-10 text-center">
            <FileText className="h-10 w-10 mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/60">
              No legal documents indexed yet.
            </p>
            <p className="text-xs text-white/40 mt-1">
              Upload a case file or statute to begin analysis.
            </p>
          </GlassCard>
        )}

        {/* DOCUMENT LIST */}
        <div className="space-y-2">
          {documents?.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="block"
            >
              <GlassCard className="p-4 flex items-center justify-between hover:scale-[1.01] transition-transform">

                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <FileText className="h-4 w-4 text-yellow-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-white/40 font-mono">
                      ID {doc.id} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-yellow-300 transition-colors" />
              </GlassCard>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
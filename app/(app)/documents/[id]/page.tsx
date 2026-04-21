"use client";

import { useRef, useState } from "react";
import {
  FileText, Upload, Search, Eye,
  FileSearch, Clock, CheckCircle2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useDocuments, useUploadDocument } from "@/features/documents/hooks";
import type { Document } from "@/features/documents/types";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const inputRef            = useRef<HTMLInputElement>(null);

  const { data: docs = [], isLoading } = useDocuments();
  const upload                          = useUploadDocument();

  const filtered = docs.filter((d: Document) =>
    !search || d.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => upload.mutate(file));
  }

  const thisMonthCount = docs.filter((d: Document) => {
    const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
    return new Date(d.created_at) >= start;
  }).length;

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Documents</h1>
          <p className="mt-0.5 text-sm text-slate-500">Upload and analyse your legal documents</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          {upload.isPending
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
            : <><Upload className="h-4 w-4" /> Upload document</>}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total documents", value: isLoading ? "—" : docs.length, icon: FileText,     color: "text-indigo-600", bg: "bg-indigo-50"  },
          { label: "This month",      value: isLoading ? "—" : thisMonthCount,                   icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Processing",      value: upload.isPending ? 1 : 0,                           icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50"   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-xl", bg)}>
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            <p className="font-mono text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Empty state dropzone ── */}
      {!isLoading && docs.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
            <Upload className="h-6 w-6 text-indigo-500" />
          </div>
          <p className="text-sm font-medium text-slate-700">Drop files here or click to upload</p>
          <p className="mt-1 text-xs text-slate-400">PDF, DOC, DOCX supported</p>
        </div>
      )}

      {/* ── Table ── */}
      {(isLoading || docs.length > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-slate-900">All documents</h2>
              <p className="mt-0.5 font-mono text-xs text-slate-400">
                {isLoading ? "Loading…" : `${docs.length} document${docs.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white transition-all w-60"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileSearch className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-400">No documents match your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {["Document", "ID", "Uploaded", ""].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((doc: Document) => (
                    <tr key={doc.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                            <FileText className="h-4 w-4 text-indigo-500" />
                          </div>
                          <span className="max-w-[400px] truncate text-sm font-medium text-slate-800">
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                        #{doc.id}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                        {new Date(doc.created_at).toLocaleDateString("en-ZA")}
                      </td>
                      <td className="px-3 py-3.5">
                        <a
                          href={`/documents/${doc.id}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
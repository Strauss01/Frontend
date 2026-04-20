"use client";

import { useState } from "react";
import {
  FileText, Upload, Search, MoreHorizontal,
  Download, Trash2, Eye, CheckCircle2, Clock,
  AlertTriangle, SlidersHorizontal, FolderOpen,
  Grid3X3, List, Plus,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useDocuments } from "@/features/documents/hooks";

const TYPES = ["All", "Contract", "NDA", "IP", "Employment", "Corporate", "Property", "Licence"];

export default function DocumentsPage() {
  const [query,    setQuery]    = useState("");
  const [filter,   setFilter]   = useState("All");
  const [view,     setView]     = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);

  const { data: docs = [], isLoading } = useDocuments();

  const visible = docs.filter((d: any) => {
    const matchType  = filter === "All" || d.type === filter;
    const matchQuery = d.name?.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  function toggleSelect(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Documents</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${docs.length} documents · ${docs.filter((d: any) => d.status === "analyzed").length} analyzed`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4" /> Upload Documents
          </Button>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents…"
              className={cn(
                "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 focus:bg-white",
                "transition-all duration-200"
              )}
            />
          </div>

          {/* Type chips */}
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all duration-150",
                  filter === t
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            {/* View toggle */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-0.5">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-lg p-1.5 transition-all duration-150",
                  view === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "rounded-lg p-1.5 transition-all duration-150",
                  view === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selected.length > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 animate-in">
          <span className="font-mono text-xs font-semibold text-indigo-700">{selected.length} selected</span>
          <div className="h-4 w-px bg-indigo-200" />
          <button className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
          <button
            onClick={() => setSelected([])}
            className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-52 rounded-2xl" />
          ))}
        </div>
      ) : visible.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((doc: any) => (
              <DocCard
                key={doc.id}
                doc={doc}
                isSelected={selected.includes(doc.id)}
                onSelect={() => toggleSelect(doc.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Document</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Risk</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Date</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visible.map((doc: any) => (
                  <DocListRow key={doc.id} doc={doc} />
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FolderOpen className="h-7 w-7 text-slate-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">No documents found</p>
          <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters.</p>
          <Button size="sm" className="mt-5">
            <Plus className="h-4 w-4" /> Upload your first document
          </Button>
        </div>
      )}
    </div>
  );
}

/* ── Doc Card (grid) ── */
function DocCard({ doc, isSelected, onSelect }: {
  doc: any; isSelected: boolean; onSelect: () => void;
}) {
  const riskCfg: Record<string, { variant: "destructive" | "warning" | "success"; color: string }> = {
    high:   { variant: "destructive", color: "text-red-500"     },
    medium: { variant: "warning",     color: "text-amber-500"   },
    low:    { variant: "success",     color: "text-emerald-500" },
  };
  const { variant, color } = riskCfg[doc.risk] ?? riskCfg.low;

  return (
    <div className={cn(
      "group relative rounded-2xl border bg-white shadow-card card-hover cursor-pointer transition-all duration-200",
      isSelected ? "border-indigo-300 ring-2 ring-indigo-200 bg-indigo-50/30" : "border-slate-200"
    )}>
      {/* Selection checkbox */}
      <button
        onClick={onSelect}
        className={cn(
          "absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-150",
          isSelected
            ? "border-indigo-500 bg-indigo-500"
            : "border-slate-300 bg-white opacity-0 group-hover:opacity-100"
        )}
      >
        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
      </button>

      <div className="p-5">
        {/* Top row */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={variant} className="text-[10px]">
              <AlertTriangle className="h-2.5 w-2.5" />
              {doc.risk} risk
            </Badge>
            <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Name */}
        <p className="line-clamp-2 text-sm font-semibold text-slate-800 leading-snug">{doc.name}</p>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-slate-400">
          <span className="rounded-md bg-slate-100 px-2 py-0.5">{doc.type}</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5">{doc.pages ?? "—"} pages</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5">{doc.size ?? "—"}</span>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            {doc.status === "analyzed"
              ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="font-mono text-[10px] font-medium text-emerald-600">Analyzed</span></>
              : <><Clock        className="h-3.5 w-3.5 text-amber-400"   /><span className="font-mono text-[10px] font-medium text-amber-600">Pending</span></>}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Eye      className="h-3.5 w-3.5" />
            </button>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Doc List Row ── */
function DocListRow({ doc }: { doc: any }) {
  const riskMap: Record<string, "destructive" | "warning" | "success"> = {
    high: "destructive", medium: "warning", low: "success",
  };
  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
            <FileText className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="max-w-xs truncate text-sm font-medium text-slate-800">{doc.name}</p>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="font-mono text-xs text-slate-500">{doc.type}</span>
      </td>
      <td className="px-4 py-3.5">
        <Badge variant={riskMap[doc.risk] ?? "outline"} className="text-[10px]">{doc.risk}</Badge>
      </td>
      <td className="px-4 py-3.5">
        {doc.status === "analyzed"
          ? <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Analyzed</span>
          : <span className="flex items-center gap-1.5 font-mono text-xs text-amber-600"><Clock className="h-3.5 w-3.5" /> Pending</span>}
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—"}</td>
      <td className="px-3 py-3.5">
        <button className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
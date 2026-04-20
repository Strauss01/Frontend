"use client";

import { useState } from "react";
import {
  BookOpen, Search, ExternalLink, Star,
  StarOff, Calendar, Scale, ChevronDown, Filter,
} from "lucide-react";
import { Badge }       from "@/components/ui/badge";
import { Button }      from "@/components/ui/button";
import { cn }          from "@/lib/utils";
import { useCaseLaw, useBookmarkCase } from "@/features/caselaw/hooks";

const SA_COURTS = [
  "All Courts",
  "Constitutional Court (CC)",
  "Supreme Court of Appeal (SCA)",
  "High Court — Gauteng Division",
  "High Court — Western Cape Division",
  "High Court — KwaZulu-Natal Division",
  "High Court — Eastern Cape Division",
  "High Court — North West Division",
  "High Court — Free State Division",
  "High Court — Limpopo Division",
  "High Court — Northern Cape Division",
  "Labour Court",
  "Labour Appeal Court",
  "Competition Tribunal",
  "Land Claims Court",
  "Electoral Court",
  "Special Tribunal",
];

const SA_AREAS = [
  "All Areas",
  "Constitutional Law",
  "Administrative Law",
  "Contract Law",
  "Delict",
  "Company Law",
  "Labour Law",
  "Property Law",
  "Criminal Law",
  "Family Law",
  "Insolvency",
  "Tax Law",
  "IP Law",
  "POPIA / Data",
];

const SORT_OPTIONS = ["Relevance", "Most Recent", "Most Cited"];

export default function CaseLawPage() {
  const [query, setQuery] = useState("");
  const [court, setCourt] = useState("All Courts");
  const [area,  setArea]  = useState("All Areas");
  const [sort,  setSort]  = useState("Relevance");

  const { data: cases = [], isLoading, mutate: search } = useCaseLaw();
  const bookmarkCase = useBookmarkCase();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    search({ query, court, area, sort });
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-6">

      {/* ── Header ── */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-slate-900">SA Case Law</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Search judgments from the Constitutional Court, SCA, High Courts and specialist tribunals
        </p>
      </div>

      {/* ── Search panel ── */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">

          {/* Main input */}
          <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] transition-all duration-200">
            <BookOpen className="h-5 w-5 shrink-0 text-indigo-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Minister of Health v TAC, [2002] ZACC 15, section 27 access to healthcare…"
              className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching…" : "Find Cases"}
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Court */}
            <div className="relative">
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 font-mono text-xs text-slate-600 shadow-sm focus:outline-none focus:border-indigo-300 transition-colors"
              >
                {SA_COURTS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Area chips */}
            <div className="flex flex-wrap gap-1.5">
              {SA_AREAS.slice(0, 8).map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setArea(a)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all duration-150",
                    area === a
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  )}
                >
                  {a}
                </button>
              ))}
              {/* overflow dropdown */}
              <div className="relative">
                <select
                  value={SA_AREAS.slice(8).includes(area) ? area : ""}
                  onChange={(e) => e.target.value && setArea(e.target.value)}
                  className="h-8 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 font-mono text-xs text-slate-500 focus:outline-none focus:border-indigo-300"
                >
                  <option value="">More…</option>
                  {SA_AREAS.slice(8).map((a) => <option key={a}>{a}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Sort */}
            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 font-mono text-xs text-slate-600 shadow-sm focus:outline-none focus:border-indigo-300"
              >
                {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </form>
      </div>

      {/* ── Results ── */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {!isLoading && cases.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-xs text-slate-500">
            {cases.length} judgment{cases.length !== 1 ? "s" : ""} found
          </p>
          {cases.map((c: any) => (
            <CaseCard
              key={c.id}
              case_={c}
              onBookmark={() => bookmarkCase.mutate(c.id)}
              isBookmarked={c.is_bookmarked ?? false}
            />
          ))}
        </div>
      )}

      {!isLoading && cases.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
            <Scale className="h-8 w-8 text-indigo-400 animate-float" />
          </div>
          <h3 className="mt-5 font-serif text-xl font-semibold text-slate-800">Search SA jurisprudence</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
            Enter a case name, neutral citation (e.g. [2002] ZACC 15),
            legislation section or legal keywords above.
          </p>
        </div>
      )}
    </div>
  );
}

function CaseCard({ case_: c, isBookmarked, onBookmark }: {
  case_: any; isBookmarked: boolean; onBookmark: () => void;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
              {c.title ?? c.case_name}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {c.citation && (
                <span className="font-mono text-xs text-slate-500">{c.citation}</span>
              )}
              {c.court && (
                <><span className="text-slate-300">·</span>
                <span className="font-mono text-xs text-slate-500">{c.court}</span></>
              )}
              {c.year && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span className="font-mono text-xs">{c.year}</span>
                </div>
              )}
              {c.jurisdiction && (
                <Badge variant="pending" className="text-[10px]">{c.jurisdiction}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {c.relevance_score != null && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-2.5 py-1">
              <span className="font-mono text-xs font-bold text-emerald-700">
                {Math.round(c.relevance_score * 100)}%
              </span>
            </div>
          )}
          <button
            onClick={onBookmark}
            className={cn(
              "rounded-xl p-2 transition-all duration-150 border",
              isBookmarked
                ? "bg-amber-50 text-amber-500 border-amber-200"
                : "text-slate-300 hover:bg-amber-50 hover:text-amber-400 hover:border-amber-100 border-transparent"
            )}
          >
            {isBookmarked
              ? <Star    className="h-4 w-4 fill-current" />
              : <StarOff className="h-4 w-4" />}
          </button>
          {c.saflii_url && (
            <a
              href={c.saflii_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150 opacity-0 group-hover:opacity-100"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {c.summary && (
        <p className="mt-3.5 text-sm text-slate-600 leading-relaxed line-clamp-3">{c.summary}</p>
      )}

      {c.tags?.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {c.tags.map((tag: string) => (
            <span key={tag} className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
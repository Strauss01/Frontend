"use client";

import { useState } from "react";
import {
  Search, BookOpen, Sparkles, ArrowRight,
  ExternalLink, Filter, Scale, ChevronDown, Clock,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useLegalSearch } from "@/features/search/hooks";

const JURISDICTIONS = [
  "All Jurisdictions",
  "Constitutional Court (ZACC)",
  "Supreme Court of Appeal (ZASCA)",
  "High Court — Gauteng",
  "High Court — Western Cape",
  "High Court — KwaZulu-Natal",
  "High Court — Eastern Cape",
  "Labour Court",
  "Competition Tribunal",
  "Land Claims Court",
];

const CATEGORIES = ["All", "Case Law", "Legislation", "Regulations", "Practice Directives", "Commentary"];

const SUGGESTIONS = [
  "section 34 Constitution fair trial",
  "POPIA data processing consent",
  "Companies Act directors duties",
  "unfair labour practice",
  "constitutional invalidity just and equitable",
  "restraint of trade reasonableness",
];

export default function SearchPage() {
  const [query,        setQuery]        = useState("");
  const [jurisdiction, setJurisdiction] = useState("All Jurisdictions");
  const [category,     setCategory]     = useState("All");
  const [focused,      setFocused]      = useState(false);

  const { data: results = [], isLoading, mutate: runSearch } = useLegalSearch();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    runSearch({ query, jurisdiction, category });
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-6">

      {/* ── Header ── */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-slate-900">Legal Search</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Semantic search across SA case law · Powered by{" "}
          <span className="font-mono text-[11px] text-indigo-500">Voyage AI voyage-law-2</span> embeddings
        </p>
      </div>

      {/* ── Search hero ── */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className={cn(
            "relative flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-sm transition-all duration-300",
            focused
              ? "border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.10)]"
              : "border-slate-200 hover:border-slate-300"
          )}>
            <Search className={cn("h-5 w-5 shrink-0 transition-colors", focused ? "text-indigo-500" : "text-slate-400")} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. Bhe v Magistrate Khayelitsha, section 25 property rights…"
              className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-xs text-slate-400 hover:text-slate-600">
                Clear
              </button>
            )}
            <Button type="submit" disabled={isLoading} className="shrink-0">
              {isLoading
                ? <><Clock className="h-4 w-4 animate-spin" /> Searching…</>
                : <>Search <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 font-mono text-xs text-slate-600 shadow-sm focus:outline-none focus:border-indigo-300"
              >
                {JURISDICTIONS.map((j) => <option key={j}>{j}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all duration-150",
                  category === c
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                )}
              >
                {c}
              </button>
            ))}

            <Button type="button" variant="outline" size="sm" className="ml-auto">
              <Filter className="h-3.5 w-3.5" /> Advanced
            </Button>
          </div>

          {/* SA-specific suggestions */}
          {!query && (
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Try:</span>
              {SUGGESTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-lg border border-indigo-100 bg-white px-2.5 py-1 font-mono text-xs text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* ── Results ── */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-xs text-slate-500">
            {results.length} result{results.length !== 1 ? "s" : ""} · ranked by semantic relevance
          </p>
          {results.map((r: any, i: number) => <ResultCard key={r.id ?? i} result={r} />)}
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
            <Scale className="h-9 w-9 text-indigo-400 animate-float" />
          </div>
          <h3 className="mt-5 font-serif text-xl font-semibold text-slate-800">Search SA legal sources</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
            Search across Constitutional Court judgments, SCA decisions, High Court rulings,
            legislation and Government Gazette notices.
          </p>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: any }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
              {result.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {result.citation && (
                <span className="font-mono text-xs text-slate-500">{result.citation}</span>
              )}
              {result.court && (
                <><span className="text-slate-300">·</span>
                <span className="font-mono text-xs text-slate-500">{result.court}</span></>
              )}
              {result.year && (
                <><span className="text-slate-300">·</span>
                <span className="font-mono text-xs text-slate-500">{result.year}</span></>
              )}
              {result.jurisdiction && (
                <Badge variant="pending" className="text-[10px]">{result.jurisdiction}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {result.relevance_score != null && (
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-bold text-emerald-700">
                {Math.round(result.relevance_score * 100)}% match
              </span>
            </div>
          )}
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ExternalLink className="h-3 w-3" /> SAFLII
            </a>
          )}
        </div>
      </div>

      {result.summary && (
        <p className="mt-3.5 text-sm text-slate-600 leading-relaxed line-clamp-3">{result.summary}</p>
      )}

      {result.tags?.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {result.tags.map((tag: string) => (
            <span key={tag} className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
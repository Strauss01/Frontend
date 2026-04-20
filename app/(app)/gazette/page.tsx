"use client";

import { useState } from "react";
import {
  Newspaper, Search, ExternalLink, Clock,
  Filter, BookmarkPlus, Bookmark,
  TrendingUp, ChevronDown, Rss, Bell,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useGazette, useBookmarkGazette } from "@/features/gazette/hooks";

const CATEGORIES = [
  "All",
  "Acts of Parliament",
  "Regulations",
  "Proclamations",
  "Government Notices",
  "Board Notices",
  "General Notices",
  "Court Notices",
];

const DEPARTMENTS = [
  "All Departments",
  "Justice & Constitutional Development",
  "Trade, Industry & Competition",
  "Labour",
  "Health",
  "Finance / National Treasury",
  "Home Affairs",
  "Communications & Digital Technologies",
  "Agriculture, Land Reform & Rural Development",
];

const SA_PROVINCES = [
  "National",
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Free State",
  "Northern Cape",
];

const TRENDING = [
  "POPIA enforcement",
  "National Health Insurance",
  "Companies Act amendment",
  "Expropriation Act",
  "Carbon Tax",
  "B-BBEE codes",
];

export default function GazettePage() {
  const [query,      setQuery]      = useState("");
  const [category,   setCategory]   = useState("All");
  const [department, setDepartment] = useState("All Departments");
  const [province,   setProvince]   = useState("National");

  const { data: items = [], isLoading }  = useGazette({ category, department, province });
  const bookmarkGazette                  = useBookmarkGazette();

  const visible = items.filter((item: any) =>
    !query || (item.title ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Government Gazette</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Live feed of South African Government Gazette notices and legislation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <Rss className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-mono text-xs font-medium text-emerald-700">Live feed</span>
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" /> Set Alert
          </Button>
        </div>
      </div>

      {/* ── Search & filters ── */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 shadow-sm">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gazette notices, acts, proclamations…"
              className={cn(
                "h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm shadow-sm",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300",
                "transition-all duration-200"
              )}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Province */}
            <div className="relative">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 font-mono text-xs text-slate-600 shadow-sm focus:outline-none focus:border-indigo-300"
              >
                {SA_PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Department */}
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 font-mono text-xs text-slate-600 shadow-sm focus:outline-none focus:border-indigo-300"
              >
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.slice(0, 5).map((c) => (
                <button
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
              <div className="relative">
                <select
                  value={CATEGORIES.slice(5).includes(category) ? category : ""}
                  onChange={(e) => e.target.value && setCategory(e.target.value)}
                  className="h-8 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 font-mono text-xs text-slate-500 focus:outline-none focus:border-indigo-300"
                >
                  <option value="">More…</option>
                  {CATEGORIES.slice(5).map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trending ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <div className="flex shrink-0 items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Trending:</span>
        </div>
        {TRENDING.map((t) => (
          <button
            key={t}
            onClick={() => setQuery(t)}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Newspaper className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No gazette notices found</p>
          <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-mono text-xs text-slate-500">
            {visible.length} notice{visible.length !== 1 ? "s" : ""} · sorted by date
          </p>
          {visible.map((item: any) => (
            <GazetteCard
              key={item.id}
              item={item}
              onBookmark={() => bookmarkGazette.mutate(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GazetteCard({ item, onBookmark }: { item: any; onBookmark: () => void }) {
  const categoryColors: Record<string, string> = {
    "Acts of Parliament": "default",
    "Regulations":        "pending",
    "Proclamations":      "warning",
    "Government Notices": "secondary",
    "Board Notices":      "secondary",
    "General Notices":    "secondary",
    "Court Notices":      "success",
  };
  const variant = (categoryColors[item.category] ?? "secondary") as any;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
            <Newspaper className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
              {item.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {item.gazette_number && (
                <span className="font-mono text-xs text-slate-400">GG {item.gazette_number}</span>
              )}
              {item.notice_number && (
                <><span className="text-slate-300">·</span>
                <span className="font-mono text-xs text-slate-400">Notice {item.notice_number}</span></>
              )}
              {item.date && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono text-xs">
                    {new Date(item.date).toLocaleDateString("en-ZA")}
                  </span>
                </div>
              )}
              <Badge variant={variant} className="text-[10px]">{item.category}</Badge>
              {item.is_new && (
                <Badge variant="success" className="text-[10px]">New</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={onBookmark}
            className={cn(
              "rounded-xl border p-2 transition-all duration-150",
              item.is_bookmarked
                ? "bg-amber-50 text-amber-500 border-amber-200"
                : "text-slate-300 hover:bg-amber-50 hover:text-amber-400 border-transparent hover:border-amber-100"
            )}
          >
            {item.is_bookmarked
              ? <Bookmark className="h-4 w-4 fill-current" />
              : <BookmarkPlus className="h-4 w-4" />}
          </button>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-mono text-xs text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ExternalLink className="h-3 w-3" /> View
            </a>
          )}
        </div>
      </div>

      {item.summary && (
        <p className="mt-3.5 text-sm text-slate-600 leading-relaxed line-clamp-3">{item.summary}</p>
      )}

      {item.department && (
        <p className="mt-2.5 font-mono text-[11px] text-slate-400">
          Dept: {item.department}
          {item.province && item.province !== "National" && ` · ${item.province}`}
        </p>
      )}
    </div>
  );
}
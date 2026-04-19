"use client";

import { useState } from "react";
import { Search, BookOpen, Newspaper, Scale, Filter } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { searchCases, searchLegislation, searchGazettes } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "cases" | "legislation" | "gazettes";

const COURTS = ["All Courts", "Constitutional Court", "SCA", "Labour Court", "CCMA", "Tax Court", "Competition Tribunal"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("cases");
  const [court, setCourt] = useState("All Courts");
  const [results, setResults] = useState<any[]>([]);

  const { mutate: search, isPending } = useMutation({
    mutationFn: () => {
      if (tab === "cases") return searchCases(query, court === "All Courts" ? undefined : court);
      if (tab === "legislation") return searchLegislation(query);
      return searchGazettes(query);
    },
    onSuccess: setResults,
    onError: () => toast.error("Search failed. Please try again."),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    search();
  };

  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">Legal Search</p>
        <h1 className="font-serif text-3xl font-bold text-white">Search SA Law</h1>
        <p className="text-muted-foreground mt-1">Semantic search across case law, legislation, and government gazettes.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='e.g. "unfair dismissal constructive" or "BEE compliance obligations"'
            className="pl-10 h-11"
          />
        </div>
        <Button type="submit" disabled={isPending || !query.trim()} className="h-11 px-6">
          {isPending ? "Searching…" : "Search"}
        </Button>
      </form>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(["cases", "legislation", "gazettes"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setResults([]); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "cases" && <Scale className="h-3.5 w-3.5" />}
            {t === "legislation" && <BookOpen className="h-3.5 w-3.5" />}
            {t === "gazettes" && <Newspaper className="h-3.5 w-3.5" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Court filter (cases only) */}
      {tab === "cases" && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {COURTS.map(c => (
            <button
              key={c}
              onClick={() => setCourt(c)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono border transition-colors",
                court === c
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-mono text-muted-foreground">{results.length} results</p>
          {results.map((r, i) => (
            <Card key={i} className="hover:border-primary/40 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm truncate">{r.title || r.name || "Untitled"}</p>
                    {r.citation && (
                      <p className="text-xs font-mono text-primary mt-1">{r.citation}</p>
                    )}
                    {r.court && (
                      <p className="text-xs text-muted-foreground mt-1">{r.court} {r.date_decided ? `· ${r.date_decided.split("T")[0]}` : ""}</p>
                    )}
                    {r.act_number && (
                      <p className="text-xs text-muted-foreground mt-1">Act {r.act_number} {r.year ? `of ${r.year}` : ""}</p>
                    )}
                    {r.summary && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.summary}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={cn(
                      "text-xs font-mono px-2 py-1 rounded-full",
                      r.similarity > 0.8 ? "bg-green-500/10 text-green-400" :
                      r.similarity > 0.6 ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {Math.round((r.similarity || 0) * 100)}% match
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !isPending && query && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No results found. Try a different query.</p>
        </div>
      )}
    </div>
  );
}

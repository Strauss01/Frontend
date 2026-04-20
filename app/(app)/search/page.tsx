"use client";

import { useState } from "react";
import {
  Search, BookOpen, Scale, Filter, ArrowRight,
  Clock, ExternalLink, Sparkles, ChevronDown,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";

const RESULTS = [
  {
    id: 1,
    title: "Donoghue v Stevenson [1932] AC 562",
    court: "House of Lords",
    year: "1932",
    jurisdiction: "UK",
    tags: ["Negligence", "Duty of Care", "Tort Law"],
    summary:
      "Landmark case establishing the modern concept of negligence in tort law. Introduced the neighbour principle and the existence of a general duty of care.",
    relevance: 98,
    type: "Case Law",
  },
  {
    id: 2,
    title: "Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256",
    court: "Court of Appeal",
    year: "1893",
    jurisdiction: "UK",
    tags: ["Contract", "Offer & Acceptance", "Consideration"],
    summary:
      "Seminal contract law case on unilateral contracts. Established that an advertisement containing a promise can constitute a binding offer to the world at large.",
    relevance: 94,
    type: "Case Law",
  },
  {
    id: 3,
    title: "Hadley v Baxendale (1854) 9 Ex Ch 341",
    court: "Court of Exchequer",
    year: "1854",
    jurisdiction: "UK",
    tags: ["Contract", "Remoteness of Damage", "Breach"],
    summary:
      "Defines the rules for measuring contract damages. Loss must either arise naturally from the breach or be within the reasonable contemplation of both parties.",
    relevance: 87,
    type: "Case Law",
  },
];

const SUGGESTIONS = [
  "duty of care negligence",
  "unfair contract terms",
  "frustration of contract",
  "implied warranty goods",
];

export default function SearchPage() {
  const [query,  setQuery]   = useState("");
  const [active, setActive]  = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => { setSearching(false); setHasResults(true); }, 800);
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-white">Legal Search</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Search across case law, legislation, and internal documents
        </p>
      </div>

      {/* Search hero */}
      <div className="glass layer-authority rounded-2xl p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Input */}
          <div
            className={cn(
              "relative flex items-center gap-3 rounded-xl border px-5 py-4 transition-all duration-300",
              active
                ? "border-primary/50 bg-primary/5 shadow-[0_0_40px_rgba(234,179,8,0.08)]"
                : "border-white/10 bg-white/5 hover:border-white/20"
            )}
          >
            <Search className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-primary" : "text-muted-foreground")} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              placeholder="Search case law, statutes, regulations…"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
              >
                Clear
              </button>
            )}
            <Button type="submit" size="sm" disabled={searching} className="shrink-0">
              {searching ? "Searching…" : "Search"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-fore
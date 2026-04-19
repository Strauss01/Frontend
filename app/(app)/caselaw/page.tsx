"use client";

import { BookOpen, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CaseLawPage() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">Case Law</p>
        <h1 className="font-serif text-3xl font-bold text-white">SA Case Law</h1>
        <p className="text-muted-foreground mt-1">Browse and search ingested South African judgments.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">No cases ingested yet</p>
          <p className="text-xs text-muted-foreground mb-4">
            Run the ingestion pipeline to populate the case law database from ConCourt, SCA, Labour Court, CCMA, Tax Court, and CompTrib.
          </p>
          <Link href="/search" className="flex items-center gap-2 text-xs text-primary hover:underline">
            <Search className="h-3.5 w-3.5" /> Search existing content
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Newspaper, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GazettePage() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">Gazette</p>
        <h1 className="font-serif text-3xl font-bold text-white">Government Gazette</h1>
        <p className="text-muted-foreground mt-1">Legislation, notices, and proclamations from OpenGazettes SA.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Newspaper className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">No gazettes ingested yet</p>
          <p className="text-xs text-muted-foreground mb-4">
            Run the gazette ingestion pipeline to populate this database from OpenGazettes SA.
          </p>
          <Link href="/search" className="flex items-center gap-2 text-xs text-primary hover:underline">
            <Search className="h-3.5 w-3.5" /> Search existing content
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

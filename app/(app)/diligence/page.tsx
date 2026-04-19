"use client";

import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function DiligencePage() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">Due Diligence</p>
        <h1 className="font-serif text-3xl font-bold text-white">Due Diligence Engine</h1>
        <p className="text-muted-foreground mt-1">Risk analysis, red flags, and recommendations on legal documents.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">Due diligence is part of Analysis</p>
          <p className="text-xs text-muted-foreground mb-4">
            Upload a document and run Analysis to see red flags, risks, and recommendations automatically.
          </p>
          <Link href="/analysis" className="text-xs text-primary hover:underline">
            Go to Analysis →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

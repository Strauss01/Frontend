"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const docId = params?.id;

  return (
    <div className="p-6 space-y-6">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/60 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* HEADER */}
      <GlassCard className="p-5">
        <h1 className="text-xl font-semibold">
          Document Analysis
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Document ID: {docId}
        </p>
      </GlassCard>

      {/* PLACEHOLDER CONTENT */}
      <GlassCard className="p-5">
        <p className="text-white/60">
          Analysis engine connected. Awaiting pipeline output...
        </p>
      </GlassCard>

    </div>
  );
}